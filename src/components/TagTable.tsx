
import React, { useState } from 'react';
import {
  Box,
} from '@chakra-ui/react';
import { useTagStore } from '../store/tagStore';
import { useTags } from '../hooks/useTags';
import { DatabaseTag } from '../services/tagService';
import TagModal from './TagModal';
import TableHeader from './tag-table/TableHeader';
import TableRow from './tag-table/TableRow';

interface TagTableProps {
  onEditTag: (tag: DatabaseTag) => void;
}

const TagTable: React.FC<TagTableProps> = ({ onEditTag }) => {
  const { tags, updateTag } = useTags();
  const {
    selectedTags,
    searchTerm,
    filterType,
    filterGroup,
    columns,
    sortConfig,
    selectTag,
    selectMultipleTags,
    setSortConfig,
  } = useTagStore();

  const [editingCell, setEditingCell] = useState<{ tagId: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectedTag, setSelectedTag] = useState<DatabaseTag | null>(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (tag.comment || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || tag.data_type === filterType;
    const matchesGroup = filterGroup === 'All' || tag.group_name === filterGroup;
    return matchesSearch && matchesType && matchesGroup;
  });

  const sortedTags = [...filteredTags].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const visibleColumns = columns.filter(col => col.visible);

  const handleSort = (key: keyof DatabaseTag) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleCellEdit = (tagId: string, field: string, value: any) => {
    updateTag({ id: tagId, updates: { [field]: value } });
    setEditingCell(null);
  };

  const handleEditTagModal = (tag: DatabaseTag) => {
    setSelectedTag(tag);
    setIsTagModalOpen(true);
  };

  const selectAllTags = () => {
    if (selectedTags.length === sortedTags.length) {
      selectMultipleTags([]);
    } else {
      selectMultipleTags(sortedTags.map(tag => tag.id));
    }
  };

  const handleToggle = (tagId: string, field: string, value: boolean) => {
    updateTag({ id: tagId, updates: { [field]: value } });
  };

  return (
    <Box h="100%" overflow="auto">
      <Box as="table" w="100%">
        <TableHeader
          visibleColumns={visibleColumns}
          selectedTags={selectedTags}
          sortedTags={sortedTags}
          sortConfig={sortConfig}
          onSelectAll={selectAllTags}
          onSort={handleSort}
        />
        <Box as="tbody">
          {sortedTags.map((tag, index) => (
            <TableRow
              key={tag.id}
              tag={tag}
              index={index}
              visibleColumns={visibleColumns}
              isSelected={selectedTags.includes(tag.id)}
              editingCell={editingCell}
              editValue={editValue}
              onSelect={selectTag}
              onEditStart={(tagId, field, value) => {
                setEditingCell({ tagId, field });
                setEditValue(value);
              }}
              onEditSave={handleCellEdit}
              onEditValueChange={setEditValue}
              onTagEdit={handleEditTagModal}
              onToggle={handleToggle}
            />
          ))}
        </Box>
      </Box>

      {selectedTag && (
        <TagModal
          isOpen={isTagModalOpen}
          onClose={() => {
            setIsTagModalOpen(false);
            setSelectedTag(null);
          }}
          tag={selectedTag}
        />
      )}
    </Box>
  );
};

export default TagTable;
