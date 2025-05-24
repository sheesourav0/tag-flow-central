
import React, { useState } from 'react';
import {
  Button,
  VStack,
  HStack,
  Text,
  Input,
  Badge,
  IconButton,
  Box,
  Flex,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DataSourceModal: React.FC<DataSourceModalProps> = ({ isOpen, onClose }) => {
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

  const [activeTab, setActiveTab] = useState('connections');

  const handleTestConnection = (connection: any) => {
    console.log('Testing connection:', connection.name);
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
          </HStack>
          
          {/* Tab Content */}
          {activeTab === 'connections' && (
            <VStack align="stretch" spacing={4}>
              <Text fontSize="sm" color="gray.600">
                Manage active data source connections for your tags.
              </Text>
              
              {connections.map((connection) => (
                <Box key={connection.id} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={2}>
                      <HStack spacing={2}>
                        <Text fontWeight="semibold">{connection.name}</Text>
                        <Badge colorScheme={getStatusColor(connection.status)}>
                          {connection.status}
                        </Badge>
                        <Badge variant="outline">{connection.type}</Badge>
                      </HStack>
                      <Text fontSize="xs" fontFamily="mono" bg="gray.100" p={1} borderRadius="md">
                        {connection.endpoint}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Last Update: {new Date(connection.lastUpdate).toLocaleString()}
                      </Text>
                    </VStack>
                    
                    <HStack spacing={2}>
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
                        icon={<EditIcon />}
                      />
                      <IconButton
                        aria-label="Delete connection"
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        icon={<DeleteIcon />}
                      />
                    </HStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
          
          {activeTab === 'new' && (
            <VStack align="stretch" spacing={4}>
              <Text fontSize="sm" color="gray.600">
                Add a new data source connection.
              </Text>
              
              <HStack spacing={4}>
                <Box flex={1}>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>Connection Name</Text>
                  <Input
                    placeholder="My PLC Connection"
                    size="sm"
                  />
                </Box>
                
                <Box flex={1}>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>Connection Type</Text>
                  <select 
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="OPC UA">OPC UA</option>
                    <option value="MQTT">MQTT</option>
                    <option value="HTTPS">HTTPS API</option>
                    <option value="Modbus">Modbus TCP</option>
                    <option value="S7">Siemens S7</option>
                  </select>
                </Box>
              </HStack>

              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={1}>Endpoint URL</Text>
                <Input
                  placeholder="opc.tcp://192.168.1.100:4840"
                  size="sm"
                />
              </Box>

              <Button colorScheme="blue" size="sm" alignSelf="start" leftIcon={<AddIcon />}>
                Add Connection
              </Button>
            </VStack>
          )}
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
