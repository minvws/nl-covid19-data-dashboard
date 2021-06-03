export const situationIdentifiers = [
  'gatherings',
  'healthcare',
  'homevisit',
  'horeca',
  'school',
  'travelling',
  'work',
  'other',
] as const;

export type SituationIdentifier = typeof situationIdentifiers[number];