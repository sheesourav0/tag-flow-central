
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
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>Device ID</Text>
                    <Input
                      value={formData.deviceId}
                      onChange={(e) => setFormData(prev => ({ ...prev, deviceId: e.target.value }))}
                      placeholder="PLC001, SENSOR001, etc."
                      size="sm"
                    />
                  </Box>
                </VStack>
              </TabPanel>
              
              <TabPanel>
                <VStack align="stretch" spacing={4}>
                  <HStack spacing={2}>
                    <Text fontSize="sm">Direct Logging</Text>
                    <Switch
                      isChecked={formData.directLogging}
                      onChange={(e) => setFormData(prev => ({ ...prev, directLogging: e.target.checked }))}
                    />
                  </HStack>

                  <HStack spacing={2}>
                    <Text fontSize="sm">Enable Alarms</Text>
                    <Switch
                      isChecked={formData.alarmEnabled}
                      onChange={(e) => setFormData(prev => ({ ...prev, alarmEnabled: e.target.checked }))}
                    />
                  </HStack>
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
