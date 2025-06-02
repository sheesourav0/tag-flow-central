
import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Input,
  Button,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const NewConnectionForm: React.FC = () => {
  return (
    <VStack align="stretch" spacing={4}>
      <Text fontSize="sm" color="gray.600">
        Add a new data source connection.
      </Text>
      
      <HStack spacing={4}>
        <Box flex={1}>
          <Text fontSize="sm" fontWeight="medium" mb={1}>Connection Name</Text>
          <Input
            placeholder="My PLC Connection"
            size="sm"
          />
        </Box>
        
        <Box flex={1}>
          <Text fontSize="sm" fontWeight="medium" mb={1}>Connection Type</Text>
          <select 
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
        </Box>
      </HStack>

      <Box>
        <Text fontSize="sm" fontWeight="medium" mb={1}>Endpoint URL</Text>
        <Input
          placeholder="opc.tcp://192.168.1.100:4840"
          size="sm"
        />
      </Box>

      <Button colorScheme="blue" size="sm" alignSelf="start" leftIcon={<AddIcon />}>
        Add Connection
      </Button>
    </VStack>
  );
};

export default NewConnectionForm;
