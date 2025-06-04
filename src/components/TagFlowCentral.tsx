
import React, { useState } from 'react';
import {
  Box,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import TagTable from './TagTable';
import TagTree from './TagTree';
import TagModal from './TagModal';
import SettingsModal from './SettingsModal';
import DataSourceModal from './DataSourceModal';
import Header from './tag-flow/Header';
import Toolbar from './tag-flow/Toolbar';
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

  if (tagsLoading) {
    return (
      <Box h="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <Box color="gray.600" fontSize="lg">Loading tags...</Box>
      </Box>
    );
  }

  return (
    <Box h="100vh" bg="gray.50">
      <Header />
      
      <Toolbar
        selectedCount={selectedTags.length}
        totalTags={tags.length}
        activeTags={tags.filter(t => t.active).length}
        searchTerm={searchTerm}
        filterType={filterType}
        filterGroup={filterGroup}
        groups={groups}
        onAddTag={handleAddTag}
        onDeleteSelected={handleDeleteSelected}
        onDataSources={dataSourceModalDisclosure.onOpen}
        onSettings={settingsModalDisclosure.onOpen}
        onSearchChange={setSearchTerm}
        onFilterTypeChange={setFilterType}
        onFilterGroupChange={setFilterGroup}
      />

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
        isOpen={tagModalDisclosure.open}
        onClose={tagModalDisclosure.onClose}
        tag={editingTag}
      />

      <SettingsModal
        isOpen={settingsModalDisclosure.open}
        onClose={settingsModalDisclosure.onClose}
      />

      <DataSourceModal
        isOpen={dataSourceModalDisclosure.open}
        onClose={dataSourceModalDisclosure.onClose}
      />
    </Box>
  );
};

export default TagFlowCentral;
