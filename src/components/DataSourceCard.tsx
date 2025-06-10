
import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  IconButton,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  createToaster,
} from '@chakra-ui/react';
import { MdStorage, MdLanguage, MdWifi, MdMoreVert, MdEdit, MdDelete, MdPlayArrow } from 'react-icons/md';
import { DataSource } from '../types/dataSource';
import { useDataSources } from '../hooks/useDataSources';

interface DataSourceCardProps {
  dataSource: DataSource;
  onEdit: (dataSource: DataSource) => void;
}

const toaster = createToaster({
  placement: 'top',
});

const DataSourceCard: React.FC<DataSourceCardProps> = ({ dataSource, onEdit }) => {
  const { deleteDataSource } = useDataSources();

  const getIcon = () => {
    switch (dataSource.type) {
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
      toaster.create({
        title: 'Data source deleted',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toaster.create({
        title: 'Failed to delete data source',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const IconComponent = getIcon();

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
                {dataSource.name}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {dataSource.type.replace('_', ' ').toUpperCase()}
              </Text>
            </VStack>
          </HStack>
          <MenuRoot>
            <MenuTrigger asChild>
              <IconButton
                variant="ghost"
                size="sm"
              >
                <MdMoreVert size={16} />
              </IconButton>
            </MenuTrigger>
            <MenuContent>
              <MenuItem value="edit" onClick={() => onEdit(dataSource)}>
                <MdEdit size={16} style={{ marginRight: '8px' }} />
                Edit
              </MenuItem>
              <MenuItem value="test">
                <MdPlayArrow size={16} style={{ marginRight: '8px' }} />
                Test Connection
              </MenuItem>
              <MenuItem 
                value="delete"
                color="red.500"
                onClick={handleDelete}
              >
                <MdDelete size={16} style={{ marginRight: '8px' }} />
                Delete
              </MenuItem>
            </MenuContent>
          </MenuRoot>
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
          <Text fontSize="sm" color="gray.600" lineClamp={2}>
            {dataSource.description}
          </Text>
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(dataSource)}
        >
          <MdEdit size={16} style={{ marginRight: '8px' }} />
          Configure
        </Button>
      </VStack>
    </Box>
  );
};

export default DataSourceCard;
