import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isSupabaseConfigured, supabase } from '../utils/supabaseClient';

function submissionKey(eventId, contestantId, voterKey) {
  return `${eventId}_${contestantId}_${voterKey}`;
}

function normalizeAudienceSubmission(row = {}) {
  const eventId = row.eventId || row.event_id;
  const contestantId = row.contestantId || row.contestant_id;
  const voterKey = row.voterKey || row.voter_key || '';

  return {
    id: String(row.id || submissionKey(eventId, contestantId, voterKey)),
    eventId,
    contestantId,
    contestantName: row.contestantName || row.contestant_name || '',
    voterKey,
    score: Number(row.score || 0),
    createdAt: row.createdAt || row.created_at || new Date().toISOString(),
  };
}

const useAudienceScoreStore = create(
  persist(
    (set, get) => ({
      submissions: {},
      loading: false,
      error: null,

      fetchAudienceScores: async (eventId) => {
        set({ loading: true, error: null });

        if (!isSupabaseConfigured || !supabase) {
          set({ loading: false });
          return eventId ? get().getSubmissionsForEvent(eventId) : Object.values(get().submissions);
        }

        try {
          let query = supabase.from('audience_scores').select('*').order('created_at', { ascending: false });
          if (eventId) query = query.eq('event_id', eventId);

          const { data, error } = await query;
          if (error) throw error;

          const incoming = {};
          (data || []).map(normalizeAudienceSubmission).forEach((submission) => {
            incoming[submission.id] = submission;
          });

          set((state) => ({
            submissions: { ...state.submissions, ...incoming },
            loading: false,
            error: null,
          }));

          return eventId ? get().getSubmissionsForEvent(eventId) : Object.values(get().submissions);
        } catch (error) {
          set({ loading: false, error: error?.message || 'Unable to load audience scores.' });
          return eventId ? get().getSubmissionsForEvent(eventId) : Object.values(get().submissions);
        }
      },

      submitAudienceScore: async ({ eventId, contestantId, contestantName, voterKey, score }) => {
        const normalizedScore = Number(score);
        if (!eventId || !contestantId || !voterKey || !Number.isFinite(normalizedScore) || normalizedScore < 1 || normalizedScore > 10) {
          throw new Error('Please select a participant and enter a valid score from 1 to 10.');
        }

        const id = submissionKey(eventId, contestantId, voterKey);
        if (get().submissions[id]) {
          throw new Error('This device/session already submitted an audience score for this participant.');
        }

        const nextSubmission = normalizeAudienceSubmission({
          id,
          eventId,
          contestantId,
          contestantName,
          voterKey,
          score: normalizedScore,
          createdAt: new Date().toISOString(),
        });

        set((state) => ({
          submissions: {
            ...state.submissions,
            [id]: nextSubmission,
          },
        }));

        if (!isSupabaseConfigured || !supabase) {
          return nextSubmission;
        }

        const payload = {
          id,
          event_id: eventId,
          contestant_id: String(contestantId),
          contestant_name: contestantName || '',
          voter_key: voterKey,
          score: normalizedScore,
          created_at: nextSubmission.createdAt,
        };

        const { data, error } = await supabase
          .from('audience_scores')
          .insert([payload])
          .select()
          .single();

        if (error) {
          if (String(error.message || '').toLowerCase().includes('duplicate')) {
            throw new Error('This device/session already submitted an audience score for this participant.');
          }
          throw error;
        }

        const saved = normalizeAudienceSubmission(data || nextSubmission);
        set((state) => ({ submissions: { ...state.submissions, [saved.id]: saved } }));
        return saved;
      },

      getSubmissionsForEvent: (eventId) =>
        Object.values(get().submissions).filter((submission) => String(submission.eventId) === String(eventId)),

      getAudienceSummary: (eventId) => {
        const rows = get().getSubmissionsForEvent(eventId);
        const byContestant = {};

        rows.forEach((row) => {
          const key = String(row.contestantId);
          if (!byContestant[key]) {
            byContestant[key] = {
              contestantId: row.contestantId,
              contestantName: row.contestantName || `Participant ${row.contestantId}`,
              total: 0,
              count: 0,
              averageScore: 0,
            };
          }
          byContestant[key].total += Number(row.score || 0);
          byContestant[key].count += 1;
        });

        Object.values(byContestant).forEach((entry) => {
          entry.averageScore = entry.count > 0 ? Math.round((entry.total / entry.count) * 100) / 100 : 0;
        });

        return {
          totalSubmissions: rows.length,
          byContestant,
          rows,
        };
      },
    }),
    {
      name: 'fairplay_audience_scores',
      partialize: (state) => ({ submissions: state.submissions }),
      merge: (persistedState, currentState) => {
        if (isSupabaseConfigured) {
          return { ...currentState, ...(persistedState || {}), submissions: currentState.submissions };
        }
        return { ...currentState, ...(persistedState || {}) };
      },
    }
  )
);

export default useAudienceScoreStore;
