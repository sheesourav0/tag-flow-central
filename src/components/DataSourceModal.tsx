
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  Select,
  FormControl,
  FormLabel,
  Card,
  CardBody,
  Badge,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Code,
  Textarea,
  Switch,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DataSourceModal: React.FC<DataSourceModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  
  const [connections] = useState([
    {
      id: '1',
      name: 'Main PLC',
      type: 'OPC UA',
      endpoint: 'opc.tcp://192.168.1.100:4840',
      status: 'Connected',
      lastUpdate: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'MQTT Broker',
      type: 'MQTT',
      endpoint: 'mqtt://broker.local:1883',
      status: 'Connected',
      lastUpdate: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Weather API',
      type: 'HTTPS',
      endpoint: 'https://api.weather.com/v1',
      status: 'Disconnected',
      lastUpdate: new Date().toISOString(),
    },
  ]);

  const [newConnection, setNewConnection] = useState({
    name: '',
    type: 'OPC UA',
    endpoint: '',
    username: '',
    password: '',
    securityPolicy: 'None',
    enabled: true,
  });

  const handleTestConnection = (connection: any) => {
    toast({
      title: 'Testing Connection',
      description: `Testing connection to ${connection.name}...`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
    
    // Simulate connection test
    setTimeout(() => {
      toast({
        title: 'Connection Successful',
        description: `Successfully connected to ${connection.name}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected': return 'green';
      case 'Disconnected': return 'red';
      case 'Connecting': return 'yellow';
      default: return 'gray';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Data Source Connections</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <Tabs variant="enclosed" size="sm">
            <TabList>
              <Tab>Active Connections</Tab>
              <Tab>Add New Connection</Tab>
              <Tab>Connection Templates</Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Text fontSize="sm" color="gray.600">
                    Manage active data source connections for your tags.
                  </Text>
                  
                  {connections.map((connection) => (
                    <Card key={connection.id} size="sm">
                      <CardBody>
                        <HStack justify="space-between" align="start">
                          <VStack align="start" spacing={1}>
                            <HStack spacing={2}>
                              <Text fontWeight="semibold">{connection.name}</Text>
                              <Badge colorScheme={getStatusColor(connection.status)}>
                                {connection.status}
                              </Badge>
                              <Badge variant="outline">{connection.type}</Badge>
                            </HStack>
                            <Code fontSize="xs">{connection.endpoint}</Code>
                            <Text fontSize="xs" color="gray.500">
                              Last Update: {new Date(connection.lastUpdate).toLocaleString()}
                            </Text>
                          </VStack>
                          
                          <HStack spacing={1}>
                            <Button
                              size="xs"
                              colorScheme="blue"
                              onClick={() => handleTestConnection(connection)}
                            >
                              Test
                            </Button>
                            <IconButton
                              aria-label="Edit connection"
                              icon={<EditIcon />}
                              size="xs"
                              variant="ghost"
                            />
                            <IconButton
                              aria-label="Delete connection"
                              icon={<DeleteIcon />}
                              size="xs"
                              variant="ghost"
                              colorScheme="red"
                            />
                          </HStack>
                        </HStack>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              </TabPanel>
              
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Text fontSize="sm" color="gray.600">
                    Add a new data source connection.
                  </Text>
                  
                  <HStack spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="sm">Connection Name</FormLabel>
                      <Input
                        value={newConnection.name}
                        onChange={(e) => setNewConnection(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="My PLC Connection"
                        size="sm"
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel fontSize="sm">Connection Type</FormLabel>
                      <Select
                        value={newConnection.type}
                        onChange={(e) => setNewConnection(prev => ({ ...prev, type: e.target.value }))}
                        size="sm"
                      >
                        <option value="OPC UA">OPC UA</option>
                        <option value="MQTT">MQTT</option>
                        <option value="HTTPS">HTTPS API</option>
                        <option value="Modbus">Modbus TCP</option>
                        <option value="S7">Siemens S7</option>
                      </Select>
                    </FormControl>
                  </HStack>

                  <FormControl>
                    <FormLabel fontSize="sm">Endpoint URL</FormLabel>
                    <Input
                      value={newConnection.endpoint}
                      onChange={(e) => setNewConnection(prev => ({ ...prev, endpoint: e.target.value }))}
                      placeholder="opc.tcp://192.168.1.100:4840"
                      size="sm"
                    />
                  </FormControl>

                  {newConnection.type === 'OPC UA' && (
                    <>
                      <HStack spacing={4}>
                        <FormControl>
                          <FormLabel fontSize="sm">Username</FormLabel>
                          <Input
                            value={newConnection.username}
                            onChange={(e) => setNewConnection(prev => ({ ...prev, username: e.target.value }))}
                            size="sm"
                          />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel fontSize="sm">Password</FormLabel>
                          <Input
                            type="password"
                            value={newConnection.password}
                            onChange={(e) => setNewConnection(prev => ({ ...prev, password: e.target.value }))}
                            size="sm"
                          />
                        </FormControl>
                      </HStack>

                      <FormControl>
                        <FormLabel fontSize="sm">Security Policy</FormLabel>
                        <Select
                          value={newConnection.securityPolicy}
                          onChange={(e) => setNewConnection(prev => ({ ...prev, securityPolicy: e.target.value }))}
                          size="sm"
                        >
                          <option value="None">None</option>
                          <option value="Basic128">Basic128</option>
                          <option value="Basic256">Basic256</option>
                          <option value="Basic256Sha256">Basic256Sha256</option>
                        </Select>
                      </FormControl>
                    </>
                  )}

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="enabled" mb="0" fontSize="sm">
                      Enable Connection
                    </FormLabel>
                    <Switch
                      id="enabled"
                      isChecked={newConnection.enabled}
                      onChange={(e) => setNewConnection(prev => ({ ...prev, enabled: e.target.checked }))}
                    />
                  </FormControl>

                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    size="sm"
                    alignSelf="start"
                  >
                    Add Connection
                  </Button>
                </VStack>
              </TabPanel>
              
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Text fontSize="sm" color="gray.600">
                    Quick setup templates for common industrial protocols.
                  </Text>
                  
                  <VStack spacing={3} align="stretch">
                    {[
                      { name: 'Siemens S7-1500', type: 'OPC UA', endpoint: 'opc.tcp://192.168.1.100:4840' },
                      { name: 'Allen-Bradley ControlLogix', type: 'OPC UA', endpoint: 'opc.tcp://192.168.1.101:4840' },
                      { name: 'Schneider Modicon M580', type: 'Modbus', endpoint: '192.168.1.102:502' },
                      { name: 'MQTT Broker', type: 'MQTT', endpoint: 'mqtt://broker.local:1883' },
                    ].map((template, index) => (
                      <Card key={index} size="sm" cursor="pointer" _hover={{ bg: 'gray.50' }}>
                        <CardBody>
                          <HStack justify="space-between">
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm" fontWeight="semibold">{template.name}</Text>
                              <Text fontSize="xs" color="gray.500">{template.type}</Text>
                              <Code fontSize="xs">{template.endpoint}</Code>
                            </VStack>
                            <Button size="xs" colorScheme="blue" variant="outline">
                              Use Template
                            </Button>
                          </HStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose} size="sm">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DataSourceModal;
