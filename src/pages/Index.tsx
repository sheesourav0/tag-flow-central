
import { ChakraProvider } from '@chakra-ui/react';
import TagFlowCentral from '../components/TagFlowCentral';
import { system } from '../theme/theme';

const Index = () => {
  return (
    <ChakraProvider value={system}>
      <TagFlowCentral />
    </ChakraProvider>
  );
};

export default Index;
