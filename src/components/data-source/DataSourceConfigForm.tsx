
import React, { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  NativeSelectRoot,
  NativeSelectField,
  Button,
  Text,
  Box,
  Badge,
  Textarea,
  Code,
  Heading,
  createToaster,
} from '@chakra-ui/react';
import { useDataSources } from '../../hooks/useDataSources';

interface DataSourceConfigFormProps {
  connection: any;
  connectionData: Record<string, any>;
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
  const [config, setConfig] = useState({
    name: connection.name || '',
    description: connection.description || '',
    updateInterval: '60',
    dataMapping: '',
    filters: '',
  });
  const [loading, setLoading] = useState(false);
  const { updateDataSource } = useDataSources();

  useEffect(() => {
    if (connection.data_mapping) {
      setConfig(prev => ({
        ...prev,
        dataMapping: JSON.stringify(connection.data_mapping, null, 2),
      }));
    }
    if (connection.filters) {
      setConfig(prev => ({
        ...prev,
        filters: JSON.stringify(connection.filters, null, 2),
      }));
    }
  }, [connection]);

  const handleChange = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let dataMapping = {};
      let filters = {};

      if (config.dataMapping) {
        try {
          dataMapping = JSON.parse(config.dataMapping);
        } catch (error) {
          throw new Error('Invalid JSON in data mapping');
        }
      }

      if (config.filters) {
        try {
          filters = JSON.parse(config.filters);
        } catch (error) {
          throw new Error('Invalid JSON in filters');
        }
      }

      await updateDataSource(connection.id, {
        name: config.name,
        description: config.description,
        update_interval: parseInt(config.updateInterval),
        data_mapping: dataMapping,
        filters,
        status: 'active',
      });

      toaster.create({
        title: 'Data source configured successfully',
        status: 'success',
        duration: 3000,
      });

      onClose();
    } catch (error) {
      toaster.create({
        title: 'Failed to configure data source',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const sampleData = connectionData[connection.id] || connection.sample_data;

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack gap={6} align="stretch">
        <HStack justify="space-between" align="center">
          <VStack align="start" gap={1}>
            <Heading size="md" color="gray.800">
              Configure Data Source
            </Heading>
            <HStack>
              <Text fontSize="sm" color="gray.600">
                Connection: {connection.name}
              </Text>
              <Badge colorScheme="blue" size="sm">
                {connection.type.replace('_', ' ').toUpperCase()}
              </Badge>
            </HStack>
          </VStack>
        </HStack>

        <FormControl>
          <FormLabel>Data Source Name</FormLabel>
          <Input
            value={config.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter data source name"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            value={config.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of this data source"
            rows={2}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Update Interval (seconds)</FormLabel>
          <NativeSelectRoot>
            <NativeSelectField
              value={config.updateInterval}
              onChange={(e) => handleChange('updateInterval', e.target.value)}
            >
              <option value="10">10 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
              <option value="600">10 minutes</option>
              <option value="3600">1 hour</option>
            </NativeSelectField>
          </NativeSelectRoot>
        </FormControl>

        {sampleData && (
          <Box>
            <FormLabel>Sample Data Response</FormLabel>
            <Box
              p={4}
              bg="gray.50"
              borderRadius="md"
              border="1px"
              borderColor="gray.200"
              maxH="200px"
              overflowY="auto"
            >
              <Code fontSize="sm" whiteSpace="pre-wrap">
                {JSON.stringify(sampleData, null, 2)}
              </Code>
            </Box>
          </Box>
        )}

        <FormControl>
          <FormLabel>Data Mapping (JSON)</FormLabel>
          <Textarea
            value={config.dataMapping}
            onChange={(e) => handleChange('dataMapping', e.target.value)}
            placeholder='{"temperature": "payload.temperature", "humidity": "payload.humidity"}'
            rows={4}
            fontFamily="mono"
            fontSize="sm"
          />
          <Text fontSize="xs" color="gray.500" mt={1}>
            Map response fields to your data model using JSON path notation
          </Text>
        </FormControl>

        <FormControl>
          <FormLabel>Filters (JSON)</FormLabel>
          <Textarea
            value={config.filters}
            onChange={(e) => handleChange('filters', e.target.value)}
            placeholder='{"deviceId": 1018, "operating_mode": "1"}'
            rows={3}
            fontFamily="mono"
            fontSize="sm"
          />
          <Text fontSize="xs" color="gray.500" mt={1}>
            Filter incoming data based on specified conditions
          </Text>
        </FormControl>

        <HStack justify="end" pt={4} gap={3}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            colorScheme="primary"
            loading={loading}
            loadingText="Saving..."
            size="lg"
          >
            Save Configuration
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default DataSourceConfigForm;
