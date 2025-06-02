
import React from 'react';
import {
  Box,
  Heading,
  Text,
} from '@chakra-ui/react';

const Header: React.FC = () => {
  return (
    <Box bg="white" borderBottom="1px" borderColor="gray.200" p={6}>
      <Heading size="lg" color="gray.800" mb={2}>
        TagFlow Central
      </Heading>
      <Text color="gray.600">
        Industrial tag management system with real-time data connectivity
      </Text>
    </Box>
  );
};

export default Header;
