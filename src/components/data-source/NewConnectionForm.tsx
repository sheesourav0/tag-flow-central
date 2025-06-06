
import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Input,
  Button,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useDataSources, DataSource } from '../../hooks/useDataSources';
import ClickableTooltip from '../ui/clickable-tooltip';

interface NewConnectionFormProps {
  onSuccess?: () => void;
}

const NewConnectionForm: React.FC<NewConnectionFormProps> = ({ onSuccess }) => {
  const { addDataSource, isLoading } = useDataSources();
  const [formData, setFormData] = useState<{
    name: string;
    type: DataSource['type'];
    endpoint: string;
    config: any;
  }>({
    name: '',
    type: 'OPC UA',
    endpoint: '',
    config: {},
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage('');

    const result = await addDataSource(formData);
    
    if (result.success) {
      setSuccessMessage('Connection added successfully!');
      setFormData({ name: '', type: 'OPC UA', endpoint: '', config: {} });
      onSuccess?.();
    } else {
      setErrors(result.errors);
    }
  };

  const getEndpointPlaceholder = () => {
    switch (formData.type) {
      case 'OPC UA':
        return 'opc.tcp://192.168.1.100:4840';
      case 'MQTT':
        return 'mqtt://broker.local:1883';
      case 'HTTPS':
        return 'https://api.example.com/v1';
      case 'Modbus':
        return '192.168.1.100:502';
      case 'S7':
        return '192.168.1.100:102';
      default:
        return '';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack align="stretch" spacing={4}>
        <Text fontSize="sm" color="gray.600">
          Add a new data source connection to start collecting real-time data.
        </Text>
        
        {errors.length > 0 && (
          <Alert status="error" size="sm">
            <AlertIcon />
            <VStack align="start" spacing={0}>
              {errors.map((error, index) => (
                <Text key={index} fontSize="sm">{error}</Text>
              ))}
            </VStack>
          </Alert>
        )}

        {successMessage && (
          <Alert status="success" size="sm">
            <AlertIcon />
            <Text fontSize="sm">{successMessage}</Text>
          </Alert>
        )}
        
        <HStack spacing={4}>
          <FormControl flex={1} isInvalid={errors.some(e => e.includes('name'))}>
            <HStack spacing={2} mb={1}>
              <FormLabel fontSize="sm" fontWeight="medium" mb={0}>Connection Name</FormLabel>
              <ClickableTooltip 
                content="Enter a descriptive name for this connection. This will help you identify the connection when assigning it to tags. Use names like 'Main PLC', 'Temperature Sensors', or 'Production Line MQTT'."
              />
            </HStack>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="My PLC Connection"
              size="sm"
            />
            <FormErrorMessage fontSize="xs">Connection name is required</FormErrorMessage>
          </FormControl>
          
          <FormControl flex={1}>
            <HStack spacing={2} mb={1}>
              <FormLabel fontSize="sm" fontWeight="medium" mb={0}>Connection Type</FormLabel>
              <ClickableTooltip 
                content={
                  <div>
                    <p className="font-medium mb-2">Choose the protocol for your data source:</p>
                    <ul className="text-xs space-y-1">
                      <li>• <strong>OPC UA:</strong> Industrial automation standard</li>
                      <li>• <strong>MQTT:</strong> Lightweight IoT messaging</li>
                      <li>• <strong>HTTPS:</strong> REST APIs and web services</li>
                      <li>• <strong>Modbus:</strong> Serial/TCP industrial protocol</li>
                      <li>• <strong>S7:</strong> Siemens PLC communication</li>
                    </ul>
                  </div>
                }
              />
            </HStack>
            <select 
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as DataSource['type'] }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="OPC UA">OPC UA</option>
              <option value="MQTT">MQTT</option>
              <option value="HTTPS">HTTPS API</option>
              <option value="Modbus">Modbus TCP</option>
              <option value="S7">Siemens S7</option>
            </select>
          </FormControl>
        </HStack>

        <FormControl isInvalid={errors.some(e => e.includes('endpoint'))}>
          <HStack spacing={2} mb={1}>
            <FormLabel fontSize="sm" fontWeight="medium" mb={0}>Endpoint URL</FormLabel>
            <ClickableTooltip 
              content="Enter the connection endpoint for your data source. This should include the protocol, IP address/hostname, and port number. Format varies by connection type."
            />
          </HStack>
          <Input
            value={formData.endpoint}
            onChange={(e) => setFormData(prev => ({ ...prev, endpoint: e.target.value }))}
            placeholder={getEndpointPlaceholder()}
            size="sm"
          />
          <FormErrorMessage fontSize="xs">Valid endpoint URL is required</FormErrorMessage>
        </FormControl>

        <Button 
          type="submit"
          colorScheme="blue" 
          size="sm" 
          alignSelf="start" 
          leftIcon={<AddIcon />}
          isLoading={isLoading}
          loadingText="Adding..."
        >
          Add Connection
        </Button>
      </VStack>
    </form>
  );
};

export default NewConnectionForm;
