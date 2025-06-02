
import React from 'react';
import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';

interface DataSourceTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

const DataSourceTab: React.FC<DataSourceTabProps> = ({ formData, setFormData }) => {
  const dataSources = ['Internal', 'OPC UA', 'MQTT', 'Modbus', 'HTTPS'];
  const updateIntervals = ['100ms', '500ms', '1s', '5s', '10s', '30s', '1m'];

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack spacing={4}>
        <FormControl>
          <FormLabel fontSize="sm">Data Source</FormLabel>
          <Select
            value={formData.data_source}
            onChange={(e) => handleChange('data_source', e.target.value)}
            size="sm"
          >
            {dataSources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </Select>
        </FormControl>
        
        <FormControl>
          <FormLabel fontSize="sm">Update Interval</FormLabel>
          <Select
            value={formData.update_interval}
            onChange={(e) => handleChange('update_interval', e.target.value)}
            size="sm"
          >
            {updateIntervals.map(interval => (
              <option key={interval} value={interval}>{interval}</option>
            ))}
          </Select>
        </FormControl>
      </HStack>

      {formData.data_source === 'MQTT' && (
        <FormControl>
          <FormLabel fontSize="sm">MQTT Path</FormLabel>
          <Input
            value={formData.mqtt_path}
            onChange={(e) => handleChange('mqtt_path', e.target.value)}
            placeholder="topic/subtopic"
            size="sm"
          />
        </FormControl>
      )}

      {formData.data_source === 'OPC UA' && (
        <FormControl>
          <FormLabel fontSize="sm">OPC Node ID</FormLabel>
          <Input
            value={formData.opc_node_id}
            onChange={(e) => handleChange('opc_node_id', e.target.value)}
            placeholder="ns=2;i=1001"
            size="sm"
          />
        </FormControl>
      )}

      {formData.data_source === 'Modbus' && (
        <HStack spacing={4}>
          <FormControl>
            <FormLabel fontSize="sm">Modbus Register</FormLabel>
            <NumberInput
              value={formData.modbus_register}
              onChange={(_, num) => handleChange('modbus_register', num || 0)}
              size="sm"
              min={0}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
        </HStack>
      )}

      <HStack spacing={4}>
        <FormControl>
          <FormLabel fontSize="sm">Device ID</FormLabel>
          <Input
            value={formData.device_id}
            onChange={(e) => handleChange('device_id', e.target.value)}
            placeholder="Device identifier"
            size="sm"
          />
        </FormControl>
        
        <FormControl>
          <FormLabel fontSize="sm">Multiplier</FormLabel>
          <NumberInput
            value={formData.multiplier}
            onChange={(_, num) => handleChange('multiplier', num || 1)}
            size="sm"
            step={0.1}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>
      </HStack>
    </VStack>
  );
};

export default DataSourceTab;
