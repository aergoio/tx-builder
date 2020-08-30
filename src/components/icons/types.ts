export const iconNames = [
  'aergo',
  'aergo-light',
  'arrow',
  'checkmark',
  'danger',
  'checkmark-circle',
  'danger-circle',
  'net',
] as const;

export type IconName = typeof iconNames[number];