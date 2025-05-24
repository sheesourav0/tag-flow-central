
import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import TagFlowCentral from '../components/TagFlowCentral';
import theme from '../theme/theme';

const Index = () => {
  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="gray.50">
        <TagFlowCentral />
      </Box>
    </ChakraProvider>
  );
};

export default Index;
