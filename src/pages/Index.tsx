
import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import TagFlowCentral from '../components/TagFlowCentral';

const Index = () => {
  return (
    <ChakraProvider>
      <Box minH="100vh" bg="gray.50">
        <TagFlowCentral />
      </Box>
    </ChakraProvider>
  );
};

export default Index;
