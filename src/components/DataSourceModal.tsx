
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
} from '@chakra-ui/react';
import { useDataSources } from '../hooks/useDataSources';
import NewConnectionForm from './data-source/NewConnectionForm';
import ConnectionList from './data-source/ConnectionList';
import DataSourceConfigForm from './data-source/DataSourceConfigForm';
import { testDataSourceConnection } from '../services/dataSourceService';

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataSource?: any;
}

const DataSourceModal: React.FC<DataSourceModalProps> = ({
  isOpen,
  onClose,
  dataSource,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  const [connectionData, setConnectionData] = useState<Record<string, any>>({});
  const { dataSources, refetch } = useDataSources();
  const toast = useToast();

  useEffect(() => {
    if (dataSource) {
      setActiveTab(2);
      setSelectedConnection(dataSource);
    } else {
      setActiveTab(0);
      setSelectedConnection(null);
    }
  }, [dataSource]);

  const handleConnectionCreated = () => {
    refetch();
    setActiveTab(1);
  };

  const handleConnectionSelect = (connection: any) => {
    setSelectedConnection(connection);
    setActiveTab(2);
  };

  const handleTestConnection = async (connection: any) => {
    try {
      const result = await testDataSourceConnection(connection.id);
      if (result.success) {
        toast({
          title: 'Connection Test Successful',
          description: 'The data source is working correctly',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setConnectionData(result.data || {});
      } else {
        toast({
          title: 'Connection Test Failed',
          description: result.error || 'Unknown error occurred',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Connection Test Failed',
        description: 'Failed to test connection',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleClose = () => {
    setSelectedConnection(null);
    setConnectionData({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="4xl">
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>
          {dataSource ? 'Edit Data Source' : 'Data Source Manager'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
              <TabList>
                <Tab>Create Connection</Tab>
                <Tab>Select Connection</Tab>
                <Tab isDisabled={!selectedConnection}>Configure Data Source</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <NewConnectionForm onSuccess={handleConnectionCreated} />
                </TabPanel>

                <TabPanel>
                  <ConnectionList
                    connections={dataSources || []}
                    onSelect={handleConnectionSelect}
                    onTest={handleTestConnection}
                    connectionData={connectionData}
                  />
                </TabPanel>

                <TabPanel>
                  {selectedConnection && (
                    <DataSourceConfigForm
                      connection={selectedConnection}
                      connectionData={connectionData}
                      onClose={handleClose}
                    />
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DataSourceModal;
