export const DIRECTORIES_COLORS = {
  light: {
    card: {
      background: '#F8F8FA',
      border: '#EAE9EF',
    },
    title: '#363440',
    description: '#2A292E',
    stats: '#6F6C7D',
    button: {
      background: '#363440',
      color: '#FFFFFF',
      hover: '#2A2833',
    },
  },
  dark: {
    card: {
      background: '#282828',
      border: '#EAE9EF',
    },
    title: '#F7F4FD',
    description: '#F7F4FD',
    stats: '#B0ADBD',
    button: {
      background: '#FFFFFF',
      color: '#363440',
      hover: '#F0F0F0',
    },
  },
} as const;

export const BADGE_COLORS = {
  capital: {
    background: 'linear-gradient(to right, #fef1d7, #d5bb9b)',
    color: '#363440',
    iconColor: '#363440',
  },
  other: {
    background: 'linear-gradient(to right, #369B7C, #266C57)',
    color: '#FFFFFF',
  },
} as const;

export const PATTERN_STYLES = {
  backgroundImage:
    'radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)',
  backgroundSize: '10px 10px',
  maskImage:
    'radial-gradient(ellipse 600px 500px at top right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.25) 25%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0.05) 65%, rgba(0,0,0,0) 85%)',
} as const;
