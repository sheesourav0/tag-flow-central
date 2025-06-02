
import React from 'react';
import {
  Text,
  Input,
  Switch,
  Badge,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected': return 'green';
      case 'Disconnected': return 'red';
      case 'Connecting': return 'yellow';
      default: return 'gray';
    }
  };

  if (isEditing && column.key !== 'active' && column.key !== 'retain') {
    return (
      <HStack spacing={1}>
        <Input
          value={editValue}
          onChange={(e) => onEditValueChange(e.target.value)}
          size="xs"
          autoFocus
        />
        <IconButton
          aria-label="Save"
          size="xs"
          icon={<CheckIcon />}
          onClick={() => onEditSave(editValue)}
        />
        <IconButton
          aria-label="Cancel"
          size="xs"
          icon={<CloseIcon />}
          onClick={() => onEditStart('')}
        />
      </HStack>
    );
  }

  switch (column.key) {
    case 'active':
    case 'retain':
    case 'direct_logging':
    case 'alarm_enabled':
      return (
        <Switch
          isChecked={Boolean(value)}
          onChange={(e) => onToggle(column.key, e.target.checked)}
          size="sm"
        />
      );

    case 'connection_status':
      return (
        <Badge colorScheme={getStatusColor(String(value))}>
          {String(value)}
        </Badge>
      );

    case 'name':
      return (
        <HStack spacing={2}>
          <Text
            fontSize="sm"
            cursor="pointer"
            _hover={{ color: 'blue.500' }}
            onClick={() => onTagEdit(tag)}
          >
            {String(value)}
          </Text>
          <IconButton
            aria-label="Edit tag"
            size="xs"
            variant="ghost"
            icon={<EditIcon />}
            onClick={() => onTagEdit(tag)}
          />
        </HStack>
      );

    default:
      return (
        <Text
          fontSize="sm"
          cursor="pointer"
          onClick={() => onEditStart(String(value || ''))}
          _hover={{ bg: 'gray.100' }}
          p={1}
          borderRadius="md"
        >
          {String(value || '')}
        </Text>
      );
  }
};

export default TableCell;
