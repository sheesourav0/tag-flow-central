
import { create } from 'zustand';

export interface Tag {
  id: string;
  name: string;
  dataType: 'Bool' | 'Byte' | 'Word' | 'DWord' | 'Int' | 'DInt' | 'Real' | 'String';
  address: string;
  value: string;
  comment: string;
  group: string;
  active: boolean;
  retain: boolean;
  dataSource: 'Internal' | 'MQTT' | 'HTTPS' | 'OPC' | 'Modbus';
  mqttPath?: string;
  opcNodeId?: string;
  modbusRegister?: number;
  updateInterval: string;
  multiplier: number;
  deviceId: string;
  directLogging: boolean;
  logDuration: string;
  lastUpdate: string;
  alarmEnabled: boolean;
  alarmHighLimit?: number;
  alarmLowLimit?: number;
  connectionStatus: 'Connected' | 'Disconnected' | 'Error' | 'Unknown';
}

export interface Group {
  id: string;
  name: string;
  expanded: boolean;
  parent?: string;
  description?: string;
}

export interface Column {
  key: keyof Tag;
  label: string;
  visible: boolean;
  width: number;
  minWidth: number;
}

interface TagStore {
  tags: Tag[];
  groups: Group[];
  selectedTags: string[];
  searchTerm: string;
  filterType: string;
  filterGroup: string;
  columns: Column[];
  sortConfig: { key: keyof Tag | null; direction: 'asc' | 'desc' };
  
