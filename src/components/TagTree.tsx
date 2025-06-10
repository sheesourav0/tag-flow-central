
import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
} from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';
import { useGroups } from '../hooks/useGroups';
import GroupItem from './tag-tree/GroupItem';

const TagTree = () => {
  const { groups, createGroup } = useGroups();

  const handleAddGroup = () => {
    const groupName = prompt('Enter group name:');
    if (groupName && !groups.find(g => g.name === groupName)) {
      createGroup({ 
        name: groupName,
        expanded: true
      });
    }
  };

  return (
    <Box h="100%" p={4} overflowY="auto">
      <VStack align="stretch" gap={2}>
        <Box border="1px" borderColor="gray.200" borderRadius="md">
          <Box py={3} px={4}>
            <HStack justify="space-between">
              <Text fontSize="sm" fontWeight="semibold" color="industrial.800">
                Tag Groups
              </Text>
              <Button
                size="xs"
                colorScheme="brand"
                onClick={handleAddGroup}
              >
                <MdAdd size={16} style={{ marginRight: '4px' }} />
                Add Group
              </Button>
            </HStack>
          </Box>
        </Box>

        {groups.map(group => (
          <GroupItem key={group.id} group={group} />
        ))}
      </VStack>
    </Box>
  );
};

export default TagTree;
