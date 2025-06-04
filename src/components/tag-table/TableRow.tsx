
import React from 'react';
import {
  Tr,
  Td,
  Checkbox,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { EditIcon, SettingsIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { DatabaseTag } from '../../services/tagService';
import TableCell from './TableCell';

interface TableRowProps {
  tag: DatabaseTag;
  index: number;
  visibleColumns: any[];
  isSelected: boolean;
  editingCell: { tagId: string; field: string } | null;
  editValue: string;
  onSelect: (tagId: string) => void;
  onEditStart: (tagId: string, field: string, value: string) => void;
  onEditSave: (tagId: string, field: string, value: any) => void;
  onEditValueChange: (value: string) => void;
  onTagEdit: (tag: DatabaseTag) => void;
  onToggle: (tagId: string, field: string, value: boolean) => void;
}

const TableRow: React.FC<TableRowProps> = ({
  tag,
  index,
  visibleColumns,
  isSelected,
  editingCell,
  editValue,
  onSelect,
  onEditStart,
  onEditSave,
  onEditValueChange,
  onTagEdit,
  onToggle,
}) => {
  return (
    <Tr
      bg={isSelected ? 'blue.50' : index % 2 === 0 ? 'white' : 'gray.25'}
      _hover={{ bg: 'gray.100' }}
    >
      <Td>
        <Checkbox
          isChecked={isSelected}
          onChange={() => onSelect(tag.id)}
        />
      </Td>
      {visibleColumns.map(column => (
        <Td key={column.key}>
          <TableCell
            tag={tag}
            column={column}
            isEditing={editingCell?.tagId === tag.id && editingCell?.field === column.key}
            editValue={editValue}
            onEditStart={(value) => onEditStart(tag.id, column.key, value)}
            onEditSave={(value) => onEditSave(tag.id, column.key, value)}
            onEditValueChange={onEditValueChange}
            onTagEdit={onTagEdit}
            onToggle={(field, value) => onToggle(tag.id, field, value)}
          />
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
            <MenuItem onClick={() => onTagEdit(tag)}>
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
  );
};

export default TableRow;
