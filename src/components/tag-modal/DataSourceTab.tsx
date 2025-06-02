
import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

interface DataSourceTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

const DataSourceTab: React.FC<DataSourceTabProps> = ({ formData, setFormData }) => {
  const renderDataSourceFields = () => {
    switch (formData.data_source) {
      case 'MQTT':
        return (
          <VStack align="stretch" spacing={4}>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={1}>MQTT Topic Path</Text>
              <Input
                value={formData.mqtt_path}
                onChange={(e) => setFormData(prev => ({ ...prev, mqtt_path: e.target.value }))}
                placeholder="sensors/motor1/speed"
                size="sm"
              />
            </Box>
            <HStack spacing={4}>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="medium" mb={1}>Update Interval</Text>
                <Select
                  value={formData.update_interval}
                  onChange={(e) => setFormData(prev => ({ ...prev, update_interval: e.target.value }))}
                  size="sm"
                >
                  <option value="100ms">100ms</option>
                  <option value="500ms">500ms</option>
                  <option value="1s">1 second</option>
                  <option value="2s">2 seconds</option>
                  <option value="5s">5 seconds</option>
                </Select>
              </Box>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="medium" mb={1}>Multiplier</Text>
                <NumberInput
                  value={formData.multiplier}
                  onChange={(valueString, valueNumber) => 
                    setFormData(prev => ({ ...prev, multiplier: valueNumber || 1 }))
                  }
                  size="sm"
                  step={0.1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            </HStack>
          </VStack>
        );
      
      case 'OPC':
        return (
          <VStack align="stretch" spacing={4}>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={1}>OPC Node ID</Text>
              <Input
                value={formData.opc_node_id}
                onChange={(e) => setFormData(prev => ({ ...prev, opc_node_id: e.target.value }))}
                placeholder="ns=2;s=Temperature.Tank1"
                size="sm"
              />
            </Box>
            <HStack spacing={4}>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="medium" mb={1}>Update Interval</Text>
                <Select
                  value={formData.update_interval}
                  onChange={(e) => setFormData(prev => ({ ...prev, update_interval: e.target.value }))}
                  size="sm"
                >
                  <option value="500ms">500ms</option>
                  <option value="1s">1 second</option>
                  <option value="2s">2 seconds</option>
                  <option value="5s">5 seconds</option>
                  <option value="10s">10 seconds</option>
                </Select>
              </Box>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="medium" mb={1}>Multiplier</Text>
                <NumberInput
                  value={formData.multiplier}
                  onChange={(valueString, valueNumber) => 
                    setFormData(prev => ({ ...prev, multiplier: valueNumber || 1 }))
                  }
                  size="sm"
                  step={0.1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            </HStack>
          </VStack>
        );
      
      case 'Modbus':
        return (
          <VStack align="stretch" spacing={4}>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={1}>Modbus Register</Text>
              <NumberInput
                value={formData.modbus_register}
                onChange={(valueString, valueNumber) => 
                  setFormData(prev => ({ ...prev, modbus_register: valueNumber || 0 }))
                }
                size="sm"
                min={0}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
            <HStack spacing={4}>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="medium" mb={1}>Update Interval</Text>
                <Select
                  value={formData.update_interval}
                  onChange={(e) => setFormData(prev => ({ ...prev, update_interval: e.target.value }))}
                  size="sm"
                >
                  <option value="1s">1 second</option>
                  <option value="2s">2 seconds</option>
                  <option value="5s">5 seconds</option>
                  <option value="10s">10 seconds</option>
                </Select>
              </Box>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="medium" mb={1}>Multiplier</Text>
                <NumberInput
                  value={formData.multiplier}
                  onChange={(valueString, valueNumber) => 
                    setFormData(prev => ({ ...prev, multiplier: valueNumber || 1 }))
                  }
                  size="sm"
                  step={0.1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            </HStack>
          </VStack>
        );
      
      case 'HTTPS':
        return (
          <VStack align="stretch" spacing={4}>
            <HStack spacing={4}>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="medium" mb={1}>Update Interval</Text>
                <Select
                  value={formData.update_interval}
                  onChange={(e) => setFormData(prev => ({ ...prev, update_interval: e.target.value }))}
                  size="sm"
                >
                  <option value="5s">5 seconds</option>
                  <option value="10s">10 seconds</option>
                  <option value="30s">30 seconds</option>
                  <option value="1m">1 minute</option>
                  <option value="5m">5 minutes</option>
                </Select>
              </Box>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="medium" mb={1}>Multiplier</Text>
                <NumberInput
                  value={formData.multiplier}
                  onChange={(valueString, valueNumber) => 
                    setFormData(prev => ({ ...prev, multiplier: valueNumber || 1 }))
                  }
                  size="sm"
                  step={0.1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            </HStack>
          </VStack>
        );
      
      default:
        return null;
    }
  };

  return (
    <VStack align="stretch" spacing={4}>
      <Box>
        <Text fontSize="sm" fontWeight="medium" mb={1}>Data Source</Text>
        <Select
          value={formData.data_source}
          onChange={(e) => setFormData(prev => ({ ...prev, data_source: e.target.value }))}
          size="sm"
        >
          <option value="Internal">Internal</option>
          <option value="MQTT">MQTT</option>
          <option value="HTTPS">HTTPS API</option>
          <option value="OPC">OPC UA</option>
          <option value="Modbus">Modbus TCP</option>
        </Select>
      </Box>

      <Box>
        <Text fontSize="sm" fontWeight="medium" mb={1}>Device ID</Text>
        <Input
          value={formData.device_id}
          onChange={(e) => setFormData(prev => ({ ...prev, device_id: e.target.value }))}
          placeholder="PLC001, SENSOR001, etc."
          size="sm"
        />
      </Box>

      {renderDataSourceFields()}
    </VStack>
  );
};

export default DataSourceTab;
