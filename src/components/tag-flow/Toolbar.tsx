
import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Button,
  Input,
  Badge,
  Text,
} from '@chakra-ui/react';
import { AddIcon, SettingsIcon } from '@chakra-ui/icons';

interface ToolbarProps {
  selectedCount: number;
  totalTags: number;
  activeTags: number;
  searchTerm: string;
  filterType: string;
  filterGroup: string;
  groups: any[];
  onAddTag: () => void;
  onDeleteSelected: () => void;
  onDataSources: () => void;
  onSettings: () => void;
  onSearchChange: (value: string) => void;
  onFilterTypeChange: (value: string) => void;
  onFilterGroupChange: (value: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedCount,
  totalTags,
  activeTags,
  searchTerm,
  filterType,
  filterGroup,
  groups,
  onAddTag,
  onDeleteSelected,
  onDataSources,
  onSettings,
  onSearchChange,
  onFilterTypeChange,
  onFilterGroupChange,
}) => {
  const dataTypes = ['Bool', 'Byte', 'Word', 'DWord', 'Int', 'DInt', 'Real', 'String'];

  return (
    <Box bg="white" borderBottom="1px" borderColor="gray.200" p={4}>
      <Flex wrap="wrap" gap={4} align="center">
        {/* Left side - Action buttons */}
        <HStack gap={2}>
          <Button
            onClick={onAddTag}
            colorScheme="blue"
            size="sm"
            leftIcon={<AddIcon />}
          >
            Add Tag
          </Button>
          
          <Button
            onClick={onDeleteSelected}
            colorScheme="red"
            size="sm"
            disabled={selectedCount === 0}
          >
            Delete ({selectedCount})
          </Button>

          <Button
            onClick={onDataSources}
            variant="outline"
            size="sm"
          >
            Data Sources
          </Button>

          <Button
            onClick={onSettings}
            variant="outline"
            size="sm"
            leftIcon={<SettingsIcon />}
          >
            Settings
          </Button>
        </HStack>

        {/* Right side - Filters */}
        <HStack ml="auto" gap={2}>
          <Input
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            size="sm"
            maxW="200px"
          />

          <select
            value={filterType}
            onChange={(e) => onFilterTypeChange(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          >
            <option value="All">All Types</option>
            {dataTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={filterGroup}
            onChange={(e) => onFilterGroupChange(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          >
            <option value="All">All Groups</option>
            {groups.map(group => (
              <option key={group.id} value={group.name}>{group.name}</option>
            ))}
          </select>
        </HStack>
      </Flex>

      {/* Status bar */}
      <HStack justify="space-between" mt={3} pt={3} borderTop="1px" borderColor="gray.100">
        <HStack gap={2}>
          <Badge>Total: {totalTags}</Badge>
          <Badge colorScheme="blue">Selected: {selectedCount}</Badge>
          <Badge colorScheme="green">Active: {activeTags}</Badge>
        </HStack>
        <Text fontSize="sm" color="gray.500">
          Last updated: {new Date().toLocaleString()}
        </Text>
      </HStack>
    </Box>
  );
};

export default Toolbar;
