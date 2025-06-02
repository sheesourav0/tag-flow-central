
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseTag {
  id: string;
  name: string;
  data_type: string;
  address: string;
  value: string;
  comment: string;
  group_name: string;
  active: boolean;
  retain: boolean;
  data_source: string;
  mqtt_path?: string;
  opc_node_id?: string;
  modbus_register?: number;
  update_interval: string;
  multiplier: number;
  device_id: string;
  direct_logging: boolean;
  log_duration: string;
  alarm_enabled: boolean;
  alarm_high_limit?: number;
  alarm_low_limit?: number;
  connection_status: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseGroup {
  id: string;
  name: string;
  expanded: boolean;
  parent_id?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const tagService = {
  // Get all tags
  async getAllTags(): Promise<DatabaseTag[]> {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
    
    return data || [];
  },

  // Get all groups
  async getAllGroups(): Promise<DatabaseGroup[]> {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
    
    return data || [];
  },

  // Create a new tag
  async createTag(tag: Partial<DatabaseTag>): Promise<DatabaseTag> {
    const { data, error } = await supabase
      .from('tags')
      .insert([tag])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
    
    return data;
  },

  // Update a tag
  async updateTag(id: string, updates: Partial<DatabaseTag>): Promise<DatabaseTag> {
    const { data, error } = await supabase
      .from('tags')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
    
    return data;
  },

  // Delete a tag
  async deleteTag(id: string): Promise<void> {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  },

  // Delete multiple tags
  async deleteTags(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from('tags')
      .delete()
      .in('id', ids);
    
    if (error) {
      console.error('Error deleting tags:', error);
      throw error;
    }
  },

  // Create a new group
  async createGroup(group: Partial<DatabaseGroup>): Promise<DatabaseGroup> {
    const { data, error } = await supabase
      .from('groups')
      .insert([group])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating group:', error);
      throw error;
    }
    
    return data;
  },

  // Update a group
  async updateGroup(id: string, updates: Partial<DatabaseGroup>): Promise<DatabaseGroup> {
    const { data, error } = await supabase
      .from('groups')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating group:', error);
      throw error;
    }
    
    return data;
  },

  // Delete a group
  async deleteGroup(id: string): Promise<void> {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  }
};
