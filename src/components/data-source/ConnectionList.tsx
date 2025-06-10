
import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Badge,
} from '@chakra-ui/react';
import { MdStorage, MdLanguage, MdWifi, MdPlayArrow } from 'react-icons/md';

interface ConnectionListProps {
  connections: any[];
  onSelect: (connection: any) => void;
  onTest: (connection: any) => void;
  connectionData: any;
}

const ConnectionList: React.FC<ConnectionListProps> = ({
  connections,
  onSelect,
  onTest,
  connectionData,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'rest_api':
        return MdLanguage;
      case 'websocket':
        return MdWifi;
      case 'mqtt':
        return MdStorage;
      default:
        return MdStorage;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'yellow';
      case 'error':
        return 'red';
      default:
        return 'gray';
    }
  };

  if (connections.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">No connections available</Text>
        <Text color="gray.400" fontSize="sm" mt={2}>
          Create a connection first to proceed
        </Text>
      </Box>
    );
  }

  return (
    <VStack gap={3} align="stretch">
      {connections.map((connection) => {
        const IconComponent = getIcon(connection.type);
        
        return (
          <Box
            key={connection.id}
            p={4}
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
            _hover={{ shadow: 'sm' }}
          >
            <HStack justify="space-between">
              <HStack gap={3}>
                <IconComponent size={20} />
                <VStack align="start" gap={0}>
                  <Text fontWeight="medium">{connection.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {connection.type.replace('_', ' ').toUpperCase()}
                  </Text>
                </VStack>
                <Badge colorScheme={getStatusColor(connection.status)}>
                  {connection.status}
                </Badge>
              </HStack>
              
              <HStack gap={2}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onTest(connection)}
                >
                  <MdPlayArrow size={16} style={{ marginRight: '4px' }} />
                  Test
                </Button>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => onSelect(connection)}
                >
                  Select
                </Button>
              </HStack>
            </HStack>

            {connection.description && (
              <Text fontSize="sm" color="gray.600" mt={2}>
                {connection.description}
              </Text>
            )}
          </Box>
        );
      })}
    </VStack>
  );
};

export default ConnectionList;
