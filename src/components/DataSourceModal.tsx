
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
} from '@chakra-ui/react';
import ConnectionList from './data-source/ConnectionList';
import NewConnectionForm from './data-source/NewConnectionForm';
import { useDataSources } from '../hooks/useDataSources';

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DataSourceModal: React.FC<DataSourceModalProps> = ({ isOpen, onClose }) => {
  const { dataSources, testConnection } = useDataSources();
  const [activeTab, setActiveTab] = useState('connections');

  const handleTestConnection = (connection: any) => {
    testConnection(connection);
  };

  const handleConnectionAdded = () => {
    // Switch to connections tab to show the new connection
    setActiveTab('connections');
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
            <ConnectionList 
              connections={dataSources} 
              onTest={handleTestConnection} 
            />
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
