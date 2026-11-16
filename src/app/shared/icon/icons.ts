// Hand-drawn 24×24 stroke icons (rendered with stroke="currentColor").
// Each icon is a list of path `d` strings; circles are expressed as two arcs via `circle()`.

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

export const ICONS = {
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h10'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  'arrow-right': ['M5 12h14', 'M13 6l6 6-6 6'],
  'arrow-up': ['M12 19V5', 'M6 11l6-6 6 6'],
  'chevron-down': ['M6 9l6 6 6-6'],
  'chevron-left': ['M15 6l-6 6 6 6'],
  'chevron-right': ['M9 6l6 6-6 6'],
  phone: [
    'M6.5 3.5h2.7l1.5 3.9-1.9 1.2a11 11 0 0 0 6.6 6.6l1.2-1.9 3.9 1.5v2.7a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z',
  ],
  mail: [
    'M5 5.5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z',
    'M3.6 7 12 13l8.4-6',
  ],
  pin: ['M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11z', circle(12, 10, 2.4)],
  document: [
    'M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5a1.5 1.5 0 0 1 1-1.5z',
    'M14 3.5V8h4',
    'M9 12.5h6',
    'M9 16h6',
  ],
  instagram: [
    'M8 3.5h8A4.5 4.5 0 0 1 20.5 8v8a4.5 4.5 0 0 1-4.5 4.5H8A4.5 4.5 0 0 1 3.5 16V8A4.5 4.5 0 0 1 8 3.5z',
    circle(12, 12, 3.8),
    circle(17.1, 6.9, 0.35),
  ],
  telegram: ['M20.5 4.2 3.6 10.8l5.6 2 1.9 6.2 3.2-3.6 4.6 3.5z', 'M9.2 12.8l11.3-8.6'],
  whatsapp: [
    'M4.2 19.8l1.2-4.1A8.4 8.4 0 1 1 8.6 19z',
    'M9 8.6c.4-.7 1.1-.7 1.4 0l.6 1.5-.9 1a5.6 5.6 0 0 0 2.8 2.8l1-.9 1.5.6c.7.3.7 1 0 1.4-.9.6-2.1.7-3.2.2a8 8 0 0 1-3.4-3.4c-.5-1.1-.4-2.3.2-3.2z',
  ],
} as const satisfies Record<string, readonly string[]>;

export type IconName = keyof typeof ICONS;
