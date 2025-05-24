
import React, { useState } from 'react';
import {
  useDisclosure,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  Badge,
  IconButton,
  Code,
  Textarea,
  useToast,
  Box,
  Flex,
  Heading,
  Stack,
  Spacer,
} from '@chakra-ui/react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
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

  const [activeTab, setActiveTab] = useState('connections');

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Data Source Connections</DialogTitle>
        </DialogHeader>
        
        <Box>
          {/* Tab Navigation */}
          <HStack mb={4} borderBottom="1px" borderColor="gray.200">
            <Button
              variant={activeTab === 'connections' ? 'solid' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('connections')}
            >
              Active Connections
            </Button>
            <Button
              variant={activeTab === 'new' ? 'solid' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('new')}
            >
              Add New Connection
            </Button>
            <Button
              variant={activeTab === 'templates' ? 'solid' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('templates')}
            >
              Connection Templates
            </Button>
          </HStack>
          
          {/* Tab Content */}
          {activeTab === 'connections' && (
            <VStack align="stretch">
              <Text fontSize="sm" color="gray.600">
                Manage active data source connections for your tags.
              </Text>
              
              {connections.map((connection) => (
                <Box key={connection.id} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                  <HStack justify="space-between" align="start">
                    <VStack align="start">
                      <HStack>
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
                    
                    <HStack>
                      <Button
                        size="xs"
                        colorScheme="blue"
                        onClick={() => handleTestConnection(connection)}
                      >
                        Test
                      </Button>
                      <IconButton
                        aria-label="Edit connection"
                        size="xs"
                        variant="ghost"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="Delete connection"
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </HStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
          
          {activeTab === 'new' && (
            <VStack align="stretch">
              <Text fontSize="sm" color="gray.600">
                Add a new data source connection.
              </Text>
              
              <HStack>
                <Box flex={1}>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>Connection Name</Text>
                  <Input
                    value={newConnection.name}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My PLC Connection"
                    size="sm"
                  />
                </Box>
                
                <Box flex={1}>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>Connection Type</Text>
                  <Select value={newConnection.type} onValueChange={(value) => setNewConnection(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPC UA">OPC UA</SelectItem>
                      <SelectItem value="MQTT">MQTT</SelectItem>
                      <SelectItem value="HTTPS">HTTPS API</SelectItem>
                      <SelectItem value="Modbus">Modbus TCP</SelectItem>
                      <SelectItem value="S7">Siemens S7</SelectItem>
                    </SelectContent>
                  </Select>
                </Box>
              </HStack>

              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={1}>Endpoint URL</Text>
                <Input
                  value={newConnection.endpoint}
                  onChange={(e) => setNewConnection(prev => ({ ...prev, endpoint: e.target.value }))}
                  placeholder="opc.tcp://192.168.1.100:4840"
                  size="sm"
                />
              </Box>

              {newConnection.type === 'OPC UA' && (
                <>
                  <HStack>
                    <Box flex={1}>
                      <Text fontSize="sm" fontWeight="medium" mb={1}>Username</Text>
                      <Input
                        value={newConnection.username}
                        onChange={(e) => setNewConnection(prev => ({ ...prev, username: e.target.value }))}
                        size="sm"
                      />
                    </Box>
                    
                    <Box flex={1}>
                      <Text fontSize="sm" fontWeight="medium" mb={1}>Password</Text>
                      <Input
                        type="password"
                        value={newConnection.password}
                        onChange={(e) => setNewConnection(prev => ({ ...prev, password: e.target.value }))}
                        size="sm"
                      />
                    </Box>
                  </HStack>

                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>Security Policy</Text>
                    <Select value={newConnection.securityPolicy} onValueChange={(value) => setNewConnection(prev => ({ ...prev, securityPolicy: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Basic128">Basic128</SelectItem>
                        <SelectItem value="Basic256">Basic256</SelectItem>
                        <SelectItem value="Basic256Sha256">Basic256Sha256</SelectItem>
                      </SelectContent>
                    </Select>
                  </Box>
                </>
              )}

              <HStack>
                <Text fontSize="sm" fontWeight="medium">Enable Connection</Text>
                <input
                  type="checkbox"
                  checked={newConnection.enabled}
                  onChange={(e) => setNewConnection(prev => ({ ...prev, enabled: e.target.checked }))}
                />
              </HStack>

              <Button colorScheme="blue" size="sm" alignSelf="start">
                <AddIcon mr={2} />
                Add Connection
              </Button>
            </VStack>
          )}
          
          {activeTab === 'templates' && (
            <VStack align="stretch">
              <Text fontSize="sm" color="gray.600">
                Quick setup templates for common industrial protocols.
              </Text>
              
              <VStack align="stretch">
                {[
                  { name: 'Siemens S7-1500', type: 'OPC UA', endpoint: 'opc.tcp://192.168.1.100:4840' },
                  { name: 'Allen-Bradley ControlLogix', type: 'OPC UA', endpoint: 'opc.tcp://192.168.1.101:4840' },
                  { name: 'Schneider Modicon M580', type: 'Modbus', endpoint: '192.168.1.102:502' },
                  { name: 'MQTT Broker', type: 'MQTT', endpoint: 'mqtt://broker.local:1883' },
                ].map((template, index) => (
                  <Box key={index} p={4} border="1px" borderColor="gray.200" borderRadius="md" cursor="pointer" _hover={{ bg: 'gray.50' }}>
                    <HStack justify="space-between">
                      <VStack align="start">
                        <Text fontSize="sm" fontWeight="semibold">{template.name}</Text>
                        <Text fontSize="xs" color="gray.500">{template.type}</Text>
                        <Code fontSize="xs">{template.endpoint}</Code>
                      </VStack>
                      <Button size="xs" colorScheme="blue" variant="outline">
                        Use Template
                      </Button>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </VStack>
          )}
        </Box>

        <DialogFooter>
          <Button colorScheme="blue" onClick={onClose} size="sm">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DataSourceModal;
