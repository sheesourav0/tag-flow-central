
import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Badge,
  Icon,
  SimpleGrid,
  Heading,
} from '@chakra-ui/react';
import { Database, Globe, Wifi, Play } from 'lucide-react';
import { DataSource } from '../../types/dataSource';

interface ConnectionListProps {
  connections: DataSource[];
  onSelect: (connection: DataSource) => void;
  onTest: (connection: DataSource) => void;
  connectionData: Record<string, any>;
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
        return Globe;
      case 'websocket':
        return Wifi;
      case 'mqtt':
        return Database;
      default:
        return Database;
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
        <Icon as={Database} boxSize={12} color="gray.400" mb={4} />
        <Heading size="md" color="gray.600" mb={2}>
          No connections available
        </Heading>
        <Text color="gray.500">
          Create a connection first to proceed with data source configuration
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Text fontSize="lg" fontWeight="semibold" color="gray.800">
        Select a Connection
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {connections.map((connection) => (
          <Box
            key={connection.id}
            p={6}
            bg="white"
            borderRadius="lg"
            border="1px"
            borderColor="gray.200"
            _hover={{ borderColor: 'primary.300', shadow: 'md' }}
            transition="all 0.2s"
            cursor="pointer"
            onClick={() => onSelect(connection)}
          >
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <HStack spacing={3}>
                  <Box
                    p={2}
                    bg="blue.100"
                    borderRadius="md"
                  >
                    <Icon as={getIcon(connection.type)} color="blue.500" boxSize={5} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="semibold" color="gray.800">
                      {connection.name}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {connection.type.replace('_', ' ').toUpperCase()}
                    </Text>
                  </VStack>
                </HStack>
                <Badge colorScheme={getStatusColor(connection.status)} size="sm">
                  {connection.status}
                </Badge>
              </HStack>

              {connection.description && (
                <Text fontSize="sm" color="gray.600" noOfLines={2}>
                  {connection.description}
                </Text>
              )}

              <HStack spacing={2}>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Icon as={Play} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTest(connection);
                  }}
                >
                  Test
                </Button>
                <Button
                  size="sm"
                  colorScheme="primary"
                  onClick={() => onSelect(connection)}
                >
                  Select
                </Button>
              </HStack>

              {connectionData[connection.id] && (
                <Box
                  p={3}
                  bg="green.50"
                  borderRadius="md"
                  border="1px"
                  borderColor="green.200"
                >
                  <Text fontSize="xs" color="green.700" fontWeight="medium">
                    ✓ Connection tested successfully
                  </Text>
                </Box>
              )}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default ConnectionList;
