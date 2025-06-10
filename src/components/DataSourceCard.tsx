
import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { Database, Globe, Wifi, MoreVertical, Edit, Trash2, Play } from 'lucide-react';
import { DataSource } from '../types/dataSource';
import { useDataSources } from '../hooks/useDataSources';

interface DataSourceCardProps {
  dataSource: DataSource;
  onEdit: (dataSource: DataSource) => void;
}

const DataSourceCard: React.FC<DataSourceCardProps> = ({ dataSource, onEdit }) => {
  const { deleteDataSource } = useDataSources();
  const toast = useToast();

  const getIcon = () => {
    switch (dataSource.type) {
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

  const getStatusColor = () => {
    switch (dataSource.status) {
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

  const handleDelete = async () => {
    try {
      await deleteDataSource(dataSource.id);
      toast({
        title: 'Data source deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to delete data source',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      p={6}
      bg="white"
      borderRadius="lg"
      shadow="sm"
      border="1px"
      borderColor="gray.200"
      _hover={{ shadow: 'md' }}
      transition="all 0.2s"
    >
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Box
              p={2}
              bg="blue.100"
              borderRadius="md"
            >
              <Icon as={getIcon()} color="blue.500" boxSize={5} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontWeight="semibold" color="gray.800">
                {dataSource.name}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {dataSource.type.replace('_', ' ').toUpperCase()}
              </Text>
            </VStack>
          </HStack>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<Icon as={MoreVertical} />}
              variant="ghost"
              size="sm"
            />
            <MenuList>
              <MenuItem icon={<Icon as={Edit} />} onClick={() => onEdit(dataSource)}>
                Edit
              </MenuItem>
              <MenuItem icon={<Icon as={Play} />}>
                Test Connection
              </MenuItem>
              <MenuItem 
                icon={<Icon as={Trash2} />} 
                color="red.500"
                onClick={handleDelete}
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>

        <HStack justify="space-between">
          <Badge colorScheme={getStatusColor()} size="sm">
            {dataSource.status}
          </Badge>
          <Text fontSize="xs" color="gray.500">
            {dataSource.created_at && new Date(dataSource.created_at).toLocaleDateString()}
          </Text>
        </HStack>

        {dataSource.description && (
          <Text fontSize="sm" color="gray.600" noOfLines={2}>
            {dataSource.description}
          </Text>
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(dataSource)}
          leftIcon={<Icon as={Edit} />}
        >
          Configure
        </Button>
      </VStack>
    </Box>
  );
};

export default DataSourceCard;
