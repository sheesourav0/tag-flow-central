
import React, { useState } from 'react';
import {
  Button,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Badge,
  VStack,
  Box,
} from '@chakra-ui/react';
import ConnectionList from './data-source/ConnectionList';
import NewConnectionForm from './data-source/NewConnectionForm';
import { useDataSources } from '../hooks/useDataSources';

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DataSourceModal: React.FC<DataSourceModalProps> = ({ isOpen, onClose }) => {
  const { dataSources, testConnection, connectionData } = useDataSources();
  const [activeTab, setActiveTab] = useState('connections');

  const handleTestConnection = (connection: any) => {
    testConnection(connection);
  };

  const handleConnectionAdded = () => {
    // Switch to connections tab to show the new connection
    setActiveTab('connections');
  };

  const connectedCount = dataSources.filter(ds => ds.status === 'Connected').length;
  const errorCount = dataSources.filter(ds => ds.status === 'Error').length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack align="start" spacing={2}>
            <Text>Data Source Connections</Text>
            <HStack spacing={4}>
              <HStack spacing={1}>
                <Badge colorScheme="green">{connectedCount}</Badge>
                <Text fontSize="sm" color="gray.600">Connected</Text>
              </HStack>
              <HStack spacing={1}>
                <Badge colorScheme="red">{errorCount}</Badge>
                <Text fontSize="sm" color="gray.600">Error</Text>
              </HStack>
              <HStack spacing={1}>
                <Badge>{dataSources.length}</Badge>
                <Text fontSize="sm" color="gray.600">Total</Text>
              </HStack>
            </HStack>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          {/* Tab Navigation */}
          <HStack mb={4} borderBottom="1px" borderColor="gray.200">
            <Button
              variant={activeTab === 'connections' ? 'solid' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('connections')}
            >
              Active Connections ({dataSources.length})
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
            <Box>
              <ConnectionList 
                connections={dataSources} 
                onTest={handleTestConnection}
                connectionData={connectionData}
              />
            </Box>
          )}
          
          {activeTab === 'new' && (
            <NewConnectionForm onSuccess={handleConnectionAdded} />
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
