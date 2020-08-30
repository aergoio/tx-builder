export const iconNames = [
  'arrow',
  'checkmark',
  'danger',
  'logo',
  'net',
] as const;

export type IconName = typeof iconNames[number];