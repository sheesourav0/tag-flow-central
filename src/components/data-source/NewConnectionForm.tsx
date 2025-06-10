
import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Button,
  Input,
  Textarea,
  NativeSelectRoot,
  NativeSelectField,
  createToaster,
} from '@chakra-ui/react';
import { Field } from '@chakra-ui/react';
import { useDataSources } from '../../hooks/useDataSources';

interface NewConnectionFormProps {
  onSuccess: () => void;
}

const toaster = createToaster({
  placement: 'top',
});

const NewConnectionForm: React.FC<NewConnectionFormProps> = ({ onSuccess }) => {
  const { createDataSource, isCreating } = useDataSources();
  const [formData, setFormData] = useState({
    name: '',
    type: 'rest_api' as 'rest_api' | 'websocket' | 'mqtt',
    description: '',
    url: '',
    method: 'GET',
    headers: {},
    authType: 'none' as 'none' | 'bearer' | 'api_key',
    authToken: '',
    broker: '',
    port: 1883,
    topic: '',
    qos: 0,
    username: '',
    password: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const config: any = {};
      
      if (formData.type === 'rest_api') {
        config.url = formData.url;
        config.method = formData.method;
        config.headers = formData.headers;
        config.authType = formData.authType;
        if (formData.authType !== 'none') {
          config.authToken = formData.authToken;
        }
      } else if (formData.type === 'websocket') {
        config.url = formData.url;
      } else if (formData.type === 'mqtt') {
        config.broker = formData.broker;
        config.port = formData.port;
        config.topic = formData.topic;
        config.qos = formData.qos;
        config.username = formData.username;
        config.password = formData.password;
      }

      await createDataSource({
        name: formData.name,
        type: formData.type,
        description: formData.description,
        config,
        status: 'inactive',
      });

      onSuccess();
      setFormData({
        name: '',
        type: 'rest_api',
        description: '',
        url: '',
        method: 'GET',
        headers: {},
        authType: 'none',
        authToken: '',
        broker: '',
        port: 1883,
        topic: '',
        qos: 0,
        username: '',
        password: '',
      });
    } catch (error) {
      console.error('Error creating connection:', error);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack gap={4} align="stretch">
        <Field label="Connection Name" required>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter connection name"
          />
        </Field>

        <Field label="Connection Type" required>
          <NativeSelectRoot>
            <NativeSelectField
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
            >
              <option value="rest_api">REST API</option>
              <option value="websocket">WebSocket</option>
              <option value="mqtt">MQTT</option>
            </NativeSelectField>
          </NativeSelectRoot>
        </Field>

        <Field label="Description">
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter description"
          />
        </Field>

        {formData.type === 'rest_api' && (
          <>
            <Field label="URL" required>
              <Input
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="https://api.example.com"
              />
            </Field>

            <Field label="HTTP Method">
              <NativeSelectRoot>
                <NativeSelectField
                  value={formData.method}
                  onChange={(e) => handleInputChange('method', e.target.value)}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </NativeSelectField>
              </NativeSelectRoot>
            </Field>

            <Field label="Authentication">
              <NativeSelectRoot>
                <NativeSelectField
                  value={formData.authType}
                  onChange={(e) => handleInputChange('authType', e.target.value)}
                >
                  <option value="none">None</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="api_key">API Key</option>
                </NativeSelectField>
              </NativeSelectRoot>
            </Field>

            {formData.authType !== 'none' && (
              <Field label="Auth Token">
                <Input
                  type="password"
                  value={formData.authToken}
                  onChange={(e) => handleInputChange('authToken', e.target.value)}
                  placeholder="Enter token"
                />
              </Field>
            )}
          </>
        )}

        {formData.type === 'websocket' && (
          <Field label="WebSocket URL" required>
            <Input
              value={formData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              placeholder="ws://localhost:8080"
            />
          </Field>
        )}

        {formData.type === 'mqtt' && (
          <>
            <HStack gap={4}>
              <Field label="Broker" required>
                <Input
                  value={formData.broker}
                  onChange={(e) => handleInputChange('broker', e.target.value)}
                  placeholder="localhost"
                />
              </Field>
              <Field label="Port" required>
                <Input
                  type="number"
                  value={formData.port}
                  onChange={(e) => handleInputChange('port', parseInt(e.target.value))}
                />
              </Field>
            </HStack>

            <Field label="Topic" required>
              <Input
                value={formData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
                placeholder="sensor/data"
              />
            </Field>

            <Field label="QoS">
              <NativeSelectRoot>
                <NativeSelectField
                  value={formData.qos}
                  onChange={(e) => handleInputChange('qos', parseInt(e.target.value))}
                >
                  <option value={0}>0 - At most once</option>
                  <option value={1}>1 - At least once</option>
                  <option value={2}>2 - Exactly once</option>
                </NativeSelectField>
              </NativeSelectRoot>
            </Field>

            <HStack gap={4}>
              <Field label="Username">
                <Input
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter username"
                />
              </Field>
              <Field label="Password">
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter password"
                />
              </Field>
            </HStack>
          </>
        )}

        <Button
          type="submit"
          colorScheme="primary"
          loading={isCreating}
          size="lg"
        >
          Create Connection
        </Button>
      </VStack>
    </Box>
  );
};

export default NewConnectionForm;
