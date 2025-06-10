
import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Badge,
  SimpleGrid,
  Heading,
} from '@chakra-ui/react';
import { MdStorage, MdLanguage, MdWifi, MdPlayArrow } from 'react-icons/md';
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
        <MdStorage size={48} color="gray" style={{ margin: '0 auto 16px' }} />
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
    <VStack gap={6} align="stretch">
      <Text fontSize="lg" fontWeight="semibold" color="gray.800">
        Select a Connection
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        {connections.map((connection) => {
          const IconComponent = getIcon(connection.type);
          return (
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
              <VStack align="stretch" gap={4}>
                <HStack justify="space-between">
                  <HStack gap={3}>
                    <Box
                      p={2}
                      bg="blue.100"
                      borderRadius="md"
                    >
                      <IconComponent size={20} color="blue" />
                    </Box>
                    <VStack align="start" gap={0}>
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
                  <Text fontSize="sm" color="gray.600" lineClamp={2}>
                    {connection.description}
                  </Text>
                )}

                <HStack gap={2}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTest(connection);
                    }}
                  >
                    <MdPlayArrow size={16} style={{ marginRight: '8px' }} />
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
          );
        })}
      </SimpleGrid>
    </VStack>
  );
};

export default ConnectionList;
