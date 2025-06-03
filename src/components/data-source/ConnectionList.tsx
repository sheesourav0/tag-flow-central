
import React from 'react';
import {
  Stack,
  HStack,
  Box,
  Text,
  Badge,
  IconButton,
  Button,
} from '@chakra-ui/react';
import { Edit, Trash2 } from 'lucide-react';

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
    <Stack gap={4}>
      <Text fontSize="sm" color="gray.600">
        Manage active data source connections for your tags.
      </Text>
      
      {connections.map((connection) => (
        <Box key={connection.id} p={4} border="1px" borderColor="gray.200" borderRadius="md">
          <HStack justify="space-between">
            <Stack gap={2}>
              <HStack gap={2}>
                <Text fontWeight="semibold">{connection.name}</Text>
                <Badge colorPalette={getStatusColor(connection.status)}>
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
            </Stack>
            
            <HStack gap={2}>
              <Button
                size="xs"
                colorPalette="blue"
                onClick={() => onTest(connection)}
              >
                Test
              </Button>
              <IconButton
                aria-label="Edit connection"
                size="xs"
                variant="ghost"
              >
                <Edit size={14} />
              </IconButton>
              <IconButton
                aria-label="Delete connection"
                size="xs"
                variant="ghost"
                colorPalette="red"
              >
                <Trash2 size={14} />
              </IconButton>
            </HStack>
          </HStack>
        </Box>
      ))}
    </Stack>
  );
};

export default ConnectionList;
