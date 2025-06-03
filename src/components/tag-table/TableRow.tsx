
import React from 'react';
import {
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import { Edit, Settings, ChevronDown } from 'lucide-react';
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
    <tr
      style={{
        backgroundColor: isSelected ? '#dbeafe' : index % 2 === 0 ? 'white' : '#f9fafb',
        borderBottom: '1px solid #e5e7eb'
      }}
    >
      <td style={{ padding: '12px' }}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(tag.id)}
        />
      </td>
      {visibleColumns.map(column => (
        <td key={column.key} style={{ padding: '12px' }}>
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
        </td>
      ))}
      <td style={{ padding: '12px' }}>
        <MenuRoot>
          <MenuTrigger asChild>
            <IconButton
              aria-label="Tag actions"
              size="xs"
              variant="ghost"
            >
              <ChevronDown size={16} />
            </IconButton>
          </MenuTrigger>
          <MenuContent>
            <MenuItem onClick={() => onTagEdit(tag)}>
              <Edit size={16} style={{ marginRight: '8px' }} />
              Edit Tag
            </MenuItem>
            <MenuItem>
              <Settings size={16} style={{ marginRight: '8px' }} />
              Configure
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </td>
    </tr>
  );
};

export default TableRow;
