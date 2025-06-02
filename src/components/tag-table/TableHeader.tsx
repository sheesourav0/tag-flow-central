
import React from 'react';
import {
  Thead,
  Tr,
  Th,
  Checkbox,
  HStack,
  Text,
} from '@chakra-ui/react';
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
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
    <Thead>
      <Tr>
        <Th>
          <Checkbox
            isChecked={selectedTags.length === sortedTags.length && sortedTags.length > 0}
            onChange={onSelectAll}
          />
        </Th>
        {visibleColumns.map(column => (
          <Th
            key={column.key}
            cursor="pointer"
            onClick={() => onSort(column.key)}
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
  );
};

export default TableHeader;
