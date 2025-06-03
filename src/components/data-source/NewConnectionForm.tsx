
import React from 'react';
import {
  Stack,
  HStack,
  Box,
  Text,
  Input,
  Button,
  NativeSelectRoot,
  NativeSelectField,
} from '@chakra-ui/react';
import { Plus } from 'lucide-react';

const NewConnectionForm: React.FC = () => {
  return (
    <Stack gap={4}>
      <Text fontSize="sm" color="gray.600">
        Add a new data source connection.
      </Text>
      
      <HStack gap={4}>
        <Box flex={1}>
          <Text fontSize="sm" fontWeight="medium" mb={1}>Connection Name</Text>
          <Input
            placeholder="My PLC Connection"
            size="sm"
          />
        </Box>
        
        <Box flex={1}>
          <Text fontSize="sm" fontWeight="medium" mb={1}>Connection Type</Text>
          <NativeSelectRoot size="sm">
            <NativeSelectField>
              <option value="OPC UA">OPC UA</option>
              <option value="MQTT">MQTT</option>
              <option value="HTTPS">HTTPS API</option>
              <option value="Modbus">Modbus TCP</option>
              <option value="S7">Siemens S7</option>
            </NativeSelectField>
          </NativeSelectRoot>
        </Box>
      </HStack>

      <Box>
        <Text fontSize="sm" fontWeight="medium" mb={1}>Endpoint URL</Text>
        <Input
          placeholder="opc.tcp://192.168.1.100:4840"
          size="sm"
        />
      </Box>

      <Button colorPalette="blue" size="sm" alignSelf="start">
        <Plus size={16} style={{ marginRight: '4px' }} />
        Add Connection
      </Button>
    </Stack>
  );
};

export default NewConnectionForm;
