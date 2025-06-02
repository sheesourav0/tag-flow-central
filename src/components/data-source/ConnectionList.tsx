
import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Badge,
  IconButton,
  Button,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

interface Connection {
  id: string;
  name: string;
  type: string;
  endpoint: string;
  status: string;
  lastUpdate: string;
}

interface ConnectionListProps {
  connections: Connection[];
  onTest: (connection: Connection) => void;
}

const ConnectionList: React.FC<ConnectionListProps> = ({ connections, onTest }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected': return 'green';
      case 'Disconnected': return 'red';
      case 'Connecting': return 'yellow';
      default: return 'gray';
    }
  };

  return (
    <VStack align="stretch" spacing={4}>
      <Text fontSize="sm" color="gray.600">
        Manage active data source connections for your tags.
      </Text>
      
      {connections.map((connection) => (
        <Box key={connection.id} p={4} border="1px" borderColor="gray.200" borderRadius="md">
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={2}>
              <HStack spacing={2}>
                <Text fontWeight="semibold">{connection.name}</Text>
                <Badge colorScheme={getStatusColor(connection.status)}>
                  {connection.status}
                </Badge>
                <Badge variant="outline">{connection.type}</Badge>
              </HStack>
              <Text fontSize="xs" fontFamily="mono" bg="gray.100" p={1} borderRadius="md">
                {connection.endpoint}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Last Update: {new Date(connection.lastUpdate).toLocaleString()}
              </Text>
            </VStack>
            
            <HStack spacing={2}>
              <Button
                size="xs"
                colorScheme="blue"
                onClick={() => onTest(connection)}
              >
                Test
              </Button>
              <IconButton
                aria-label="Edit connection"
                size="xs"
                variant="ghost"
                icon={<EditIcon />}
              />
              <IconButton
                aria-label="Delete connection"
                size="xs"
                variant="ghost"
                colorScheme="red"
                icon={<DeleteIcon />}
              />
            </HStack>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

export default ConnectionList;
