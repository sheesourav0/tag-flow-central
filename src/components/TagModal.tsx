
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Switch,
  VStack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Badge,
  Text,
  Divider,
} from '@chakra-ui/react';
import { useTagStore, Tag } from '../store/tagStore';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag?: Tag;
}

const TagModal: React.FC<TagModalProps> = ({ isOpen, onClose, tag }) => {
  const { addTag, updateTag, groups } = useTagStore();
  
  const [formData, setFormData] = useState({
    name: '',
    dataType: 'Bool' as Tag['dataType'],
    address: '',
    value: '',
    comment: '',
    group: 'Motors',
    active: true,
    retain: false,
    dataSource: 'Internal' as Tag['dataSource'],
    mqttPath: '',
    opcNodeId: '',
    modbusRegister: 0,
    updateInterval: '1s',
    multiplier: 1,
    deviceId: '',
    directLogging: false,
    logDuration: '24h',
    alarmEnabled: false,
    alarmHighLimit: 100,
    alarmLowLimit: 0,
  });

  useEffect(() => {
    if (tag) {
      setFormData({
        name: tag.name,
        dataType: tag.dataType,
        address: tag.address,
        value: tag.value,
        comment: tag.comment,
        group: tag.group,
        active: tag.active,
        retain: tag.retain,
        dataSource: tag.dataSource,
        mqttPath: tag.mqttPath || '',
        opcNodeId: tag.opcNodeId || '',
        modbusRegister: tag.modbusRegister || 0,
        updateInterval: tag.updateInterval,
        multiplier: tag.multiplier,
        deviceId: tag.deviceId,
        directLogging: tag.directLogging,
        logDuration: tag.logDuration,
        alarmEnabled: tag.alarmEnabled,
        alarmHighLimit: tag.alarmHighLimit || 100,
        alarmLowLimit: tag.alarmLowLimit || 0,
      });
    } else {
      setFormData({
        name: '',
        dataType: 'Bool',
        address: '',
        value: '',
        comment: '',
        group: groups[0]?.name || 'Motors',
        active: true,
        retain: false,
        dataSource: 'Internal',
        mqttPath: '',
        opcNodeId: '',
        modbusRegister: 0,
        updateInterval: '1s',
        multiplier: 1,
        deviceId: '',
        directLogging: false,
        logDuration: '24h',
        alarmEnabled: false,
        alarmHighLimit: 100,
        alarmLowLimit: 0,
      });
    }
  }, [tag, isOpen, groups]);

  const handleSave = () => {
    if (tag) {
      updateTag(tag.id, formData);
    } else {
      addTag(formData);
    }
    onClose();
  };

  const renderDataSourceConfig = () => {
    switch (formData.dataSource) {
      case 'MQTT':
        return (
          <FormControl>
            <FormLabel fontSize="sm">MQTT Topic Path</FormLabel>
            <Input
              value={formData.mqttPath}
              onChange={(e) => setFormData(prev => ({ ...prev, mqttPath: e.target.value }))}
              placeholder="sensors/temperature/value"
              size="sm"
            />
          </FormControl>
        );
      
      case 'OPC':
        return (
          <FormControl>
            <FormLabel fontSize="sm">OPC Node ID</FormLabel>
            <Input
              value={formData.opcNodeId}
              onChange={(e) => setFormData(prev => ({ ...prev, opcNodeId: e.target.value }))}
              placeholder="ns=2;s=Temperature.Sensor1"
              size="sm"
            />
          </FormControl>
        );
      
      case 'Modbus':
        return (
          <FormControl>
            <FormLabel fontSize="sm">Modbus Register</FormLabel>
            <NumberInput
              value={formData.modbusRegister}
              onChange={(_, value) => setFormData(prev => ({ ...prev, modbusRegister: value || 0 }))}
              size="sm"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
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
              {tag.connectionStatus}
            </Badge>
          )}
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <Tabs variant="enclosed" size="sm">
            <TabList>
              <Tab>Basic</Tab>
              <Tab>Data Source</Tab>
              <Tab>Logging & Alarms</Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <HStack spacing={4}>
                    <FormControl flex={2}>
                      <FormLabel fontSize="sm">Tag Name</FormLabel>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        size="sm"
                      />
                    </FormControl>
                    
                    <FormControl flex={1}>
                      <FormLabel fontSize="sm">Data Type</FormLabel>
                      <Select
                        value={formData.dataType}
                        onChange={(e) => setFormData(prev => ({ ...prev, dataType: e.target.value as Tag['dataType'] }))}
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
                    </FormControl>
                  </HStack>

                  <HStack spacing={4}>
                    <FormControl flex={1}>
                      <FormLabel fontSize="sm">Address</FormLabel>
                      <Input
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="%I0.0"
                        size="sm"
                      />
                    </FormControl>
                    
                    <FormControl flex={1}>
                      <FormLabel fontSize="sm">Initial Value</FormLabel>
                      <Input
                        value={formData.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                        size="sm"
                      />
                    </FormControl>
                  </HStack>

                  <FormControl>
                    <FormLabel fontSize="sm">Group</FormLabel>
                    <Select
                      value={formData.group}
                      onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value }))}
                      size="sm"
                    >
                      {groups.map(group => (
                        <option key={group.id} value={group.name}>
                          {group.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Comment</FormLabel>
                    <Textarea
                      value={formData.comment}
                      onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                      size="sm"
                      rows={3}
                    />
                  </FormControl>

                  <HStack spacing={6}>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="active" mb="0" fontSize="sm">
                        Active
                      </FormLabel>
                      <Switch
                        id="active"
                        isChecked={formData.active}
                        onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                      />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="retain" mb="0" fontSize="sm">
                        Retain
                      </FormLabel>
                      <Switch
                        id="retain"
                        isChecked={formData.retain}
                        onChange={(e) => setFormData(prev => ({ ...prev, retain: e.target.checked }))}
                      />
                    </FormControl>
                  </HStack>
                </VStack>
              </TabPanel>
              
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel fontSize="sm">Data Source</FormLabel>
                    <Select
                      value={formData.dataSource}
                      onChange={(e) => setFormData(prev => ({ ...prev, dataSource: e.target.value as Tag['dataSource'] }))}
                      size="sm"
                    >
                      <option value="Internal">Internal</option>
                      <option value="MQTT">MQTT</option>
                      <option value="HTTPS">HTTPS API</option>
                      <option value="OPC">OPC UA</option>
                      <option value="Modbus">Modbus TCP</option>
                    </Select>
                  </FormControl>

                  {renderDataSourceConfig()}

                  <Divider />

                  <HStack spacing={4}>
                    <FormControl flex={1}>
                      <FormLabel fontSize="sm">Update Interval</FormLabel>
                      <Select
                        value={formData.updateInterval}
                        onChange={(e) => setFormData(prev => ({ ...prev, updateInterval: e.target.value }))}
                        size="sm"
                      >
                        <option value="100ms">100ms</option>
                        <option value="500ms">500ms</option>
                        <option value="1s">1s</option>
                        <option value="2s">2s</option>
                        <option value="5s">5s</option>
                        <option value="10s">10s</option>
                        <option value="30s">30s</option>
                        <option value="1m">1m</option>
                      </Select>
                    </FormControl>
                    
                    <FormControl flex={1}>
                      <FormLabel fontSize="sm">Multiplier</FormLabel>
                      <NumberInput
                        value={formData.multiplier}
                        onChange={(_, value) => setFormData(prev => ({ ...prev, multiplier: value || 1 }))}
                        step={0.1}
                        precision={2}
                        size="sm"
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </HStack>

                  <FormControl>
                    <FormLabel fontSize="sm">Device ID</FormLabel>
                    <Input
                      value={formData.deviceId}
                      onChange={(e) => setFormData(prev => ({ ...prev, deviceId: e.target.value }))}
                      placeholder="PLC001, SENSOR001, etc."
                      size="sm"
                    />
                  </FormControl>
                </VStack>
              </TabPanel>
              
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="logging" mb="0" fontSize="sm">
                      Direct Logging
                    </FormLabel>
                    <Switch
                      id="logging"
                      isChecked={formData.directLogging}
                      onChange={(e) => setFormData(prev => ({ ...prev, directLogging: e.target.checked }))}
                    />
                  </FormControl>

                  {formData.directLogging && (
                    <FormControl>
                      <FormLabel fontSize="sm">Log Duration</FormLabel>
                      <Select
                        value={formData.logDuration}
                        onChange={(e) => setFormData(prev => ({ ...prev, logDuration: e.target.value }))}
                        size="sm"
                      >
                        <option value="1h">1 Hour</option>
                        <option value="6h">6 Hours</option>
                        <option value="12h">12 Hours</option>
                        <option value="24h">24 Hours</option>
                        <option value="7d">7 Days</option>
                        <option value="30d">30 Days</option>
                        <option value="90d">90 Days</option>
                        <option value="1y">1 Year</option>
                      </Select>
                    </FormControl>
                  )}

                  <Divider />

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="alarm" mb="0" fontSize="sm">
                      Enable Alarms
                    </FormLabel>
                    <Switch
                      id="alarm"
                      isChecked={formData.alarmEnabled}
                      onChange={(e) => setFormData(prev => ({ ...prev, alarmEnabled: e.target.checked }))}
                    />
                  </FormControl>

                  {formData.alarmEnabled && (
                    <VStack spacing={3} align="stretch">
                      <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                        Alarm Limits
                      </Text>
                      
                      <HStack spacing={4}>
                        <FormControl>
                          <FormLabel fontSize="sm">High Limit</FormLabel>
                          <NumberInput
                            value={formData.alarmHighLimit}
                            onChange={(_, value) => setFormData(prev => ({ ...prev, alarmHighLimit: value || 100 }))}
                            size="sm"
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel fontSize="sm">Low Limit</FormLabel>
                          <NumberInput
                            value={formData.alarmLowLimit}
                            onChange={(_, value) => setFormData(prev => ({ ...prev, alarmLowLimit: value || 0 }))}
                            size="sm"
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>
                      </HStack>
                    </VStack>
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} size="sm">
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
