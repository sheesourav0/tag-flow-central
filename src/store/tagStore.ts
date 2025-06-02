
import { create } from 'zustand';
import { DatabaseTag, DatabaseGroup } from '../services/tagService';

export interface Tag extends DatabaseTag {
  lastUpdate: string;
}

export interface Group extends DatabaseGroup {
  parent?: string;
}

export interface Column {
  key: keyof Tag;
  label: string;
  visible: boolean;
  width: number;
  minWidth: number;
}

interface TagStore {
  selectedTags: string[];
  searchTerm: string;
  filterType: string;
  filterGroup: string;
  columns: Column[];
  sortConfig: { key: keyof Tag | null; direction: 'asc' | 'desc' };
  
  // Actions
  selectTag: (id: string) => void;
  selectMultipleTags: (ids: string[]) => void;
  clearSelection: () => void;
  setSearchTerm: (term: string) => void;
  setFilterType: (type: string) => void;
  setFilterGroup: (group: string) => void;
  setSortConfig: (config: { key: keyof Tag | null; direction: 'asc' | 'desc' }) => void;
  toggleColumn: (key: keyof Tag) => void;
  exportTags: (tags: Tag[]) => void;
  importTags: (file: File) => void;
}

const defaultColumns: Column[] = [
  { key: 'name', label: 'Name', visible: true, width: 150, minWidth: 100 },
  { key: 'data_type', label: 'Type', visible: true, width: 80, minWidth: 60 },
  { key: 'address', label: 'Address', visible: true, width: 100, minWidth: 80 },
  { key: 'value', label: 'Value', visible: true, width: 80, minWidth: 60 },
  { key: 'comment', label: 'Comment', visible: true, width: 200, minWidth: 100 },
  { key: 'group_name', label: 'Group', visible: true, width: 100, minWidth: 80 },
  { key: 'active', label: 'Active', visible: true, width: 60, minWidth: 50 },
  { key: 'retain', label: 'Retain', visible: true, width: 60, minWidth: 50 },
  { key: 'data_source', label: 'Data Source', visible: true, width: 100, minWidth: 80 },
  { key: 'connection_status', label: 'Status', visible: true, width: 100, minWidth: 80 },
];

export const useTagStore = create<TagStore>((set, get) => ({
  selectedTags: [],
  searchTerm: '',
  filterType: 'All',
  filterGroup: 'All',
  columns: defaultColumns,
  sortConfig: { key: null, direction: 'asc' },

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

  exportTags: (tags) => {
    const csvContent = [
      'Name,Type,Address,Value,Comment,Group,Active,Retain,DataSource,Status',
      ...tags.map(tag => 
        `${tag.name},${tag.data_type},${tag.address},${tag.value},"${tag.comment}",${tag.group_name},${tag.active},${tag.retain},${tag.data_source},${tag.connection_status}`
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
    // This would need to be implemented with the backend service
    console.log('Import functionality needs backend implementation', file);
  },
}));
