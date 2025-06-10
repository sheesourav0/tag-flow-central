
export interface DataSource {
  id: string;
  name: string;
  type: 'rest_api' | 'websocket' | 'mqtt';
  description?: string;
  config: DataSourceConfig;
  status: 'active' | 'inactive' | 'error';
  created_at?: string;
  updated_at?: string;
  update_interval?: number;
  data_mapping?: Record<string, any>;
  filters?: Record<string, any>;
  sample_data?: any;
}

export interface DataSourceConfig {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  authType?: 'none' | 'bearer' | 'api_key';
  authToken?: string;
  broker?: string;
  port?: number;
  topic?: string;
  qos?: number;
  username?: string;
  password?: string;
}
