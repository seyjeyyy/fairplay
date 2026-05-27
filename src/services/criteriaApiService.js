const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

function getApiConfig() {
  const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
  const groqKey = import.meta.env.VITE_GROQ_API_KEY || '';
  const provider = import.meta.env.VITE_AI_CRITERIA_PROVIDER || (openRouterKey ? 'openrouter' : groqKey ? 'groq' : 'openrouter');
  const model = import.meta.env.VITE_AI_CRITERIA_MODEL || 'openai/gpt-4o-mini';
  const apiKey = provider === 'groq' ? groqKey : openRouterKey;

  return {
    provider,
    apiKey,
    model,
    url: provider === 'groq' ? GROQ_URL : OPENROUTER_URL,
    enabled: Boolean(apiKey),
  };
}

export function buildCriteriaPrompt(payload) {
  return `
Generate three professional judging rubric profiles for the FairPlay event management system.

Output strict JSON with this shape:
{
  "profiles": [
    {
      "profile": "Balanced Professional",
      "criteria": [
        {
          "id": "criterion-1",
          "name": "Technical Execution",
          "weight": 30,
          "description": "How well the participant performs the required skills",
          "scoringRange": "1-10",
          "judgeInstructions": "Score based on observable performance"
        }
      ],
      "scoringMethod": "Weighted Rubric",
      "tieBreaker": ["Highest technical score"],
      "judgeInstructions": "Apply the rubric consistently across all contestants."
    }
  ],
  "requestMeta": {
    "notes": "Short explanation of what changed between profiles"
  }
}

Rules:
- Return exactly 3 profiles with clearly different emphasis.
- Total criteria weight per profile must equal 100.
- Support audience impact only when appropriate for the event.
- If this is a sports fest or multi-event, tailor the rubric to the selected sub-event.
- Include at least 5 criteria in every profile.
- Include practical descriptions and judge instructions.
- Use the uploaded template if provided, but improve it professionally.
- Respect the organizer prompt override.
- Include tie-breakers that fit close judging scenarios.

Event payload:
${JSON.stringify(payload, null, 2)}
  `.trim();
}

export function buildEventDescriptionPrompt(payload) {
  return `
Write one editable event description for the FairPlay event management system.

Output strict JSON with this shape:
{
  "description": "A concise organizer-ready description."
}

Rules:
- Write 2 to 4 polished sentences.
- Mention the event purpose, expected participants, competition format, and judging flow when relevant.
- Keep it neutral, professional, and easy for an organizer to edit.
- Do not invent exact dates, venue names, fees, prizes, sponsors, or participant counts.
- Do not include markdown, bullet points, headings, or quotation marks around the description.

Event payload:
${JSON.stringify(payload, null, 2)}
  `.trim();
}

export function parseCriteriaApiResponse(content) {
  const fenced = content.match(/```json\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : content;
  return JSON.parse(raw);
}

function rebalanceWeights(criteria = []) {
  const normalized = criteria.map((criterion, index) => ({
    id: criterion.id || `criterion-${index + 1}`,
    name: criterion.name || `Criterion ${index + 1}`,
    weight: Number(criterion.weight || 0),
    description: criterion.description || '',
    scoringRange: criterion.scoringRange || '1-10',
    judgeInstructions: criterion.judgeInstructions || 'Score based on observable performance.',
  }));

  if (!normalized.length) return normalized;

  const total = normalized.reduce((sum, criterion) => sum + criterion.weight, 0);
  if (total === 100) {
    return normalized;
  }

  const base = Math.floor(100 / normalized.length);
  const remainder = 100 % normalized.length;
  return normalized.map((criterion, index) => ({
    ...criterion,
    weight: base + (index < remainder ? 1 : 0),
  }));
}

function normalizeProfiles(rawProfiles = []) {
  return rawProfiles
    .filter(Boolean)
    .map((profile, index) => ({
      profile: profile.profile || `Profile ${index + 1}`,
      criteria: rebalanceWeights(Array.isArray(profile.criteria) ? profile.criteria : []),
      scoringMethod: profile.scoringMethod || 'Weighted Rubric',
      tieBreaker: Array.isArray(profile.tieBreaker) && profile.tieBreaker.length > 0
        ? profile.tieBreaker
        : ['Highest weighted total score'],
      judgeInstructions: profile.judgeInstructions || 'Apply the rubric consistently across all contestants.',
    }))
    .filter((profile) => profile.criteria.length >= 5);
}

export async function requestCriteriaProfiles(payload) {
  const config = getApiConfig();
  if (!config.enabled) {
    throw new Error('AI criteria API key is not configured.');
  }

  const response = await fetch(config.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
      ...(config.provider === 'openrouter'
        ? {
            'HTTP-Referer': window.location.origin,
            'X-Title': 'FairPlay Criteria Generator',
          }
        : {}),
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: 'You are a judging rubric generator for academic, sports, and cultural competitions.',
        },
        {
          role: 'user',
          content: buildCriteriaPrompt(payload),
        },
      ],
      temperature: 0.4,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error(`Criteria API request failed with status ${response.status}.`);
  }

  const json = await response.json();
  const content = json?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Criteria API returned an empty response.');
  }

  const parsed = parseCriteriaApiResponse(content);
  const rawProfiles = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.profiles)
      ? parsed.profiles
      : Array.isArray(parsed?.data)
        ? parsed.data
        : [];
  const normalizedProfiles = normalizeProfiles(rawProfiles);

  if (normalizedProfiles.length > 0) {
    return normalizedProfiles;
  }

  throw new Error('Criteria API response format is invalid.');
}

export async function requestEventDescription(payload) {
  const config = getApiConfig();
  if (!config.enabled) {
    throw new Error('AI description API key is not configured.');
  }

  const response = await fetch(config.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
      ...(config.provider === 'openrouter'
        ? {
            'HTTP-Referer': window.location.origin,
            'X-Title': 'FairPlay Event Description Generator',
          }
        : {}),
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: 'You draft concise event descriptions for school, sports, cultural, and academic competitions.',
        },
        {
          role: 'user',
          content: buildEventDescriptionPrompt(payload),
        },
      ],
      temperature: 0.45,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error(`Description API request failed with status ${response.status}.`);
  }

  const json = await response.json();
  const content = json?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Description API returned an empty response.');
  }

  const parsed = parseCriteriaApiResponse(content);
  const description = String(parsed?.description || '').trim();
  if (!description) {
    throw new Error('Description API response format is invalid.');
  }

  return description;
}

export function isCriteriaApiEnabled() {
  return getApiConfig().enabled;
}
