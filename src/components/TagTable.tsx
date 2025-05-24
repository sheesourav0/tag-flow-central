
import React, { useState } from 'react';
import {
  Box,
  HStack,
  Text,
  Badge,
  IconButton,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Switch,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Select,
} from '@chakra-ui/react';
import {
  EditIcon,
  SettingsIcon,
  TriangleUpIcon,
  TriangleDownIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons';
import { useTagStore } from '../store/tagStore';
import TagModal from './TagModal';

interface TagTableProps {
  onEditTag: (tag: any) => void;
}

const TagTable: React.FC<TagTableProps> = ({ onEditTag }) => {
  const {
    tags,
    selectedTags,
    searchTerm,
    filterType,
    filterGroup,
    columns,
    sortConfig,
    selectTag,
    selectMultipleTags,
    updateTag,
    setSortConfig,
  } = useTagStore();

  const [editingCell, setEditingCell] = useState<{ tagId: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectedTag, setSelectedTag] = useState<any>(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tag.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || tag.dataType === filterType;
    const matchesGroup = filterGroup === 'All' || tag.group === filterGroup;
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

  const handleSort = (key: any) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleCellEdit = (tagId: string, field: string, value: any) => {
    updateTag(tagId, { [field]: value });
    setEditingCell(null);
  };

  const handleEditTagModal = (tag: any) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected': return 'green';
      case 'Disconnected': return 'gray';
      case 'Error': return 'red';
      default: return 'yellow';
    }
  };

  const renderCell = (tag: any, column: any) => {
    const isEditing = editingCell?.tagId === tag.id && editingCell?.field === column.key;
    const value = tag[column.key];

    if (isEditing) {
      if (column.key === 'dataType') {
        return (
          <Select
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleCellEdit(tag.id, column.key, editValue)}
            size="sm"
            autoFocus
          >
            <option value="Bool">Bool</option>
            <option value="Int">Int</option>
            <option value="Real">Real</option>
            <option value="String">String</option>
          </Select>
        );
      } else if (['active', 'retain', 'directLogging', 'alarmEnabled'].includes(column.key)) {
        return (
          <Switch
            isChecked={editValue === 'true'}
            onChange={(e) => handleCellEdit(tag.id, column.key, e.target.checked)}
          />
        );
      } else {
        return (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleCellEdit(tag.id, column.key, editValue)}
            onKeyPress={(e) => e.key === 'Enter' && handleCellEdit(tag.id, column.key, editValue)}
            size="sm"
            autoFocus
          />
        );
      }
    }

    switch (column.key) {
      case 'active':
      case 'retain':
      case 'directLogging':
      case 'alarmEnabled':
        return (
          <Switch
            isChecked={value}
            onChange={(e) => updateTag(tag.id, { [column.key]: e.target.checked })}
          />
        );
      
      case 'connectionStatus':
        return (
          <Badge colorScheme={getStatusColor(value)} size="sm">
            {value}
          </Badge>
        );
      
      case 'dataSource':
        return (
          <HStack spacing={1}>
            <Badge
              colorScheme={
                value === 'Internal' ? 'gray' :
                value === 'MQTT' ? 'purple' :
                value === 'OPC' ? 'orange' : 'blue'
              }
              size="sm"
            >
              {value}
            </Badge>
            <IconButton
              aria-label="Configure data source"
              size="xs"
              variant="ghost"
              onClick={() => onEditTag(tag)}
              icon={<SettingsIcon />}
            />
          </HStack>
        );
      
      case 'lastUpdate':
        return (
          <Text fontSize="xs" color="gray.600">
            {new Date(value).toLocaleString()}
          </Text>
        );
      
      default:
        return (
          <Text
            fontSize="sm"
            cursor="pointer"
            onClick={() => {
              setEditingCell({ tagId: tag.id, field: column.key });
              setEditValue(value?.toString() || '');
            }}
            _hover={{ bg: 'gray.50' }}
            p={1}
            borderRadius="sm"
          >
            {value?.toString() || ''}
          </Text>
        );
    }
  };

  return (
    <Box h="100%" overflow="auto">
      <Table>
        <Thead>
          <Tr>
            <Th>
              <Checkbox
                isChecked={selectedTags.length === sortedTags.length && sortedTags.length > 0}
                onChange={selectAllTags}
              />
            </Th>
            {visibleColumns.map(column => (
              <Th
                key={column.key}
                cursor="pointer"
                onClick={() => handleSort(column.key)}
              >
                <HStack spacing={1}>
                  <Text>{column.label}</Text>
                  {sortConfig.key === column.key && (
                    sortConfig.direction === 'asc' ? 
                      <TriangleUpIcon /> : 
                      <TriangleDownIcon />
                  )}
                </HStack>
              </Th>
            ))}
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedTags.map((tag, index) => (
            <Tr
              key={tag.id}
              bg={selectedTags.includes(tag.id) ? 'blue.50' : index % 2 === 0 ? 'white' : 'gray.25'}
              _hover={{ bg: 'gray.100' }}
            >
              <Td>
                <Checkbox
                  isChecked={selectedTags.includes(tag.id)}
                  onChange={() => selectTag(tag.id)}
                />
              </Td>
              {visibleColumns.map(column => (
                <Td key={column.key}>
                  {renderCell(tag, column)}
                </Td>
              ))}
              <Td>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Tag actions"
                    size="xs"
                    variant="ghost"
                    icon={<ChevronDownIcon />}
                  />
                  <MenuList>
                    <MenuItem onClick={() => handleEditTagModal(tag)}>
                      <EditIcon mr={2} />
                      Edit Tag
                    </MenuItem>
                    <MenuItem>
                      <SettingsIcon mr={2} />
                      Configure
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

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
