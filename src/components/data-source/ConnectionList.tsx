
import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Badge,
  IconButton,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { DataSource, useDataSources } from '../../hooks/useDataSources';

interface ConnectionListProps {
  connections: DataSource[];
  onTest: (connection: DataSource) => void;
}

const ConnectionList: React.FC<ConnectionListProps> = ({ connections, onTest }) => {
  const { deleteDataSource, isLoading } = useDataSources();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteId, setDeleteId] = React.useState<string>('');
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected': return 'green';
      case 'Disconnected': return 'red';
      case 'Connecting': return 'yellow';
      case 'Error': return 'red';
      default: return 'gray';
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    onOpen();
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteDataSource(deleteId);
      setDeleteId('');
      onClose();
    }
  };

  return (
    <>
      <VStack align="stretch" spacing={4}>
        <Text fontSize="sm" color="gray.600">
          Manage active data source connections for your tags.
        </Text>
        
        {connections.length === 0 ? (
          <Box p={8} textAlign="center" borderRadius="md" border="1px dashed" borderColor="gray.300">
            <Text color="gray.500" mb={2}>No data sources configured</Text>
            <Text fontSize="sm" color="gray.400">
              Add your first data source to start collecting data
            </Text>
          </Box>
        ) : (
          connections.map((connection) => (
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
                    Last Update: {connection.last_update 
                      ? new Date(connection.last_update).toLocaleString()
                      : 'Never'
                    }
                  </Text>
                </VStack>
                
                <HStack spacing={2}>
                  <Button
                    size="xs"
                    colorScheme="blue"
                    onClick={() => onTest(connection)}
                    isLoading={isLoading && connection.status === 'Connecting'}
                    loadingText="Testing..."
                  >
                    Test
                  </Button>
                  <IconButton
                    aria-label="Edit connection"
                    size="xs"
                    variant="ghost"
                    icon={<EditIcon />}
                    onClick={() => {
                      // TODO: Implement edit functionality
                      console.log('Edit connection:', connection.id);
                    }}
                  />
                  <IconButton
                    aria-label="Delete connection"
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    icon={<DeleteIcon />}
                    onClick={() => handleDelete(connection.id)}
                  />
                </HStack>
              </HStack>
            </Box>
          ))
        )}
      </VStack>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Data Source
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this data source? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} size="sm">
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                onClick={confirmDelete} 
                ml={3} 
                size="sm"
                isLoading={isLoading}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ConnectionList;
