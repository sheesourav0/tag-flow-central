
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#E3F2FD',
      100: '#BBDEFB',
      200: '#90CAF9',
      300: '#64B5F6',
      400: '#42A5F5',
      500: '#2196F3',
      600: '#1E88E5',
      700: '#1976D2',
      800: '#1565C0',
      900: '#0D47A1',
    },
    industrial: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    }
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  components: {
    Button: {
      defaultProps: {
        size: 'sm',
      },
      variants: {
        industrial: {
          bg: 'industrial.600',
          color: 'white',
          _hover: {
            bg: 'industrial.700',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          boxShadow: 'sm',
          borderRadius: 'md',
          border: '1px solid',
          borderColor: 'gray.200',
        },
      },
    },
  },
});

export default theme;
