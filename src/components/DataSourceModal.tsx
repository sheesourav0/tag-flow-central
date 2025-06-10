
import React, { useState, useEffect } from 'react';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogCloseTrigger,
  DialogTitle,
  VStack,
  TabsRoot,
  TabsList,
  TabsContent,
  TabsTrigger,
  createToaster,
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

const toaster = createToaster({
  placement: 'top',
});

const DataSourceModal: React.FC<DataSourceModalProps> = ({
  isOpen,
  onClose,
  dataSource,
}) => {
  const [activeTab, setActiveTab] = useState('create');
  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  const [connectionData, setConnectionData] = useState<Record<string, any>>({});
  const { dataSources, refetch } = useDataSources();

  useEffect(() => {
    if (dataSource) {
      setActiveTab('configure');
      setSelectedConnection(dataSource);
    } else {
      setActiveTab('create');
      setSelectedConnection(null);
    }
  }, [dataSource]);

  const handleConnectionCreated = () => {
    refetch();
    setActiveTab('select');
  };

  const handleConnectionSelect = (connection: any) => {
    setSelectedConnection(connection);
    setActiveTab('configure');
  };

  const handleTestConnection = async (connection: any) => {
    try {
      const result = await testDataSourceConnection(connection.id);
      if (result.success) {
        toaster.create({
          title: 'Connection Test Successful',
          description: 'The data source is working correctly',
          type: 'success',
          duration: 3000,
        });
        setConnectionData(result.data || {});
      } else {
        toaster.create({
          title: 'Connection Test Failed',
          description: result.error || 'Unknown error occurred',
          type: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      toaster.create({
        title: 'Connection Test Failed',
        description: 'Failed to test connection',
        type: 'error',
        duration: 5000,
      });
    }
  };

  const handleClose = () => {
    setSelectedConnection(null);
    setConnectionData({});
    onClose();
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={handleClose} size="xl">
      <DialogContent maxH="90vh">
        <DialogHeader>
          <DialogTitle>
            {dataSource ? 'Edit Data Source' : 'Data Source Manager'}
          </DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>
        <DialogBody pb={6}>
          <VStack gap={6} align="stretch">
            <TabsRoot value={activeTab} onValueChange={(details) => setActiveTab(details.value)}>
              <TabsList>
                <TabsTrigger value="create">Create Connection</TabsTrigger>
                <TabsTrigger value="select">Select Connection</TabsTrigger>
                <TabsTrigger value="configure" disabled={!selectedConnection}>
                  Configure Data Source
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create">
                <NewConnectionForm onSuccess={handleConnectionCreated} />
              </TabsContent>

              <TabsContent value="select">
                <ConnectionList
                  connections={dataSources || []}
                  onSelect={handleConnectionSelect}
                  onTest={handleTestConnection}
                  connectionData={connectionData}
                />
              </TabsContent>

              <TabsContent value="configure">
                {selectedConnection && (
                  <DataSourceConfigForm
                    connection={selectedConnection}
                    connectionData={connectionData}
                    onClose={handleClose}
                  />
                )}
              </TabsContent>
            </TabsRoot>
          </VStack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default DataSourceModal;