  // Actions
  addTag: (tag: Partial<Tag>) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  deleteSelectedTags: () => void;
  selectTag: (id: string) => void;
  selectMultipleTags: (ids: string[]) => void;
  clearSelection: () => void;
  copySelectedTags: () => void;
  setSearchTerm: (term: string) => void;
  setFilterType: (type: string) => void;
  setFilterGroup: (group: string) => void;
  setSortConfig: (config: { key: keyof Tag | null; direction: 'asc' | 'desc' }) => void;
  toggleColumn: (key: keyof Tag) => void;
  addGroup: (group: Partial<Group>) => void;
  updateGroup: (id: string, updates: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  exportTags: () => void;
  importTags: (file: File) => void;
}

const defaultColumns: Column[] = [
  { key: 'name', label: 'Name', visible: true, width: 150, minWidth: 100 },
  { key: 'dataType', label: 'Type', visible: true, width: 80, minWidth: 60 },
  { key: 'address', label: 'Address', visible: true, width: 100, minWidth: 80 },
  { key: 'value', label: 'Value', visible: true, width: 80, minWidth: 60 },
  { key: 'comment', label: 'Comment', visible: true, width: 200, minWidth: 100 },
  { key: 'group', label: 'Group', visible: true, width: 100, minWidth: 80 },
  { key: 'active', label: 'Active', visible: true, width: 60, minWidth: 50 },
  { key: 'retain', label: 'Retain', visible: true, width: 60, minWidth: 50 },
  { key: 'dataSource', label: 'Data Source', visible: true, width: 100, minWidth: 80 },
  { key: 'connectionStatus', label: 'Status', visible: true, width: 100, minWidth: 80 },
];

const initialTags: Tag[] = [
  {
    id: '1',
    name: 'Motor_1_Start',
    dataType: 'Bool',
    address: '%I0.0',
    value: 'FALSE',
    comment: 'Motor 1 start button',
    group: 'Motors',
    active: true,
    retain: false,
    dataSource: 'Internal',
    updateInterval: '1s',
    multiplier: 1,
    deviceId: 'PLC001',
    directLogging: false,
    logDuration: '24h',
    lastUpdate: new Date().toISOString(),
    alarmEnabled: false,
    connectionStatus: 'Connected',
  },
  {
    id: '2',
    name: 'Motor_1_Speed',
    dataType: 'Real',
    address: '%MD100',
    value: '1500.5',
    comment: 'Motor 1 speed setpoint',
    group: 'Motors',
    active: true,
    retain: true,
    dataSource: 'MQTT',
    mqttPath: 'sensors/motor1/speed',
    updateInterval: '500ms',
    multiplier: 1.5,
    deviceId: 'PLC001',
    directLogging: true,
    logDuration: '7d',
    lastUpdate: new Date().toISOString(),
    alarmEnabled: true,
    alarmHighLimit: 2000,
    alarmLowLimit: 0,
    connectionStatus: 'Connected',
  },
  {
    id: '3',
    name: 'Temperature_Tank1',
    dataType: 'Int',
    address: '%IW10',
    value: '25',
    comment: 'Tank 1 temperature sensor',
    group: 'Sensors',
    active: true,
    retain: false,
    dataSource: 'OPC',
    opcNodeId: 'ns=2;s=Temperature.Tank1',
    updateInterval: '2s',
    multiplier: 0.1,
    deviceId: 'SENSOR001',
    directLogging: true,
    logDuration: '30d',
    lastUpdate: new Date().toISOString(),
    alarmEnabled: true,
    alarmHighLimit: 80,
    alarmLowLimit: -10,
    connectionStatus: 'Connected',
  },
];

const initialGroups: Group[] = [
  { id: 'motors', name: 'Motors', expanded: true, description: 'Motor control tags' },
  { id: 'sensors', name: 'Sensors', expanded: true, description: 'Sensor input tags' },
  { id: 'actuators', name: 'Actuators', expanded: false, description: 'Actuator control tags' },
  { id: 'hmi', name: 'HMI', expanded: false, description: 'Human machine interface tags' },
];

export const useTagStore = create<TagStore>((set, get) => ({
  tags: initialTags,
  groups: initialGroups,
  selectedTags: [],
  searchTerm: '',
  filterType: 'All',
  filterGroup: 'All',
  columns: defaultColumns,
  sortConfig: { key: null, direction: 'asc' },

  addTag: (tagData) => {
    const newTag: Tag = {
      id: `tag_${Date.now()}`,
      name: tagData.name || 'NewTag',
      dataType: tagData.dataType || 'Bool',
      address: tagData.address || '%M0.0',
      value: tagData.value || 'FALSE',
      comment: tagData.comment || '',
      group: tagData.group || 'Default',
      active: tagData.active ?? true,
      retain: tagData.retain ?? false,
      dataSource: tagData.dataSource || 'Internal',
      updateInterval: tagData.updateInterval || '1s',
      multiplier: tagData.multiplier || 1,
      deviceId: tagData.deviceId || '',
      directLogging: tagData.directLogging ?? false,
      logDuration: tagData.logDuration || '24h',
      lastUpdate: new Date().toISOString(),
      alarmEnabled: tagData.alarmEnabled ?? false,
      connectionStatus: 'Unknown',
      ...tagData,
    };
    
    set((state) => ({ tags: [...state.tags, newTag] }));
  },

  updateTag: (id, updates) => {
    set((state) => ({
      tags: state.tags.map((tag) =>
        tag.id === id ? { ...tag, ...updates, lastUpdate: new Date().toISOString() } : tag
      ),
    }));
  },

  deleteTag: (id) => {
    set((state) => ({
      tags: state.tags.filter((tag) => tag.id !== id),
      selectedTags: state.selectedTags.filter((tagId) => tagId !== id),
    }));
  },

  deleteSelectedTags: () => {
    const { selectedTags } = get();
    set((state) => ({
      tags: state.tags.filter((tag) => !selectedTags.includes(tag.id)),
      selectedTags: [],
    }));
  },

  selectTag: (id) => {
    set((state) => ({
      selectedTags: state.selectedTags.includes(id)
        ? state.selectedTags.filter((tagId) => tagId !== id)
        : [...state.selectedTags, id],
    }));
  },

  selectMultipleTags: (ids) => {
    set({ selectedTags: ids });
  },

  clearSelection: () => {
    set({ selectedTags: [] });
  },

  copySelectedTags: () => {
    const { tags, selectedTags } = get();
    const tagsToCopy = tags.filter((tag) => selectedTags.includes(tag.id));
    const copiedTags = tagsToCopy.map((tag) => ({
      ...tag,
      id: `${tag.id}_copy_${Date.now()}`,
      name: `${tag.name}_Copy`,
    }));
    
    set((state) => ({
      tags: [...state.tags, ...copiedTags],
      selectedTags: copiedTags.map((tag) => tag.id),
    }));
  },

  setSearchTerm: (term) => set({ searchTerm: term }),
  setFilterType: (type) => set({ filterType: type }),
  setFilterGroup: (group) => set({ filterGroup: group }),

  setSortConfig: (config) => set({ sortConfig: config }),

  toggleColumn: (key) => {
    set((state) => ({
      columns: state.columns.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      ),
    }));
  },

  addGroup: (groupData) => {
    const newGroup: Group = {
      id: `group_${Date.now()}`,
      name: groupData.name || 'New Group',
      expanded: groupData.expanded ?? true,
      parent: groupData.parent,
      description: groupData.description,
    };
    
    set((state) => ({ groups: [...state.groups, newGroup] }));
  },

  updateGroup: (id, updates) => {
    set((state) => ({
      groups: state.groups.map((group) =>
        group.id === id ? { ...group, ...updates } : group
      ),
    }));
  },

  deleteGroup: (id) => {
    set((state) => ({
      groups: state.groups.filter((group) => group.id !== id),
    }));
  },

  exportTags: () => {
    const { tags } = get();
    const csvContent = [
      'Name,Type,Address,Value,Comment,Group,Active,Retain,DataSource,Status',
      ...tags.map(tag => 
        `${tag.name},${tag.dataType},${tag.address},${tag.value},"${tag.comment}",${tag.group},${tag.active},${tag.retain},${tag.dataSource},${tag.connectionStatus}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tags_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  },

  importTags: (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      const importedTags: Tag[] = lines.slice(1)
        .filter(line => line.trim())
        .map((line, index) => {
          const values = line.split(',');
          return {
            id: `imported_${Date.now()}_${index}`,
            name: values[0] || `ImportedTag_${index}`,
            dataType: (values[1] as Tag['dataType']) || 'Bool',
            address: values[2] || '%M0.0',
            value: values[3] || 'FALSE',
            comment: values[4]?.replace(/"/g, '') || '',
            group: values[5] || 'Imported',
            active: values[6] !== 'false',
            retain: values[7] === 'true',
            dataSource: (values[8] as Tag['dataSource']) || 'Internal',
            updateInterval: '1s',
            multiplier: 1,
            deviceId: '',
            directLogging: false,
            logDuration: '24h',
            lastUpdate: new Date().toISOString(),
            alarmEnabled: false,
            connectionStatus: 'Unknown' as Tag['connectionStatus'],
          };
        });

      set((state) => ({ tags: [...state.tags, ...importedTags] }));
    };
    reader.readAsText(file);
  },
}));
