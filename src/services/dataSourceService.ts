
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
    
    return data || [];
  },

  // Create a new data source
  async createDataSource(dataSource: Omit<DataSource, 'id' | 'status' | 'last_update' | 'created_at' | 'updated_at'>): Promise<DataSource> {
    const { data, error } = await supabase
      .from('data_sources')
      .insert([dataSource])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating data source:', error);
      throw error;
    }
    
    return data;
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
    
    return data;
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
  async testConnection(id: string): Promise<boolean> {
    try {
      // Update status to "Connecting"
      await this.updateDataSource(id, { 
        status: 'Connecting',
        last_update: new Date().toISOString()
      });
      
      // Simulate connection test (replace with actual validation logic)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, randomly succeed or fail for demo purposes
      const success = Math.random() > 0.3;
      
      await this.updateDataSource(id, { 
        status: success ? 'Connected' : 'Error',
        last_update: new Date().toISOString()
      });
      
      return success;
    } catch (error) {
      await this.updateDataSource(id, { 
        status: 'Error',
        last_update: new Date().toISOString()
      });
      return false;
    }
  }
};
