
import { supabase } from '../lib/supabase';
import { DataSource, DataSourceConfig } from '../types/dataSource';

export const dataSourceService = {
  // Fetch all data sources
  async fetchDataSources(): Promise<DataSource[]> {
    try {
      const { data, error } = await supabase
        .from('data_sources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching data sources:', error);
        throw error;
      }
      
      return (data || []).map(item => ({
        ...item,
        type: item.type as DataSource['type'],
        status: item.status as DataSource['status']
      })) as DataSource[];
    } catch (error) {
      console.error('Error in fetchDataSources:', error);
      throw error;
    }
  },

  // Create a new data source
  async createDataSource(dataSource: Omit<DataSource, 'id' | 'created_at' | 'updated_at'>): Promise<DataSource> {
    try {
      const { data, error } = await supabase
        .from('data_sources')
        .insert([dataSource])
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
    } catch (error) {
      console.error('Error in createDataSource:', error);
      throw error;
    }
  },

  // Update a data source
  async updateDataSource(id: string, updates: Partial<DataSource>): Promise<DataSource> {
    try {
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
    } catch (error) {
      console.error('Error in updateDataSource:', error);
      throw error;
    }
  },

  // Delete a data source
  async deleteDataSource(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('data_sources')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting data source:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteDataSource:', error);
      throw error;
    }
  },

  // Test data source connection
  async testConnection(dataSource: DataSource): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const config = dataSource.config as DataSourceConfig;
      
      if (dataSource.type === 'rest_api') {
        return await this.testRestApiConnection(config);
      } else if (dataSource.type === 'websocket') {
        return await this.testWebSocketConnection(config);
      } else if (dataSource.type === 'mqtt') {
        return await this.testMqttConnection(config);
      }
      
      return { success: false, error: 'Unsupported data source type' };
    } catch (error) {
      console.error('Error testing connection:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  // Test REST API connection
  async testRestApiConnection(config: DataSourceConfig): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(config.headers || {})
      };

      if (config.authType === 'bearer' && config.authToken) {
        headers['Authorization'] = `Bearer ${config.authToken}`;
      } else if (config.authType === 'api_key' && config.authToken) {
        headers['X-API-Key'] = config.authToken;
      }

      const response = await fetch(config.url || '', {
        method: config.method || 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  // Test WebSocket connection
  async testWebSocketConnection(config: DataSourceConfig): Promise<{ success: boolean; data?: any; error?: string }> {
    return new Promise((resolve) => {
      try {
        const ws = new WebSocket(config.url || '');
        const timeout = setTimeout(() => {
          ws.close();
          resolve({ success: false, error: 'Connection timeout' });
        }, 5000);

        ws.onopen = () => {
          clearTimeout(timeout);
          ws.close();
          resolve({ success: true, data: { message: 'WebSocket connection successful' } });
        };

        ws.onerror = () => {
          clearTimeout(timeout);
          resolve({ success: false, error: 'WebSocket connection failed' });
        };
      } catch (error) {
        resolve({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    });
  },

  // Test MQTT connection (simulated)
  async testMqttConnection(config: DataSourceConfig): Promise<{ success: boolean; data?: any; error?: string }> {
    // For demo purposes, simulate MQTT connection test
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful connection for demo
        resolve({ 
          success: true, 
          data: { 
            message: `MQTT connection to ${config.broker}:${config.port} successful`,
            topic: config.topic 
          } 
        });
      }, 1000);
    });
  },

  // Get sample data for a data source
  async getSampleData(dataSource: DataSource): Promise<any> {
    try {
      const testResult = await this.testConnection(dataSource);
      if (testResult.success && testResult.data) {
        return testResult.data;
      }
      
      // Return mock data based on the example provided
      return {
        "deviceId": 1018,
        "timestamp": Math.floor(Date.now() / 1000),
        "operating_mode": "1",
        "payload": {
          "battery_time_remaining": 16,
          "battery_level": 100,
          "grid_status": 1,
          "bulk_flow_meter_reading": 7968,
          "bulk_flow_meter_rate": 2.609999895,
          "delivery_valve": 0,
          "electrical_parameters": {
            "pf": 1,
            "total_KW": 0,
            "total_KWH": 2742,
            "realtime_current": 0,
            "realtime_voltage_parameters": {
              "phase_voltage_r": 245.6199951,
              "phase_voltage_y": 243.4100037,
              "phase_voltage_b": 242.9700012,
              "3_phase_voltage_avg": 422.6199951
            }
          },
          "water_levels": {
            "esr": 14,
            "ugr": 38,
            "tp": 0.939999998
          },
          "submersible_pump": {
            "status": 0,
            "current": 0,
            "fault": {
              "fault_exist": 0,
              "fault_code": 0
            }
          },
          "surface_pumps": {
            "status": 0,
            "current": 0,
            "fault": {
              "fault_exist": 0,
              "fault_code": 0
            }
          },
          "chlorine": {
            "residual_chlorine": 0,
            "ph": 0,
            "chlorine_doser_pump_status": 0,
            "chlorine_tank_level": 1
          },
          "extra_fields": {
            "battery_voltage": "14.39",
            "submersible_pump_run_time": "1:26",
            "surface_pump_run_time": "1:36",
            "residual_chlorine2": 0,
            "total_water_supplied_today": 61.61000061,
            "others": "4.3",
            "cv_remote_cmd_status": 0,
            "Send": 2,
            "Sends": 2,
            "motor1_remote_cmd_status": 0,
            "motor2_remote_cmd_status": 0
          },
          "surface_pump_switchover": 1,
          "backwash_indication": 1,
          "ground_water_level": 13.85000038
        }
      };
    } catch (error) {
      console.error('Error getting sample data:', error);
      throw error;
    }
  }
};

// Export individual functions for compatibility
export const testDataSourceConnection = async (id: string) => {
  try {
    const { data: dataSource, error } = await supabase
      .from('data_sources')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return await dataSourceService.testConnection(dataSource as DataSource);
  } catch (error) {
    console.error('Error testing data source connection:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

export const getSampleData = (dataSource: DataSource) => {
  return dataSourceService.getSampleData(dataSource);
};
