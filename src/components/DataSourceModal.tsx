
import React, { useState } from 'react';
import {
  Button,
  HStack,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
  CloseButton,
} from '@chakra-ui/react';
import ConnectionList from './data-source/ConnectionList';
import NewConnectionForm from './data-source/NewConnectionForm';

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

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="xl">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Data Source Connections</DialogTitle>
          <DialogCloseTrigger asChild>
            <CloseButton />
          </DialogCloseTrigger>
        </DialogHeader>
        
        <DialogBody>
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
            <ConnectionList 
              connections={connections} 
              onTest={handleTestConnection} 
            />
          )}
          
          {activeTab === 'new' && <NewConnectionForm />}
        </DialogBody>

        <DialogFooter>
          <Button colorPalette="blue" onClick={onClose} size="sm">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DataSourceModal;
