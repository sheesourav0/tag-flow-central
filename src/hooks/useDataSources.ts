
import { useState, useEffect, useCallback } from 'react';
import { dataSourceService, DataSource } from '../services/dataSourceService';
import { useToast } from '@/hooks/use-toast';

export { DataSource } from '../services/dataSourceService';

export const useDataSources = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch data sources from database
  const fetchDataSources = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await dataSourceService.getAllDataSources();
      setDataSources(data);
    } catch (error) {
      console.error('Error fetching data sources:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data sources",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load data sources on mount
  useEffect(() => {
    fetchDataSources();
  }, [fetchDataSources]);

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
      // Basic URL validation based on type
      const endpoint = dataSource.endpoint;
      switch (dataSource.type) {
        case 'OPC UA':
          if (!endpoint.startsWith('opc.tcp://')) {
            errors.push('OPC UA endpoint must start with opc.tcp://');
          }
          break;
        case 'MQTT':
          if (!endpoint.startsWith('mqtt://') && !endpoint.startsWith('mqtts://')) {
            errors.push('MQTT endpoint must start with mqtt:// or mqtts://');
          }
          break;
        case 'HTTPS':
          if (!endpoint.startsWith('https://') && !endpoint.startsWith('http://')) {
            errors.push('HTTPS endpoint must start with https:// or http://');
          }
          break;
        case 'Modbus':
        case 'S7':
          // Basic IP:port validation
          const ipPortPattern = /^(\d{1,3}\.){3}\d{1,3}:\d+$/;
          if (!ipPortPattern.test(endpoint)) {
            errors.push(`${dataSource.type} endpoint must be in format IP:PORT (e.g., 192.168.1.100:502)`);
          }
          break;
      }
    }
    
    return errors;
  }, []);

  const testConnection = useCallback(async (dataSource: DataSource): Promise<boolean> => {
    try {
      setIsLoading(true);
      const success = await dataSourceService.testConnection(dataSource.id);
      
      toast({
        title: success ? "Connection Successful" : "Connection Failed",
        description: success 
          ? `Successfully connected to ${dataSource.name}` 
          : `Failed to connect to ${dataSource.name}`,
        variant: success ? "default" : "destructive",
      });
      
      // Refresh data sources to get updated status
      await fetchDataSources();
      
      return success;
    } catch (error) {
      toast({
        title: "Connection Error",
        description: `Error testing connection to ${dataSource.name}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast, fetchDataSources]);

  const addDataSource = useCallback(async (newDataSource: Omit<DataSource, 'id' | 'status' | 'last_update' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; errors: string[]; id?: string }> => {
    const errors = validateDataSource(newDataSource);
    
    if (errors.length > 0) {
      return { success: false, errors };
    }

    // Check for duplicate names
    if (dataSources.some(ds => ds.name.toLowerCase() === newDataSource.name.toLowerCase())) {
      return { success: false, errors: ['A connection with this name already exists'] };
    }

    try {
      setIsLoading(true);
      const dataSource = await dataSourceService.createDataSource({
        ...newDataSource,
        config: {}
      });
      
      await fetchDataSources();
      
      toast({
        title: "Success",
        description: "Data source created successfully",
      });
      
      return { success: true, errors: [], id: dataSource.id };
    } catch (error: any) {
      const errorMessage = error.message?.includes('duplicate key') 
        ? 'A connection with this name already exists'
        : 'Failed to create data source';
        
      return { success: false, errors: [errorMessage] };
    } finally {
      setIsLoading(false);
    }
  }, [dataSources, validateDataSource, fetchDataSources, toast]);

  const updateDataSource = useCallback(async (id: string, updates: Partial<DataSource>): Promise<{ success: boolean; errors: string[] }> => {
    const errors = validateDataSource(updates);
    
    if (errors.length > 0) {
      return { success: false, errors };
    }

    try {
      setIsLoading(true);
      await dataSourceService.updateDataSource(id, updates);
      await fetchDataSources();
      
      toast({
        title: "Success",
        description: "Data source updated successfully",
      });
      
      return { success: true, errors: [] };
    } catch (error) {
      return { success: false, errors: ['Failed to update data source'] };
    } finally {
      setIsLoading(false);
    }
  }, [validateDataSource, fetchDataSources, toast]);

  const deleteDataSource = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      await dataSourceService.deleteDataSource(id);
      await fetchDataSources();
      
      toast({
        title: "Success",
        description: "Data source deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete data source",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchDataSources, toast]);

  return {
    dataSources,
    isLoading,
    addDataSource,
    updateDataSource,
    deleteDataSource,
    testConnection,
    validateDataSource,
    refetch: fetchDataSources,
  };
};
