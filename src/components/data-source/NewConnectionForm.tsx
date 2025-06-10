
import React, { useState } from 'react';
import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  useToast,
  Box,
  Text,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useDataSources } from '../../hooks/useDataSources';

interface NewConnectionFormProps {
  onSuccess: () => void;
}

const NewConnectionForm: React.FC<NewConnectionFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'rest_api' as const,
    description: '',
    url: '',
    method: 'GET',
    headers: '',
    authType: 'none',
    authToken: '',
    broker: '',
    port: '',
    topic: '',
    qos: '0',
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { createDataSource } = useDataSources();
  const toast = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let config: any = {};

      if (formData.type === 'rest_api') {
        config = {
          url: formData.url,
          method: formData.method,
          headers: formData.headers ? JSON.parse(formData.headers) : {},
          authType: formData.authType,
          authToken: formData.authToken,
        };
      } else if (formData.type === 'websocket') {
        config = {
          url: formData.url,
        };
      } else if (formData.type === 'mqtt') {
        config = {
          broker: formData.broker,
          port: parseInt(formData.port) || 1883,
          topic: formData.topic,
          qos: parseInt(formData.qos) || 0,
          username: formData.username,
          password: formData.password,
        };
      }

      await createDataSource({
        name: formData.name,
        type: formData.type,
        description: formData.description,
        config,
        status: 'inactive',
      });

      toast({
        title: 'Connection created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onSuccess();
    } catch (error) {
      toast({
        title: 'Failed to create connection',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderConfigFields = () => {
    switch (formData.type) {
      case 'rest_api':
        return (
          <>
            <FormControl isRequired>
              <FormLabel>API URL</FormLabel>
              <Input
                value={formData.url}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="https://api.example.com/data"
              />
            </FormControl>

            <FormControl>
              <FormLabel>HTTP Method</FormLabel>
              <Select
                value={formData.method}
                onChange={(e) => handleChange('method', e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Headers (JSON)</FormLabel>
              <Textarea
                value={formData.headers}
                onChange={(e) => handleChange('headers', e.target.value)}
                placeholder='{"Content-Type": "application/json"}'
                rows={3}
              />
            </FormControl>

            <Grid templateColumns="1fr 1fr" gap={4}>
              <FormControl>
                <FormLabel>Authentication</FormLabel>
                <Select
                  value={formData.authType}
                  onChange={(e) => handleChange('authType', e.target.value)}
                >
                  <option value="none">None</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="api_key">API Key</option>
                </Select>
              </FormControl>

              {formData.authType !== 'none' && (
                <FormControl>
                  <FormLabel>Token/Key</FormLabel>
                  <Input
                    type="password"
                    value={formData.authToken}
                    onChange={(e) => handleChange('authToken', e.target.value)}
                    placeholder="Enter your token or API key"
                  />
                </FormControl>
              )}
            </Grid>
          </>
        );

      case 'websocket':
        return (
          <FormControl isRequired>
            <FormLabel>WebSocket URL</FormLabel>
            <Input
              value={formData.url}
              onChange={(e) => handleChange('url', e.target.value)}
              placeholder="wss://example.com/websocket"
            />
          </FormControl>
        );

      case 'mqtt':
        return (
          <>
            <Grid templateColumns="2fr 1fr" gap={4}>
              <FormControl isRequired>
                <FormLabel>Broker Host</FormLabel>
                <Input
                  value={formData.broker}
                  onChange={(e) => handleChange('broker', e.target.value)}
                  placeholder="mqtt.example.com"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Port</FormLabel>
                <Input
                  type="number"
                  value={formData.port}
                  onChange={(e) => handleChange('port', e.target.value)}
                  placeholder="1883"
                />
              </FormControl>
            </Grid>

            <Grid templateColumns="2fr 1fr" gap={4}>
              <FormControl isRequired>
                <FormLabel>Topic</FormLabel>
                <Input
                  value={formData.topic}
                  onChange={(e) => handleChange('topic', e.target.value)}
                  placeholder="sensor/data"
                />
              </FormControl>

              <FormControl>
                <FormLabel>QoS</FormLabel>
                <Select
                  value={formData.qos}
                  onChange={(e) => handleChange('qos', e.target.value)}
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </Select>
              </FormControl>
            </Grid>

            <Grid templateColumns="1fr 1fr" gap={4}>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  placeholder="Optional"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Optional"
                />
              </FormControl>
            </Grid>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        <Text fontSize="lg" fontWeight="semibold" color="gray.800">
          Create New Connection
        </Text>

        <Grid templateColumns="2fr 1fr" gap={4}>
          <FormControl isRequired>
            <FormLabel>Connection Name</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="My Data Source"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Connection Type</FormLabel>
            <Select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value as any)}
            >
              <option value="rest_api">REST API</option>
              <option value="websocket">WebSocket</option>
              <option value="mqtt">MQTT</option>
            </Select>
          </FormControl>
        </Grid>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of this data source"
            rows={2}
          />
        </FormControl>

        {renderConfigFields()}

        <HStack justify="end" pt={4}>
          <Button
            type="submit"
            colorScheme="primary"
            isLoading={loading}
            loadingText="Creating..."
            size="lg"
          >
            Create Connection
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default NewConnectionForm;
