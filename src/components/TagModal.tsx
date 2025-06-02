
import React, { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Textarea,
  VStack,
  HStack,
  Badge,
  Text,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Switch,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { DatabaseTag } from '../services/tagService';
import { useTags } from '../hooks/useTags';
import { useGroups } from '../hooks/useGroups';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag?: DatabaseTag | null;
}

const TagModal: React.FC<TagModalProps> = ({ isOpen, onClose, tag }) => {
  const { createTag, updateTag } = useTags();
  const { groups } = useGroups();
  
  const [formData, setFormData] = useState({
    name: '',
    data_type: 'Bool' as string,
    address: '',
    value: '',
    comment: '',
    group_name: '',
    active: true,
    retain: false,
    data_source: 'Internal' as string,
    mqtt_path: '',
    opc_node_id: '',
    modbus_register: 0,
    update_interval: '1s',
    multiplier: 1,
    device_id: '',
    direct_logging: false,
    log_duration: '24h',
    alarm_enabled: false,
    alarm_high_limit: 100,
    alarm_low_limit: 0,
    connection_status: 'Unknown' as string,
  });

  useEffect(() => {
    if (tag) {
      setFormData({
        name: tag.name,
        data_type: tag.data_type,
        address: tag.address,
        value: tag.value || '',
        comment: tag.comment || '',
        group_name: tag.group_name,
        active: tag.active || true,
        retain: tag.retain || false,
        data_source: tag.data_source,
        mqtt_path: tag.mqtt_path || '',
        opc_node_id: tag.opc_node_id || '',
        modbus_register: tag.modbus_register || 0,
        update_interval: tag.update_interval || '1s',
        multiplier: tag.multiplier || 1,
        device_id: tag.device_id || '',
        direct_logging: tag.direct_logging || false,
        log_duration: tag.log_duration || '24h',
        alarm_enabled: tag.alarm_enabled || false,
        alarm_high_limit: tag.alarm_high_limit || 100,
        alarm_low_limit: tag.alarm_low_limit || 0,
        connection_status: tag.connection_status || 'Unknown',
      });
    } else {
      setFormData({
        name: '',
        data_type: 'Bool',
        address: '',
        value: '',
        comment: '',
        group_name: groups[0]?.name || '',
        active: true,
        retain: false,
        data_source: 'Internal',
        mqtt_path: '',
        opc_node_id: '',
        modbus_register: 0,
        update_interval: '1s',
        multiplier: 1,
        device_id: '',
        direct_logging: false,
        log_duration: '24h',
        alarm_enabled: false,
        alarm_high_limit: 100,
        alarm_low_limit: 0,
        connection_status: 'Unknown',
      });
    }
  }, [tag, isOpen, groups]);

  const handleSave = () => {
    if (tag) {
      updateTag({ id: tag.id, updates: formData });
    } else {
      createTag(formData);
    }
    onClose();
  };

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
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {tag ? 'Edit Tag' : 'Add New Tag'}
          {tag && (
            <Badge ml={2} colorScheme="blue">
              {tag.connection_status}
            </Badge>
          )}
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <Tabs>
            <TabList>
              <Tab>Basic</Tab>
              <Tab>Data Source</Tab>
              <Tab>Logging & Alarms</Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel>
                <VStack align="stretch" spacing={4}>
                  <HStack spacing={4}>
                    <Box flex={2}>
                      <Text fontSize="sm" fontWeight="medium" mb={1}>Tag Name</Text>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        size="sm"
                      />
                    </Box>
                    
                    <Box flex={1}>
                      <Text fontSize="sm" fontWeight="medium" mb={1}>Data Type</Text>
                      <Select
                        value={formData.data_type}
                        onChange={(e) => setFormData(prev => ({ ...prev, data_type: e.target.value }))}
                        size="sm"
                      >
                        <option value="Bool">Bool</option>
                        <option value="Byte">Byte</option>
                        <option value="Word">Word</option>
                        <option value="DWord">DWord</option>
                        <option value="Int">Int</option>
                        <option value="DInt">DInt</option>
                        <option value="Real">Real</option>
                        <option value="String">String</option>
                      </Select>
                    </Box>
                  </HStack>

                  <HStack spacing={4}>
                    <Box flex={1}>
                      <Text fontSize="sm" fontWeight="medium" mb={1}>Address</Text>
                      <Input
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="%I0.0"
                        size="sm"
                      />
                    </Box>
                    
                    <Box flex={1}>
                      <Text fontSize="sm" fontWeight="medium" mb={1}>Initial Value</Text>
                      <Input
                        value={formData.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                        size="sm"
                      />
                    </Box>
                  </HStack>

                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>Group</Text>
                    <Select
                      value={formData.group_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, group_name: e.target.value }))}
                      size="sm"
                    >
                      {groups.map(group => (
                        <option key={group.id} value={group.name}>
                          {group.name}
                        </option>
                      ))}
                    </Select>
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>Comment</Text>
                    <Textarea
                      value={formData.comment}
                      onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                      rows={3}
                    />
                  </Box>

                  <HStack spacing={6}>
                    <HStack spacing={2}>
                      <Text fontSize="sm">Active</Text>
                      <Switch
                        isChecked={formData.active}
                        onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                      />
                    </HStack>
                    
                    <HStack spacing={2}>
                      <Text fontSize="sm">Retain</Text>
                      <Switch
                        isChecked={formData.retain}
                        onChange={(e) => setFormData(prev => ({ ...prev, retain: e.target.checked }))}
                      />
                    </HStack>
                  </HStack>
                </VStack>
              </TabPanel>
              
              <TabPanel>
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
              </TabPanel>
              
              <TabPanel>
                <VStack align="stretch" spacing={4}>
                  <HStack spacing={2}>
                    <Text fontSize="sm">Direct Logging</Text>
                    <Switch
                      isChecked={formData.direct_logging}
                      onChange={(e) => setFormData(prev => ({ ...prev, direct_logging: e.target.checked }))}
                    />
                  </HStack>

                  {formData.direct_logging && (
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={1}>Log Duration</Text>
                      <Select
                        value={formData.log_duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, log_duration: e.target.value }))}
                        size="sm"
                      >
                        <option value="1h">1 hour</option>
                        <option value="6h">6 hours</option>
                        <option value="12h">12 hours</option>
                        <option value="24h">24 hours</option>
                        <option value="7d">7 days</option>
                        <option value="30d">30 days</option>
                      </Select>
                    </Box>
                  )}

                  <HStack spacing={2}>
                    <Text fontSize="sm">Enable Alarms</Text>
                    <Switch
                      isChecked={formData.alarm_enabled}
                      onChange={(e) => setFormData(prev => ({ ...prev, alarm_enabled: e.target.checked }))}
                    />
                  </HStack>

                  {formData.alarm_enabled && (
                    <VStack align="stretch" spacing={4}>
                      <Text fontSize="sm" fontWeight="medium" color="orange.600">
                        Alarm Configuration
                      </Text>
                      
                      <HStack spacing={4}>
                        <Box flex={1}>
                          <Text fontSize="sm" fontWeight="medium" mb={1}>High Limit</Text>
                          <NumberInput
                            value={formData.alarm_high_limit}
                            onChange={(valueString, valueNumber) => 
                              setFormData(prev => ({ ...prev, alarm_high_limit: valueNumber || 100 }))
                            }
                            size="sm"
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Box>
                        
                        <Box flex={1}>
                          <Text fontSize="sm" fontWeight="medium" mb={1}>Low Limit</Text>
                          <NumberInput
                            value={formData.alarm_low_limit}
                            onChange={(valueString, valueNumber) => 
                              setFormData(prev => ({ ...prev, alarm_low_limit: valueNumber || 0 }))
                            }
                            size="sm"
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Box>
                      </HStack>

                      <Box p={3} bg="orange.50" borderRadius="md" borderLeft="4px" borderColor="orange.400">
                        <Text fontSize="xs" color="orange.700">
                          Alarms will trigger when the tag value exceeds the high limit ({formData.alarm_high_limit}) 
                          or falls below the low limit ({formData.alarm_low_limit}).
                        </Text>
                      </Box>
                    </VStack>
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSave} size="sm">
            {tag ? 'Update Tag' : 'Create Tag'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TagModal;
