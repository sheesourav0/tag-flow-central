
import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme/chakraTheme';
import Dashboard from './pages/Dashboard';
import { Toaster } from './components/ui/toaster';

const queryClient = new QueryClient();

function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Box minH="100vh" bg="gray.50">
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
            <Toaster />
          </Box>
        </Router>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
