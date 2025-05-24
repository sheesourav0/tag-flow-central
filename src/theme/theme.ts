
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e3f2fd',
      100: '#bbdefb',
      500: '#2196f3',
      600: '#1976d2',
    },
    industrial: {
      700: '#37474f',
      800: '#263238',
    },
  },
});

export default theme;
