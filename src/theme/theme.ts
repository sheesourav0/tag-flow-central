
import { createSystem, defaultConfig } from '@chakra-ui/react';

const customConfig = {
  ...defaultConfig,
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#e3f2fd' },
          100: { value: '#bbdefb' },
          500: { value: '#2196f3' },
          600: { value: '#1976d2' },
        },
        industrial: {
          700: { value: '#37474f' },
          800: { value: '#263238' },
        },
      },
    },
  },
};

export const system = createSystem(customConfig);
