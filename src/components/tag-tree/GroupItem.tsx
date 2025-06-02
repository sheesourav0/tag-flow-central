
import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  IconButton,
  Collapse,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon, SettingsIcon, AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { DatabaseGroup } from '../../services/tagService';
import { useGroups } from '../../hooks/useGroups';
import { useTags } from '../../hooks/useTags';

interface GroupItemProps {
  group: DatabaseGroup;
}

const GroupItem: React.FC<GroupItemProps> = ({ group }) => {
  const { updateGroup, deleteGroup } = useGroups();
  const { tags } = useTags();
  
  const groupTags = tags.filter(tag => tag.group_name === group.name);
  const activeTags = groupTags.filter(tag => tag.active);

  const handleToggleExpanded = () => {
    updateGroup({
      id: group.id,
      updates: { expanded: !group.expanded }
    });
  };

  const handleDeleteGroup = () => {
    if (groupTags.length > 0) {
      alert(`Cannot delete group "${group.name}" as it contains ${groupTags.length} tags.`);
      return;
    }
    
    if (confirm(`Delete group "${group.name}"?`)) {
      deleteGroup(group.id);
    }
  };

  return (
    <Box>
      <Box
        p={3}
        border="1px"
        borderColor="gray.200"
        borderRadius="md"
        bg="white"
        _hover={{ bg: 'gray.50' }}
      >
        <HStack justify="space-between">
          <HStack spacing={2} flex={1}>
            <IconButton
              aria-label="Toggle group"
              size="xs"
              variant="ghost"
              icon={group.expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
              onClick={handleToggleExpanded}
            />
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" fontWeight="medium">
                {group.name}
              </Text>
              {group.description && (
                <Text fontSize="xs" color="gray.500">
                  {group.description}
                </Text>
              )}
            </VStack>
          </HStack>
          
          <HStack spacing={2}>
            <Badge colorScheme="blue" variant="subtle">
              {activeTags.length}/{groupTags.length}
            </Badge>
            
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Group options"
                size="xs"
                variant="ghost"
                icon={<SettingsIcon />}
              />
              <MenuList>
                <MenuItem icon={<AddIcon />}>
                  Add Tag
                </MenuItem>
                <MenuItem icon={<SettingsIcon />}>
                  Edit Group
                </MenuItem>
                <MenuItem 
                  icon={<DeleteIcon />} 
                  onClick={handleDeleteGroup}
                  color="red.500"
                >
                  Delete Group
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </HStack>
      </Box>

      <Collapse in={group.expanded}>
        <Box ml={4} mt={2}>
          {groupTags.length === 0 ? (
            <Text fontSize="sm" color="gray.500" fontStyle="italic" p={2}>
              No tags in this group
            </Text>
          ) : (
            <VStack align="stretch" spacing={1}>
              {groupTags.map(tag => (
                <Box
                  key={tag.id}
                  p={2}
                  bg="gray.50"
                  borderRadius="md"
                  border="1px"
                  borderColor="gray.100"
                >
                  <HStack justify="space-between">
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="medium">
                        {tag.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {tag.data_type} | {tag.address}
                      </Text>
                    </VStack>
                    <VStack align="end" spacing={0}>
                      <Badge 
                        colorScheme={tag.active ? 'green' : 'gray'}
                        size="sm"
                      >
                        {tag.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Text fontSize="xs" color="gray.500">
                        {tag.value || 'No value'}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default GroupItem;
