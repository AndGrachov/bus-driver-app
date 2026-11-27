/**
 * Field tones: `surface` on the page background, `inset` on a surface card.
 */
export const FieldTone = { surface: 'surface', inset: 'inset' } as const;
export type FieldToneValue = (typeof FieldTone)[keyof typeof FieldTone];
