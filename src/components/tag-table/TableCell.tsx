
import React from 'react';
import {
  Text,
  Badge,
  HStack,
  IconButton,
  Input,
  Select,
  Switch,
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import { DatabaseTag } from '../../services/tagService';

interface TableCellProps {
  tag: DatabaseTag;
  column: any;
  isEditing: boolean;
  editValue: string;
  onEditStart: (value: string) => void;
  onEditSave: (value: any) => void;
  onEditValueChange: (value: string) => void;
  onTagEdit: (tag: DatabaseTag) => void;
  onToggle: (field: string, value: boolean) => void;
}

const TableCell: React.FC<TableCellProps> = ({
  tag,
  column,
  isEditing,
  editValue,
  onEditStart,
  onEditSave,
  onEditValueChange,
  onTagEdit,
  onToggle,
}) => {
  const value = tag[column.key as keyof DatabaseTag];

  if (isEditing) {
    if (column.key === 'data_type') {
      return (
        <Select
          value={editValue}
          onChange={(e) => onEditValueChange(e.target.value)}
          onBlur={() => onEditSave(editValue)}
          size="sm"
          autoFocus
        >
          <option value="Bool">Bool</option>
          <option value="Int">Int</option>
          <option value="Real">Real</option>
          <option value="String">String</option>
        </Select>
      );
    } else if (['active', 'retain', 'direct_logging', 'alarm_enabled'].includes(column.key)) {
      return (
        <Switch
          isChecked={editValue === 'true'}
          onChange={(e) => onEditSave(e.target.checked)}
        />
      );
    } else {
      return (
        <Input
          value={editValue}
          onChange={(e) => onEditValueChange(e.target.value)}
          onBlur={() => onEditSave(editValue)}
          onKeyPress={(e) => e.key === 'Enter' && onEditSave(editValue)}
          size="sm"
          autoFocus
        />
      );
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected': return 'green';
      case 'Disconnected': return 'gray';
      case 'Error': return 'red';
      default: return 'yellow';
    }
  };

  switch (column.key) {
    case 'active':
    case 'retain':
    case 'direct_logging':
    case 'alarm_enabled':
      return (
        <Switch
          isChecked={value as boolean}
          onChange={(e) => onToggle(column.key, e.target.checked)}
        />
      );
    
    case 'connection_status':
      return (
        <Badge colorScheme={getStatusColor(value as string)} size="sm">
          {value as string}
        </Badge>
      );
    
    case 'data_source':
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
            {value as string}
          </Badge>
          <IconButton
            aria-label="Configure data source"
            size="xs"
            variant="ghost"
            onClick={() => onTagEdit(tag)}
            icon={<SettingsIcon />}
          />
        </HStack>
      );
    
    case 'updated_at':
      return (
        <Text fontSize="xs" color="gray.600">
          {new Date(value as string).toLocaleString()}
        </Text>
      );
    
    default:
      return (
        <Text
          fontSize="sm"
          cursor="pointer"
          onClick={() => onEditStart(value?.toString() || '')}
          _hover={{ bg: 'gray.50' }}
          p={1}
          borderRadius="sm"
        >
          {value?.toString() || ''}
        </Text>
      );
  }
};

export default TableCell;
