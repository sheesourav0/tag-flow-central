
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
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
});

export const system = createSystem(defaultConfig, config);
