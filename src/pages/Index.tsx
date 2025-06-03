
import { ChakraProvider } from '@chakra-ui/react';
import { system } from '../theme/theme';
import TagFlowCentral from '../components/TagFlowCentral';

const Index = () => {
  return (
    <ChakraProvider value={system}>
      <TagFlowCentral />
    </ChakraProvider>
  );
};

export default Index;
