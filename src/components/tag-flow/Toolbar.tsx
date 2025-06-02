
import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  Badge,
  IconButton,
  Tooltip,
  Divider,
} from '@chakra-ui/react';
import { 
  AddIcon, 
  DeleteIcon, 
  SearchIcon, 
  SettingsIcon, 
  DownloadIcon,
  UploadIcon,
  RepeatIcon
} from '@chakra-ui/icons';
import { DatabaseGroup } from '../../services/tagService';

interface ToolbarProps {
  selectedCount: number;
  totalTags: number;
  activeTags: number;
  searchTerm: string;
  filterType: string;
  filterGroup: string;
  groups: DatabaseGroup[];
  onAddTag: () => void;
  onDeleteSelected: () => void;
  onDataSources: () => void;
  onSettings: () => void;
  onSearchChange: (term: string) => void;
  onFilterTypeChange: (type: string) => void;
  onFilterGroupChange: (group: string) => void;
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
  const dataTypes = ['All', 'Bool', 'Int16', 'Int32', 'Real', 'String', 'DateTime'];

  return (
    <Box bg="white" borderBottom="1px" borderColor="gray.200" p={4}>
      <VStack spacing={4} align="stretch">
        {/* Top Row - Actions and Stats */}
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              size="sm"
              onClick={onAddTag}
            >
              Add Tag
            </Button>
            
            <Button
              leftIcon={<DeleteIcon />}
              colorScheme="red"
              variant="outline"
              size="sm"
              isDisabled={selectedCount === 0}
              onClick={onDeleteSelected}
            >
              Delete ({selectedCount})
            </Button>
            
            <Divider orientation="vertical" h="24px" />
            
            <Tooltip label="Data Sources">
              <IconButton
                aria-label="Data sources"
                icon={<RepeatIcon />}
                size="sm"
                variant="outline"
                onClick={onDataSources}
              />
            </Tooltip>
            
            <Tooltip label="Import Tags">
              <IconButton
                aria-label="Import"
                icon={<UploadIcon />}
                size="sm"
                variant="outline"
              />
            </Tooltip>
            
            <Tooltip label="Export Tags">
              <IconButton
                aria-label="Export"
                icon={<DownloadIcon />}
                size="sm"
                variant="outline"
              />
            </Tooltip>
            
            <Tooltip label="Settings">
              <IconButton
                aria-label="Settings"
                icon={<SettingsIcon />}
                size="sm"
                variant="outline"
                onClick={onSettings}
              />
            </Tooltip>
          </HStack>

          <HStack spacing={4}>
            <VStack spacing={0} align="end">
              <Text fontSize="sm" fontWeight="semibold">
                {totalTags} Total Tags
              </Text>
              <Text fontSize="xs" color="gray.500">
                {activeTags} Active
              </Text>
            </VStack>
            
            {selectedCount > 0 && (
              <Badge colorScheme="blue" fontSize="sm" p={2}>
                {selectedCount} Selected
              </Badge>
            )}
          </HStack>
        </HStack>

        {/* Bottom Row - Search and Filters */}
        <HStack spacing={4}>
          <InputGroup size="sm" maxW="300px">
            <InputLeftElement>
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </InputGroup>
          
          <Select
            size="sm"
            maxW="150px"
            value={filterType}
            onChange={(e) => onFilterTypeChange(e.target.value)}
          >
            {dataTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
          
          <Select
            size="sm"
            maxW="150px"
            value={filterGroup}
            onChange={(e) => onFilterGroupChange(e.target.value)}
          >
            <option value="All">All Groups</option>
            {groups.map(group => (
              <option key={group.id} value={group.name}>{group.name}</option>
            ))}
          </Select>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Toolbar;
