
import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Button,
  Input,
  Text,
  Badge,
  createToaster,
} from '@chakra-ui/react';
import { Field } from '@chakra-ui/react';
import { useDataSources } from '../../hooks/useDataSources';

interface DataSourceConfigFormProps {
  connection: any;
  connectionData: any;
  onClose: () => void;
}

const toaster = createToaster({
  placement: 'top',
});

const DataSourceConfigForm: React.FC<DataSourceConfigFormProps> = ({
  connection,
  connectionData,
  onClose,
}) => {
  const { updateDataSource } = useDataSources();
  const [updateInterval, setUpdateInterval] = useState(connection.update_interval || 5);
  const [filters, setFilters] = useState(connection.filters || {});
  const [mapping, setMapping] = useState(connection.data_mapping || {});

  const handleSave = async () => {
    try {
      await updateDataSource(connection.id, {
        update_interval: updateInterval,
        filters,
        data_mapping: mapping,
        status: 'active',
      });

      toaster.create({
        title: 'Data source configured successfully',
        type: 'success',
        duration: 3000,
      });

      onClose();
    } catch (error) {
      toaster.create({
        title: 'Failed to configure data source',
        type: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <VStack gap={6} align="stretch">
      <Box>
        <HStack justify="space-between" mb={4}>
          <Text fontSize="lg" fontWeight="semibold">
            Configure: {connection.name}
          </Text>
          <Badge colorScheme={connection.status === 'active' ? 'green' : 'yellow'}>
            {connection.status}
          </Badge>
        </HStack>
      </Box>

      <Field label="Update Interval (seconds)">
        <Input
          type="number"
          value={updateInterval}
          onChange={(e) => setUpdateInterval(parseInt(e.target.value))}
          min={1}
          max={3600}
        />
      </Field>

      {connectionData && Object.keys(connectionData).length > 0 && (
        <Box>
          <Text fontSize="md" fontWeight="semibold" mb={2}>
            Sample Data Structure
          </Text>
          <Box p={4} bg="gray.50" borderRadius="md" fontSize="sm">
            <pre>{JSON.stringify(connectionData, null, 2)}</pre>
          </Box>
        </Box>
      )}

      <HStack justify="flex-end" gap={3}>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button colorScheme="blue" onClick={handleSave}>
          Save Configuration
        </Button>
      </HStack>
    </VStack>
  );
};

export default DataSourceConfigForm;
