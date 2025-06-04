
import { useState, useCallback } from 'react';

export interface DataSource {
  id: string;
  name: string;
  type: 'OPC UA' | 'MQTT' | 'HTTPS' | 'Modbus' | 'S7';
  endpoint: string;
  status: 'Connected' | 'Disconnected' | 'Connecting' | 'Error';
  lastUpdate: string;
  config?: {
    username?: string;
    password?: string;
    port?: number;
    timeout?: number;
    [key: string]: any;
  };
}

const mockDataSources: DataSource[] = [
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
];

export const useDataSources = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>(mockDataSources);
  const [isLoading, setIsLoading] = useState(false);

  const validateDataSource = useCallback((dataSource: Partial<DataSource>): string[] => {
    const errors: string[] = [];
    
    if (!dataSource.name?.trim()) {
      errors.push('Connection name is required');
    }
    
    if (!dataSource.type) {
      errors.push('Connection type is required');
    }
    
    if (!dataSource.endpoint?.trim()) {
      errors.push('Endpoint URL is required');
    } else {
      // Basic URL validation
      const urlPattern = /^(https?|mqtt|opc\.tcp):\/\/.+/i;
      if (!urlPattern.test(dataSource.endpoint)) {
        errors.push('Invalid endpoint URL format');
      }
    }
    
    return errors;
  }, []);

  const testConnection = useCallback(async (dataSource: DataSource): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update status
      setDataSources(prev => prev.map(ds => 
        ds.id === dataSource.id 
          ? { ...ds, status: 'Connected' as const, lastUpdate: new Date().toISOString() }
          : ds
      ));
      
      return true;
    } catch (error) {
      setDataSources(prev => prev.map(ds => 
        ds.id === dataSource.id 
          ? { ...ds, status: 'Error' as const }
          : ds
      ));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addDataSource = useCallback(async (newDataSource: Omit<DataSource, 'id' | 'status' | 'lastUpdate'>): Promise<{ success: boolean; errors: string[]; id?: string }> => {
    const errors = validateDataSource(newDataSource);
    
    if (errors.length > 0) {
      return { success: false, errors };
    }

    // Check for duplicate names
    if (dataSources.some(ds => ds.name.toLowerCase() === newDataSource.name.toLowerCase())) {
      return { success: false, errors: ['A connection with this name already exists'] };
    }

    const dataSource: DataSource = {
      ...newDataSource,
      id: Date.now().toString(),
      status: 'Disconnected',
      lastUpdate: new Date().toISOString(),
    };

    setDataSources(prev => [...prev, dataSource]);
    
    return { success: true, errors: [], id: dataSource.id };
  }, [dataSources, validateDataSource]);

  const updateDataSource = useCallback(async (id: string, updates: Partial<DataSource>): Promise<{ success: boolean; errors: string[] }> => {
    const errors = validateDataSource(updates);
    
    if (errors.length > 0) {
      return { success: false, errors };
    }

    setDataSources(prev => prev.map(ds => 
      ds.id === id 
        ? { ...ds, ...updates, lastUpdate: new Date().toISOString() }
        : ds
    ));
    
    return { success: true, errors: [] };
  }, [validateDataSource]);

  const deleteDataSource = useCallback((id: string) => {
    setDataSources(prev => prev.filter(ds => ds.id !== id));
  }, []);

  return {
    dataSources,
    isLoading,
    addDataSource,
    updateDataSource,
    deleteDataSource,
    testConnection,
    validateDataSource,
  };
};
