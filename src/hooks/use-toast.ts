
import { useToast as useChakraToast } from '@chakra-ui/react';

export const useToast = () => {
  const toast = useChakraToast();
  
  return {
    toast: (options: {
      title: string;
      description?: string;
      variant?: 'default' | 'destructive';
    }) => {
      toast({
        title: options.title,
        description: options.description,
        status: options.variant === 'destructive' ? 'error' : 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };
};
