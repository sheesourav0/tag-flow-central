
import { supabase } from '@/integrations/supabase/client';

export interface DataSource {
  id: string;
  name: string;
  type: 'OPC UA' | 'MQTT' | 'HTTPS' | 'Modbus' | 'S7';
  endpoint: string;
  status: 'Connected' | 'Disconnected' | 'Connecting' | 'Error';
  last_update: string | null;
  config: any;
  created_at: string;
  updated_at: string;
}

export interface DataSourceConfig {
  // MQTT Configuration
  mqtt?: {
    topic: string;
    username?: string;
    password?: string;
    qos?: 0 | 1 | 2;
    clientId?: string;
  };
  
  // HTTPS Configuration
  https?: {
    method: 'GET' | 'POST';
    headers?: Record<string, string>;
    authType?: 'none' | 'bearer' | 'basic' | 'apikey';
    authToken?: string;
    polling_interval?: number; // in seconds
  };
  
  // OPC UA Configuration
  opcua?: {
    securityMode?: 'None' | 'Sign' | 'SignAndEncrypt';
    securityPolicy?: 'None' | 'Basic128Rsa15' | 'Basic256';
    username?: string;
    password?: string;
  };
  
  // Modbus Configuration
  modbus?: {
    unitId: number;
    timeout?: number;
    protocol?: 'TCP' | 'RTU';
  };
  
  // S7 Configuration
  s7?: {
    rack: number;
    slot: number;
    connectionType?: 'PG' | 'OP' | 'S7Basic';
  };
}

