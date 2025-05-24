
import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Heading,
  Flex,
  Badge,
  IconButton,
} from '@chakra-ui/react';
import { AddIcon, SettingsIcon, EditIcon } from '@chakra-ui/icons';
import TagTable from './TagTable';
import TagTree from './TagTree';
import TagModal from './TagModal';
import SettingsModal from './SettingsModal';
import DataSourceModal from './DataSourceModal';
import { useTagStore } from '../store/tagStore';

const TagFlowCentral = () => {
  const { 
    tags, 
    groups, 
    selectedTags, 
    addTag, 
    deleteSelectedTags,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterGroup,
    setFilterGroup
  } = useTagStore();

  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  const handleAddTag = () => {
    setEditingTag(null);
    setIsTagModalOpen(true);
  };

  const handleEditTag = (tag: any) => {
    setEditingTag(tag);
    setIsTagModalOpen(true);
  };

  const handleDeleteSelected = () => {
    if (selectedTags.length > 0 && confirm(`Delete ${selectedTags.length} selected tags?`)) {
      deleteSelectedTags();
    }
  };

  const dataTypes = ['Bool', 'Byte', 'Word', 'DWord', 'SInt', 'Int', 'DInt', 'USInt', 'UInt', 'UDInt', 'Real', 'LReal', 'String', 'Char', 'Time', 'Date'];

  return (
    <Box h="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" borderBottom="1px" borderColor="gray.200" p={6}>
        <Heading size="lg" color="gray.800" mb={2}>
          TagFlow Central
        </Heading>
        <Text color="gray.600">
          Industrial tag management system with real-time data connectivity
        </Text>
      </Box>

      {/* Toolbar */}
      <Box bg="white" borderBottom="1px" borderColor="gray.200" p={4}>
        <Flex wrap="wrap" gap={4} align="center">
          {/* Left side - Action buttons */}
          <HStack gap={2}>
            <Button
              onClick={handleAddTag}
              colorScheme="blue"
              size="sm"
            >
              <AddIcon mr={2} />
              Add Tag
            </Button>
            
            <Button
              onClick={handleDeleteSelected}
              colorScheme="red"
              size="sm"
              disabled={selectedTags.length === 0}
            >
              Delete ({selectedTags.length})
            </Button>

            <Button
              onClick={() => setIsDataSourceModalOpen(true)}
              variant="outline"
              size="sm"
            >
              Data Sources
            </Button>

            <Button
              onClick={() => setIsSettingsModalOpen(true)}
              variant="outline"
              size="sm"
            >
              <SettingsIcon mr={2} />
              Settings
            </Button>
          </HStack>

          {/* Right side - Filters */}
          <HStack ml="auto" gap={2}>
            <Input
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="sm"
              maxW="200px"
            />

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
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
              onChange={(e) => setFilterGroup(e.target.value)}
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
            <Badge>Total: {tags.length}</Badge>
            <Badge colorScheme="blue">Selected: {selectedTags.length}</Badge>
            <Badge colorScheme="green">Active: {tags.filter(t => t.active).length}</Badge>
          </HStack>
          <Text fontSize="sm" color="gray.500">
            Last updated: {new Date().toLocaleString()}
          </Text>
        </HStack>
      </Box>

      {/* Main Content */}
      <Flex h="calc(100vh - 160px)">
        {/* Left Panel - Tag Tree */}
        <Box w="300px" bg="white" borderRight="1px" borderColor="gray.200">
          <TagTree />
        </Box>

        {/* Right Panel - Tag Table */}
        <Box flex={1} bg="white">
          <TagTable onEditTag={handleEditTag} />
        </Box>
      </Flex>

      {/* Modals */}
      <TagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        tag={editingTag}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <DataSourceModal
        isOpen={isDataSourceModalOpen}
        onClose={() => setIsDataSourceModalOpen(false)}
      />
    </Box>
  );
};

export default TagFlowCentral;
