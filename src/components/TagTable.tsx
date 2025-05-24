
import React, { useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Text,
  Badge,
  IconButton,
  HStack,
  Input,
  Select,
  useDisclosure,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Switch,
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

const TagTable = () => {
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

  const {
    isOpen: isTagModalOpen,
    onOpen: onTagModalOpen,
    onClose: onTagModalClose,
  } = useDisclosure();

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

  const handleEditTag = (tag: any) => {
    setSelectedTag(tag);
    onTagModalOpen();
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
            size="sm"
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
            size="sm"
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
              icon={<SettingsIcon />}
              size="xs"
              variant="ghost"
              onClick={() => handleEditTag(tag)}
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
      <Table variant="simple" size="sm">
        <Thead bg="gray.50" position="sticky" top={0} zIndex={1}>
          <Tr>
            <Th w="40px">
              <Checkbox
                isChecked={selectedTags.length === sortedTags.length && sortedTags.length > 0}
                isIndeterminate={selectedTags.length > 0 && selectedTags.length < sortedTags.length}
                onChange={selectAllTags}
              />
            </Th>
            {visibleColumns.map(column => (
              <Th
                key={column.key}
                cursor="pointer"
                onClick={() => handleSort(column.key)}
                w={`${column.width}px`}
                position="relative"
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
            <Th w="60px">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedTags.map((tag, index) => (
            <Tr
              key={tag.id}
              bg={selectedTags.includes(tag.id) ? 'brand.50' : index % 2 === 0 ? 'white' : 'gray.25'}
              _hover={{ bg: 'gray.100' }}
            >
              <Td>
                <Checkbox
                  isChecked={selectedTags.includes(tag.id)}
                  onChange={() => selectTag(tag.id)}
                />
              </Td>
              {visibleColumns.map(column => (
                <Td key={column.key} maxW={`${column.width}px`}>
                  {renderCell(tag, column)}
                </Td>
              ))}
              <Td>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Tag actions"
                    icon={<ChevronDownIcon />}
                    size="xs"
                    variant="ghost"
                  />
                  <MenuList>
                    <MenuItem icon={<EditIcon />} onClick={() => handleEditTag(tag)}>
                      Edit Tag
                    </MenuItem>
                    <MenuItem icon={<SettingsIcon />}>
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
            onTagModalClose();
            setSelectedTag(null);
          }}
          tag={selectedTag}
        />
      )}
    </Box>
  );
};

export default TagTable;
