
import React from 'react';
import {
  HStack,
  Text,
} from '@chakra-ui/react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { DatabaseTag } from '../../services/tagService';

interface TableHeaderProps {
  visibleColumns: any[];
  selectedTags: string[];
  sortedTags: DatabaseTag[];
  sortConfig: { key: keyof DatabaseTag | null; direction: 'asc' | 'desc' };
  onSelectAll: () => void;
  onSort: (key: keyof DatabaseTag) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  visibleColumns,
  selectedTags,
  sortedTags,
  sortConfig,
  onSelectAll,
  onSort,
}) => {
  return (
    <thead>
      <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
        <th style={{ padding: '12px', textAlign: 'left' }}>
          <input
            type="checkbox"
            checked={selectedTags.length === sortedTags.length && sortedTags.length > 0}
            onChange={onSelectAll}
          />
        </th>
        {visibleColumns.map(column => (
          <th
            key={column.key}
            style={{ padding: '12px', textAlign: 'left', cursor: 'pointer' }}
            onClick={() => onSort(column.key)}
          >
            <HStack gap={1}>
              <Text fontWeight="medium">{column.label}</Text>
              {sortConfig.key === column.key && (
                sortConfig.direction === 'asc' ? 
                  <ChevronUp size={16} /> : 
                  <ChevronDown size={16} />
              )}
            </HStack>
          </th>
        ))}
        <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
