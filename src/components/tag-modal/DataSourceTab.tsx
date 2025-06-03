
import React from 'react';
import {
  Stack,
  HStack,
  Field,
  Input,
  NativeSelectRoot,
  NativeSelectField,
  NumberInput,
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
    <Stack gap={4}>
      <HStack gap={4}>
        <Field.Root>
          <Field.Label fontSize="sm">Data Source</Field.Label>
          <NativeSelectRoot size="sm">
            <NativeSelectField
              value={formData.data_source}
              onChange={(e) => handleChange('data_source', e.target.value)}
            >
              {dataSources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>
        </Field.Root>
        
        <Field.Root>
          <Field.Label fontSize="sm">Update Interval</Field.Label>
          <NativeSelectRoot size="sm">
            <NativeSelectField
              value={formData.update_interval}
              onChange={(e) => handleChange('update_interval', e.target.value)}
            >
              {updateIntervals.map(interval => (
                <option key={interval} value={interval}>{interval}</option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>
        </Field.Root>
      </HStack>

      {formData.data_source === 'MQTT' && (
        <Field.Root>
          <Field.Label fontSize="sm">MQTT Path</Field.Label>
          <Input
            value={formData.mqtt_path}
            onChange={(e) => handleChange('mqtt_path', e.target.value)}
            placeholder="topic/subtopic"
            size="sm"
          />
        </Field.Root>
      )}

      {formData.data_source === 'OPC UA' && (
        <Field.Root>
          <Field.Label fontSize="sm">OPC Node ID</Field.Label>
          <Input
            value={formData.opc_node_id}
            onChange={(e) => handleChange('opc_node_id', e.target.value)}
            placeholder="ns=2;i=1001"
            size="sm"
          />
        </Field.Root>
      )}

      {formData.data_source === 'Modbus' && (
        <HStack gap={4}>
          <Field.Root>
            <Field.Label fontSize="sm">Modbus Register</Field.Label>
            <NumberInput.Root
              value={formData.modbus_register.toString()}
              onValueChange={(e) => handleChange('modbus_register', parseInt(e.value) || 0)}
              size="sm"
              min={0}
            >
              <NumberInput.Input />
            </NumberInput.Root>
          </Field.Root>
        </HStack>
      )}

      <HStack gap={4}>
        <Field.Root>
          <Field.Label fontSize="sm">Device ID</Field.Label>
          <Input
            value={formData.device_id}
            onChange={(e) => handleChange('device_id', e.target.value)}
            placeholder="Device identifier"
            size="sm"
          />
        </Field.Root>
        
        <Field.Root>
          <Field.Label fontSize="sm">Multiplier</Field.Label>
          <NumberInput.Root
            value={formData.multiplier.toString()}
            onValueChange={(e) => handleChange('multiplier', parseFloat(e.value) || 1)}
            size="sm"
            step={0.1}
          >
            <NumberInput.Input />
          </NumberInput.Root>
        </Field.Root>
      </HStack>
    </Stack>
  );
};

export default DataSourceTab;
