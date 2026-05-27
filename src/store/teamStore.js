import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isSupabaseConfigured, supabase } from '../utils/supabaseClient';

function normalizeTeam(team) {
  return {
    id: team.id || `team-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: team.name || 'Untitled Team',
    eventId: team.eventId || team.event_id || null,
    members: Array.isArray(team.members) ? team.members : Array.isArray(team.players) ? team.players : [],
    players: Array.isArray(team.players) ? team.players : [],
    stats: team.stats || { wins: 0, losses: 0, draws: 0, points: 0 },
    status: team.status || 'active',
    createdAt: team.createdAt || team.created_at || new Date().toISOString(),
  };
}

const useTeamStore = create(
  persist(
    (set, get) => ({
      teams: [],
      loading: false,
      error: null,

      fetchTeams: async (eventId) => {
        set({ loading: true, error: null });

        if (!isSupabaseConfigured) {
          const teams = eventId
            ? get().teams.filter((team) => String(team.eventId) === String(eventId))
            : get().teams;
          set({ loading: false });
          return teams;
        }

        try {
          let query = supabase.from('teams').select('*').order('created_at', { ascending: false });
          if (eventId) {
            query = query.eq('event_id', eventId);
          }
          const { data, error } = await query;
          if (error) throw error;

          const teams = (data || []).map(normalizeTeam);
          set({
            teams: eventId
              ? [...teams, ...get().teams.filter((team) => String(team.eventId) !== String(eventId))]
              : teams,
            loading: false,
            error: null,
          });
          return teams;
        } catch (error) {
          console.error('Error fetching teams:', error.message);
          set({ loading: false, error: error.message, teams: eventId ? get().teams.filter((team) => String(team.eventId) !== String(eventId)) : [] });
          return [];
        }
      },

      createTeam: async (data) => {
        const team = normalizeTeam(data);
        set((state) => ({ teams: [team, ...state.teams] }));

        if (!isSupabaseConfigured) {
          return team;
        }

        try {
          const { data: inserted, error } = await supabase
            .from('teams')
            .upsert([{
              id: team.id,
              name: team.name,
              event_id: team.eventId,
              members: team.members,
              players: team.players,
              stats: team.stats,
              status: team.status,
              created_at: team.createdAt,
            }])
            .select()
            .single();
          if (error) throw error;

          const normalized = normalizeTeam(inserted || team);
          set((state) => ({
            teams: state.teams.map((entry) => (String(entry.id) === String(team.id) ? normalized : entry)),
          }));
          return normalized;
        } catch (error) {
          console.error('Error creating team:', error.message);
          set((state) => ({
            teams: state.teams.filter((entry) => String(entry.id) !== String(team.id)),
            error: error.message,
          }));
          return null;
        }
      },

      updateTeam: async (id, updates) => {
        const existing = get().getTeamById(id);
        if (!existing) return null;

        const updatedTeam = normalizeTeam({ ...existing, ...updates, id });
        set((state) => ({
          teams: state.teams.map((team) => (String(team.id) === String(id) ? updatedTeam : team)),
        }));

        if (!isSupabaseConfigured) {
          return updatedTeam;
        }

        try {
          const { error } = await supabase.from('teams').upsert([{
            id: updatedTeam.id,
            name: updatedTeam.name,
            event_id: updatedTeam.eventId,
            members: updatedTeam.members,
            players: updatedTeam.players,
            stats: updatedTeam.stats,
            status: updatedTeam.status,
            created_at: updatedTeam.createdAt,
          }]);
          if (error) throw error;
        } catch (error) {
          console.error('Error updating team:', error.message);
          set({ error: error.message });
        }

        return updatedTeam;
      },

      deleteTeam: async (id) => {
        set((state) => ({ teams: state.teams.filter((team) => String(team.id) !== String(id)) }));

        if (!isSupabaseConfigured) {
          return true;
        }

        try {
          const { error } = await supabase.from('teams').delete().eq('id', id);
          if (error) throw error;
        } catch (error) {
          console.error('Error deleting team:', error.message);
          set({ error: error.message });
        }

        return true;
      },

      addPlayer: async (teamId, player) => {
        const team = get().getTeamById(teamId);
        if (!team) return null;
        const players = [...(team.players || []), { id: Date.now(), ...player }];
        return get().updateTeam(teamId, { players });
      },

      removePlayer: async (teamId, playerId) => {
        const team = get().getTeamById(teamId);
        if (!team) return null;
        const players = (team.players || []).filter((player) => String(player.id) !== String(playerId));
        return get().updateTeam(teamId, { players });
      },

      updateStats: async (teamId, stats) => {
        const team = get().getTeamById(teamId);
        if (!team) return null;
        return get().updateTeam(teamId, { stats: { ...team.stats, ...stats } });
      },

      getTeamById: (id) => get().teams.find((team) => String(team.id) === String(id)) || null,
      getTeamsByEvent: (eventId) => get().teams.filter((team) => String(team.eventId) === String(eventId)),
    }),
    {
      name: 'fairplay_teams',
      merge: (persistedState, currentState) => {
        if (isSupabaseConfigured) {
          return {
            ...currentState,
            ...(persistedState || {}),
            teams: currentState.teams,
          };
        }

        return {
          ...currentState,
          ...(persistedState || {}),
        };
      },
    }
  )
);

export default useTeamStore;
