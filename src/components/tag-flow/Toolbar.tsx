
import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  Input,
  Select,
  Badge,
  Separator,
  Portal,
  createListCollection,
} from '@chakra-ui/react';
import { 
  Plus,
  Trash2,
  Search,
  Settings,
  Download,
  ArrowUp,
  RotateCcw
} from 'lucide-react';
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
  const dataTypes = createListCollection({
    items: [
      { label: 'All', value: 'All' },
      { label: 'Bool', value: 'Bool' },
      { label: 'Int16', value: 'Int16' },
      { label: 'Int32', value: 'Int32' },
      { label: 'Real', value: 'Real' },
      { label: 'String', value: 'String' },
      { label: 'DateTime', value: 'DateTime' },
    ],
  });

  const groupOptions = createListCollection({
    items: [
      { label: 'All Groups', value: 'All' },
      ...groups.map(group => ({ label: group.name, value: group.name })),
    ],
  });

  return (
    <Box bg="white" borderBottom="1px" borderColor="gray.200" p={4}>
      <VStack gap={4} align="stretch">
        {/* Top Row - Actions and Stats */}
        <HStack justify="space-between">
          <HStack gap={3}>
            <Button size="sm" colorPalette="blue" onClick={onAddTag}>
              <Plus size={16} />
              Add Tag
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              colorPalette="red"
              disabled={selectedCount === 0}
              onClick={onDeleteSelected}
            >
              <Trash2 size={16} />
              Delete ({selectedCount})
            </Button>
            
            <Separator orientation="vertical" height="24px" />
            
            <Button size="sm" variant="outline" onClick={onDataSources}>
              <RotateCcw size={16} />
            </Button>
            
            <Button size="sm" variant="outline">
              <ArrowUp size={16} />
            </Button>
            
            <Button size="sm" variant="outline">
              <Download size={16} />
            </Button>
            
            <Button size="sm" variant="outline" onClick={onSettings}>
              <Settings size={16} />
            </Button>
          </HStack>

          <HStack gap={4}>
            <VStack gap={0} align="end">
              <Text fontSize="sm" fontWeight="semibold">
                {totalTags} Total Tags
              </Text>
              <Text fontSize="xs" color="gray.500">
                {activeTags} Active
              </Text>
            </VStack>
            
            {selectedCount > 0 && (
              <Badge colorPalette="blue" size="sm">
                {selectedCount} Selected
              </Badge>
            )}
          </HStack>
        </HStack>

        {/* Bottom Row - Search and Filters */}
        <HStack gap={4}>
          <Box position="relative" maxW="300px">
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <Input
              pl="40px"
              size="sm"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </Box>
          
          <Select.Root
            collection={dataTypes}
            size="sm"
            width="150px"
            value={[filterType]}
            onValueChange={(e) => onFilterTypeChange(e.value[0])}
          >
            <Select.Trigger>
              <Select.ValueText />
            </Select.Trigger>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {dataTypes.items.map((type) => (
                    <Select.Item item={type} key={type.value}>
                      {type.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
          
          <Select.Root
            collection={groupOptions}
            size="sm"
            width="150px"
            value={[filterGroup]}
            onValueChange={(e) => onFilterGroupChange(e.value[0])}
          >
            <Select.Trigger>
              <Select.ValueText />
            </Select.Trigger>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {groupOptions.items.map((group) => (
                    <Select.Item item={group} key={group.value}>
                      {group.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Toolbar;
