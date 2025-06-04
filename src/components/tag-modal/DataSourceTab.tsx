
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
  Tooltip,
} from '@chakra-ui/react';
import AnimatedTooltip from '../ui/animated-tooltip';

interface DataSourceTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

const DataSourceTab: React.FC<DataSourceTabProps> = ({ formData, setFormData }) => {
  const handleAddDataSource = () => {
    // This would open the data source modal
    console.log('Opening data source management...');
    // In a real implementation, this would trigger opening the DataSourceModal
    alert('This would open the Data Source Management modal where you can add new connections to MQTT brokers, OPC servers, APIs, etc.');
  };

  const renderDataSourceFields = () => {
    switch (formData.data_source) {
      case 'MQTT':
        return (
          <VStack align="stretch" spacing={4}>
            <Box>
              <Tooltip 
                label="Enter the MQTT topic path where this tag's data will be published/subscribed. Use forward slashes to separate levels."
                hasArrow
                placement="top"
                bg="purple.600"
                color="white"
                fontSize="sm"
              >
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>MQTT Topic Path</Text>
                  <Input
                    value={formData.mqtt_path}
                    onChange={(e) => setFormData(prev => ({ ...prev, mqtt_path: e.target.value }))}
                    placeholder="sensors/motor1/speed"
                    size="sm"
                  />
                </Box>
              </Tooltip>
            </Box>
            <HStack spacing={4}>
              <Box flex={1}>
                <Tooltip 
                  label="How often should this tag check for new data from the MQTT broker. Shorter intervals mean more real-time data but higher network usage."
                  hasArrow
                  placement="top"
                  bg="purple.600"
                  color="white"
                  fontSize="sm"
                >
                  <Box>
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
                </Tooltip>
              </Box>
              <Box flex={1}>
                <Tooltip 
                  label="Factor to multiply the received value by. Use this to convert units or scale values (e.g., 0.1 to convert from mm to cm)."
                  hasArrow
                  placement="top"
                  bg="purple.600"
                  color="white"
                  fontSize="sm"
                >
                  <Box>
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
                </Tooltip>
              </Box>
            </HStack>
          </VStack>
        );
      
      case 'OPC':
        return (
          <VStack align="stretch" spacing={4}>
            <Box>
              <Tooltip 
                label="Enter the OPC UA node identifier. This uniquely identifies the data point on the OPC server (e.g., ns=2;s=Temperature.Tank1)."
                hasArrow
                placement="top"
                bg="orange.600"
                color="white"
                fontSize="sm"
              >
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>OPC Node ID</Text>
                  <Input
                    value={formData.opc_node_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, opc_node_id: e.target.value }))}
                    placeholder="ns=2;s=Temperature.Tank1"
                    size="sm"
                  />
                </Box>
              </Tooltip>
            </Box>
            <HStack spacing={4}>
              <Box flex={1}>
                <Tooltip 
                  label="How frequently to poll the OPC server for new data. Balance between data freshness and server load."
                  hasArrow
                  placement="top"
                  bg="orange.600"
                  color="white"
                  fontSize="sm"
                >
                  <Box>
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
                </Tooltip>
              </Box>
              <Box flex={1}>
                <Tooltip 
                  label="Factor to multiply the received value by. Use this to convert units or scale values (e.g., 0.1 to convert from mm to cm)."
                  hasArrow
                  placement="top"
                  bg="orange.600"
                  color="white"
                  fontSize="sm"
                >
                  <Box>
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
                </Tooltip>
              </Box>
            </HStack>
          </VStack>
        );
      
      case 'Modbus':
        return (
          <VStack align="stretch" spacing={4}>
            <Box>
              <Tooltip 
                label="Enter the Modbus register address (0-65535). This is the specific memory location on the Modbus device where the data is stored."
                hasArrow
                placement="top"
                bg="green.600"
                color="white"
                fontSize="sm"
              >
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
              </Tooltip>
            </Box>
            <HStack spacing={4}>
              <Box flex={1}>
                <Tooltip 
                  label="How often to read data from the Modbus device. Longer intervals reduce network traffic but may miss rapid changes."
                  hasArrow
                  placement="top"
                  bg="green.600"
                  color="white"
                  fontSize="sm"
                >
                  <Box>
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
                </Tooltip>
              </Box>
              <Box flex={1}>
                <Tooltip 
                  label="Factor to multiply the received value by. Use this to convert units or scale values (e.g., 0.1 to convert from mm to cm)."
                  hasArrow
                  placement="top"
                  bg="green.600"
                  color="white"
                  fontSize="sm"
                >
                  <Box>
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
                </Tooltip>
              </Box>
            </HStack>
          </VStack>
        );
      
      case 'HTTPS':
        return (
          <VStack align="stretch" spacing={4}>
            <HStack spacing={4}>
              <Box flex={1}>
                <Tooltip 
                  label="How often to call the HTTPS API for new data. API calls consume bandwidth and may have rate limits."
                  hasArrow
                  placement="top"
                  bg="blue.600"
                  color="white"
                  fontSize="sm"
                >
                  <Box>
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
                </Tooltip>
              </Box>
              <Box flex={1}>
                <Tooltip 
                  label="Factor to multiply the received value by. Use this to convert units or scale values (e.g., 0.1 to convert from mm to cm)."
                  hasArrow
                  placement="top"
                  bg="blue.600"
                  color="white"
                  fontSize="sm"
                >
                  <Box>
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
                </Tooltip>
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
        <AnimatedTooltip
          content={
            <div>
              <p className="font-medium text-gray-800 mb-2">Data Source Selection</p>
              <p className="mb-3">Choose where this tag gets its data from:</p>
              <ul className="text-xs space-y-1 mb-3">
                <li>• <strong>Internal:</strong> Manually set values</li>
                <li>• <strong>MQTT:</strong> Real-time IoT messaging</li>
                <li>• <strong>OPC UA:</strong> Industrial automation</li>
                <li>• <strong>Modbus:</strong> Equipment communication</li>
                <li>• <strong>HTTPS:</strong> Web APIs and services</li>
              </ul>
              <p className="text-xs text-gray-600">Need a new connection? Click below to manage data sources.</p>
            </div>
          }
          actionText="Manage Data Sources"
          onAction={handleAddDataSource}
        >
          <Tooltip 
            label="Choose where this tag gets its data from. Internal means manually set values, while external sources provide real-time data."
            hasArrow
            placement="top"
            bg="gray.600"
            color="white"
            fontSize="sm"
          >
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
          </Tooltip>
        </AnimatedTooltip>
      </Box>

      <Box>
        <Tooltip 
          label="Enter a unique identifier for the device or system providing this data. This helps organize and troubleshoot connections."
          hasArrow
          placement="top"
          bg="gray.600"
          color="white"
          fontSize="sm"
        >
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={1}>Device ID</Text>
            <Input
              value={formData.device_id}
              onChange={(e) => setFormData(prev => ({ ...prev, device_id: e.target.value }))}
              placeholder="PLC001, SENSOR001, etc."
              size="sm"
            />
          </Box>
        </Tooltip>
      </Box>

      {renderDataSourceFields()}
    </VStack>
  );
};

export default DataSourceTab;
