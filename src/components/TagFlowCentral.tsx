
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
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon, SettingsIcon } from '@chakra-ui/icons';
import TagTable from './TagTable';
import TagTree from './TagTree';
import TagModal from './TagModal';
import SettingsModal from './SettingsModal';
import DataSourceModal from './DataSourceModal';
import { useTags } from '../hooks/useTags';
import { useGroups } from '../hooks/useGroups';
import { useTagStore } from '../store/tagStore';
import { DatabaseTag } from '../services/tagService';

const TagFlowCentral = () => {
  const { 
    tags, 
    isLoading: tagsLoading,
    deleteTags
  } = useTags();
  
  const { groups } = useGroups();
  
  const { 
    selectedTags, 
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterGroup,
    setFilterGroup,
    clearSelection
  } = useTagStore();

  const tagModalDisclosure = useDisclosure();
  const settingsModalDisclosure = useDisclosure();
  const dataSourceModalDisclosure = useDisclosure();
  const [editingTag, setEditingTag] = useState<DatabaseTag | null>(null);

  const handleAddTag = () => {
    setEditingTag(null);
    tagModalDisclosure.onOpen();
  };

  const handleEditTag = (tag: DatabaseTag) => {
    setEditingTag(tag);
    tagModalDisclosure.onOpen();
  };

  const handleDeleteSelected = () => {
    if (selectedTags.length > 0 && confirm(`Delete ${selectedTags.length} selected tags?`)) {
      deleteTags(selectedTags);
      clearSelection();
    }
  };

  const dataTypes = ['Bool', 'Byte', 'Word', 'DWord', 'Int', 'DInt', 'Real', 'String'];

  if (tagsLoading) {
    return (
      <Box h="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <Text>Loading tags...</Text>
      </Box>
    );
  }

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
              leftIcon={<AddIcon />}
            >
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
              onClick={dataSourceModalDisclosure.onOpen}
              variant="outline"
              size="sm"
            >
              Data Sources
            </Button>

            <Button
              onClick={settingsModalDisclosure.onOpen}
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
        isOpen={tagModalDisclosure.isOpen}
        onClose={tagModalDisclosure.onClose}
        tag={editingTag}
      />

      <SettingsModal
        isOpen={settingsModalDisclosure.isOpen}
        onClose={settingsModalDisclosure.onClose}
      />

      <DataSourceModal
        isOpen={dataSourceModalDisclosure.isOpen}
        onClose={dataSourceModalDisclosure.onClose}
      />
    </Box>
  );
};

export default TagFlowCentral;
