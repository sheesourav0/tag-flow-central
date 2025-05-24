
import React, { useState, useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  HStack,
  Input,
  Select,
  IconButton,
  Badge,
  useDisclosure,
  useToast,
  Heading,
  Divider,
  Tooltip,
  Card,
  CardBody,
  CardHeader,
} from '@chakra-ui/react';
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
  SettingsIcon,
  DownloadIcon,
  UploadIcon,
  CopyIcon,
  ViewIcon,
  ViewOffIcon,
} from '@chakra-ui/icons';
import TagTree from './TagTree';
import TagTable from './TagTable';
import TagModal from './TagModal';
import SettingsModal from './SettingsModal';
import DataSourceModal from './DataSourceModal';
import { useTagStore } from '../store/tagStore';

const TagFlowCentral = () => {
  const {
    tags,
    groups,
    selectedTags,
    searchTerm,
    filterType,
    filterGroup,
    addTag,
    deleteSelectedTags,
    copySelectedTags,
    setSearchTerm,
    setFilterType,
    setFilterGroup,
    exportTags,
    importTags,
  } = useTagStore();

  const [activeView, setActiveView] = useState('table');
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isOpen: isTagModalOpen,
    onOpen: onTagModalOpen,
    onClose: onTagModalClose,
  } = useDisclosure();

  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();

  const {
    isOpen: isDataSourceOpen,
    onOpen: onDataSourceOpen,
    onClose: onDataSourceClose,
  } = useDisclosure();

  const handleAddTag = () => {
    onTagModalOpen();
  };

  const handleDeleteSelected = () => {
    if (selectedTags.length === 0) {
      toast({
        title: 'No tags selected',
        description: 'Please select tags to delete',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    deleteSelectedTags();
    toast({
      title: 'Tags deleted',
      description: `${selectedTags.length} tags have been deleted`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleExport = () => {
    exportTags();
    toast({
      title: 'Export successful',
      description: 'Tags have been exported to CSV',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importTags(file);
      toast({
        title: 'Import successful',
        description: 'Tags have been imported',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    event.target.value = '';
  };

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tag.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || tag.dataType === filterType;
    const matchesGroup = filterGroup === 'All' || tag.group === filterGroup;
    return matchesSearch && matchesType && matchesGroup;
  });

  return (
    <Box h="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <Card mb={0} borderRadius={0} borderBottom="2px" borderColor="brand.500">
        <CardBody py={4}>
          <Flex justify="space-between" align="center">
            <VStack align="start" spacing={0}>
              <Heading size="lg" color="industrial.800">
                Tag Flow Central
              </Heading>
              <Text color="industrial.600" fontSize="sm">
                Industrial Automation Tag Management System
              </Text>
            </VStack>
            <HStack spacing={2}>
              <Badge colorScheme="green" px={3} py={1} borderRadius="full">
                {tags.length} Total Tags
              </Badge>
              <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
                {filteredTags.length} Filtered
              </Badge>
              <Badge colorScheme="orange" px={3} py={1} borderRadius="full">
                {selectedTags.length} Selected
              </Badge>
            </HStack>
          </Flex>
        </CardBody>
      </Card>

      {/* Toolbar */}
      <Card mb={0} borderRadius={0} bg="white" borderBottom="1px" borderColor="gray.200">
        <CardBody py={3}>
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            {/* Left side - Actions */}
            <HStack spacing={2}>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="brand"
                onClick={handleAddTag}
                size="sm"
              >
                Add Tag
              </Button>
              
              <Button
                leftIcon={<DeleteIcon />}
                colorScheme="red"
                onClick={handleDeleteSelected}
                isDisabled={selectedTags.length === 0}
                size="sm"
              >
                Delete ({selectedTags.length})
              </Button>

              <Button
                leftIcon={<CopyIcon />}
                colorScheme="green"
                onClick={copySelectedTags}
                isDisabled={selectedTags.length === 0}
                size="sm"
              >
                Copy
              </Button>

              <Divider orientation="vertical" h="6" />

              <Tooltip label="Column Settings">
                <IconButton
                  aria-label="Settings"
                  icon={<SettingsIcon />}
                  onClick={onSettingsOpen}
                  variant="ghost"
                  size="sm"
                />
              </Tooltip>

              <Tooltip label="Data Sources">
                <IconButton
                  aria-label="Data Sources"
                  icon={<EditIcon />}
                  onClick={onDataSourceOpen}
                  variant="ghost"
                  size="sm"
                />
              </Tooltip>
            </HStack>

            {/* Right side - Filters and Search */}
            <HStack spacing={3}>
              <HStack spacing={2}>
                <SearchIcon color="gray.400" />
                <Input
                  placeholder="Search tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="sm"
                  w="200px"
                />
              </HStack>

              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                size="sm"
                w="120px"
              >
                <option value="All">All Types</option>
                <option value="Bool">Bool</option>
                <option value="Int">Int</option>
                <option value="Real">Real</option>
                <option value="String">String</option>
              </Select>

              <Select
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                size="sm"
                w="120px"
              >
                <option value="All">All Groups</option>
                {groups.map(group => (
                  <option key={group.id} value={group.name}>
                    {group.name}
                  </option>
                ))}
              </Select>

              <Divider orientation="vertical" h="6" />

              <Button
                leftIcon={<DownloadIcon />}
                onClick={handleExport}
                size="sm"
                variant="outline"
              >
                Export
              </Button>

              <Button
                leftIcon={<UploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                size="sm"
                variant="outline"
              >
                Import
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv,.json"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
            </HStack>
          </Flex>
        </CardBody>
      </Card>

      {/* Main Content */}
      <Flex flex={1} overflow="hidden">
        {/* Left Sidebar - Tag Tree */}
        <Box w="300px" borderRight="1px" borderColor="gray.200" bg="white">
          <TagTree />
        </Box>

        {/* Main Table Area */}
        <Box flex={1} overflow="hidden">
          <TagTable />
        </Box>
      </Flex>

      {/* Modals */}
      <TagModal isOpen={isTagModalOpen} onClose={onTagModalClose} />
      <SettingsModal isOpen={isSettingsOpen} onClose={onSettingsClose} />
      <DataSourceModal isOpen={isDataSourceOpen} onClose={onDataSourceClose} />
    </Box>
  );
};

export default TagFlowCentral;