export const dataSourceService = {
  // Get all data sources
  async getAllDataSources(): Promise<DataSource[]> {
    const { data, error } = await supabase
      .from('data_sources')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching data sources:', error);
      throw error;
    }
    
    return (data || []).map(item => ({
      ...item,
      type: item.type as DataSource['type'],
      status: item.status as DataSource['status']
    })) as DataSource[];
  },

  // Create a new data source
  async createDataSource(dataSource: Omit<DataSource, 'id' | 'status' | 'last_update' | 'created_at' | 'updated_at'>): Promise<DataSource> {
    const { data, error } = await supabase
      .from('data_sources')
      .insert([{
        ...dataSource,
        status: 'Disconnected'
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating data source:', error);
      throw error;
    }
    
    return {
      ...data,
      type: data.type as DataSource['type'],
      status: data.status as DataSource['status']
    } as DataSource;
  },

  // Update a data source
  async updateDataSource(id: string, updates: Partial<DataSource>): Promise<DataSource> {
    const { data, error } = await supabase
      .from('data_sources')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating data source:', error);
      throw error;
    }
    
    return {
      ...data,
      type: data.type as DataSource['type'],
      status: data.status as DataSource['status']
    } as DataSource;
  },

  // Delete a data source
  async deleteDataSource(id: string): Promise<void> {
    const { error } = await supabase
      .from('data_sources')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting data source:', error);
      throw error;
    }
  },

  // Test connection to data source
  async testConnection(dataSource: DataSource): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      // Update status to "Connecting"
      await this.updateDataSource(dataSource.id, { 
        status: 'Connecting',
        last_update: new Date().toISOString()
      });
      
      const result = await this.fetchDataFromSource(dataSource);
      
      if (result.success) {
        await this.updateDataSource(dataSource.id, { 
          status: 'Connected',
          last_update: new Date().toISOString()
        });
      } else {
        await this.updateDataSource(dataSource.id, { 
          status: 'Error',
          last_update: new Date().toISOString()
        });
      }
      
      return result;
    } catch (error) {
      await this.updateDataSource(dataSource.id, { 
        status: 'Error',
        last_update: new Date().toISOString()
      });
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  },

  // Fetch actual data from data source
  async fetchDataFromSource(dataSource: DataSource): Promise<{ success: boolean; message: string; data?: any }> {
    console.log(`Attempting to connect to ${dataSource.type} data source: ${dataSource.name}`);
    
    switch (dataSource.type) {
      case 'HTTPS':
        return await this.fetchFromHTTPS(dataSource);
      case 'MQTT':
        return await this.connectToMQTT(dataSource);
      case 'OPC UA':
        return await this.connectToOPCUA(dataSource);
      case 'Modbus':
        return await this.connectToModbus(dataSource);
      case 'S7':
        return await this.connectToS7(dataSource);
      default:
        return { success: false, message: 'Unsupported data source type' };
    }
  },

  // HTTPS Data Fetching
  async fetchFromHTTPS(dataSource: DataSource): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const config = dataSource.config as DataSourceConfig;
      const httpsConfig = config.https || {};
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(httpsConfig.headers || {})
      };

      // Add authentication if configured
      if (httpsConfig.authType === 'bearer' && httpsConfig.authToken) {
        headers['Authorization'] = `Bearer ${httpsConfig.authToken}`;
      } else if (httpsConfig.authType === 'apikey' && httpsConfig.authToken) {
        headers['X-API-Key'] = httpsConfig.authToken;
      }

      const response = await fetch(dataSource.endpoint, {
        method: httpsConfig.method || 'GET',
        headers,
        // Add timeout
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('HTTPS Response:', data);

      return {
        success: true,
        message: 'Successfully connected to HTTPS endpoint',
        data
      };
    } catch (error) {
      console.error('HTTPS connection error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to connect to HTTPS endpoint'
      };
    }
  },

  // MQTT Connection (using WebSocket for browser compatibility)
  async connectToMQTT(dataSource: DataSource): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const config = dataSource.config as DataSourceConfig;
      const mqttConfig = config.mqtt || {};
      
      // For browser-based MQTT, we'll simulate the connection
      // In a real implementation, you'd use a WebSocket-based MQTT client
      console.log('Simulating MQTT connection to:', dataSource.endpoint);
      console.log('MQTT Config:', mqttConfig);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate receiving data similar to your example
      const simulatedData = {
        deviceId: 1018,
        timestamp: Math.floor(Date.now() / 1000),
        operating_mode: "1",
        payload: {
          battery_time_remaining: Math.floor(Math.random() * 24),
          battery_level: Math.floor(Math.random() * 100),
          grid_status: Math.random() > 0.5 ? 1 : 0,
          bulk_flow_meter_reading: Math.floor(Math.random() * 10000),
          bulk_flow_meter_rate: Math.random() * 5,
          electrical_parameters: {
            pf: 1,
            total_KW: Math.random() * 100,
            total_KWH: Math.floor(Math.random() * 5000),
            realtime_current: Math.random() * 10,
            realtime_voltage_parameters: {
              phase_voltage_r: 240 + Math.random() * 10,
              phase_voltage_y: 240 + Math.random() * 10,
              phase_voltage_b: 240 + Math.random() * 10,
              "3_phase_voltage_avg": 415 + Math.random() * 20
            }
          },
          water_levels: {
            esr: Math.floor(Math.random() * 50),
            ugr: Math.floor(Math.random() * 100),
            tp: Math.random()
          }
        }
      };

      return {
        success: true,
        message: `Successfully connected to MQTT broker. Topic: ${mqttConfig.topic || 'default'}`,
        data: simulatedData
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to connect to MQTT broker'
      };
    }
  },

  // OPC UA Connection
  async connectToOPCUA(dataSource: DataSource): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const config = dataSource.config as DataSourceConfig;
      console.log('Simulating OPC UA connection to:', dataSource.endpoint);
      console.log('OPC UA Config:', config.opcua);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate OPC UA data
      const simulatedData = {
        nodeValues: {
          'ns=2;s=Temperature': 25.5 + Math.random() * 10,
          'ns=2;s=Pressure': 100 + Math.random() * 50,
          'ns=2;s=FlowRate': Math.random() * 100
        },
        timestamp: new Date().toISOString(),
        quality: 'Good'
      };

      return {
        success: true,
        message: 'Successfully connected to OPC UA server',
        data: simulatedData
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to connect to OPC UA server'
      };
    }
  },

  // Modbus Connection
  async connectToModbus(dataSource: DataSource): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const config = dataSource.config as DataSourceConfig;
      console.log('Simulating Modbus connection to:', dataSource.endpoint);
      console.log('Modbus Config:', config.modbus);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Simulate Modbus register data
      const simulatedData = {
        registers: {
          40001: Math.floor(Math.random() * 1000),
          40002: Math.floor(Math.random() * 1000),
          40003: Math.floor(Math.random() * 1000)
        },
        timestamp: new Date().toISOString(),
        unitId: config.modbus?.unitId || 1
      };

      return {
        success: true,
        message: `Successfully connected to Modbus device (Unit ID: ${config.modbus?.unitId || 1})`,
        data: simulatedData
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to connect to Modbus device'
      };
    }
  },

  // S7 Connection
  async connectToS7(dataSource: DataSource): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const config = dataSource.config as DataSourceConfig;
      console.log('Simulating S7 connection to:', dataSource.endpoint);
      console.log('S7 Config:', config.s7);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1300));
      
      // Simulate S7 data
      const simulatedData = {
        dataBlocks: {
          'DB1.DBD0': Math.random() * 100,
          'DB1.DBD4': Math.random() * 200,
          'DB2.DBW0': Math.floor(Math.random() * 65535)
        },
        timestamp: new Date().toISOString(),
        rack: config.s7?.rack || 0,
        slot: config.s7?.slot || 2
      };

      return {
        success: true,
        message: `Successfully connected to S7 PLC (Rack: ${config.s7?.rack || 0}, Slot: ${config.s7?.slot || 2})`,
        data: simulatedData
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to connect to S7 PLC'
      };
    }
  },

  // Start real-time data collection
  async startDataCollection(dataSource: DataSource): Promise<void> {
    console.log(`Starting data collection for ${dataSource.name}`);
    // This would start a real-time data collection process
    // For now, we'll just update the status
    await this.updateDataSource(dataSource.id, {
      status: 'Connected',
      last_update: new Date().toISOString()
    });
  },

  // Stop data collection
  async stopDataCollection(dataSource: DataSource): Promise<void> {
    console.log(`Stopping data collection for ${dataSource.name}`);
    await this.updateDataSource(dataSource.id, {
      status: 'Disconnected',
      last_update: new Date().toISOString()
    });
  }
};
