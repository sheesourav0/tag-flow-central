
import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Badge,
  useDisclosure,
  Collapse,
} from '@chakra-ui/react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import { useTags } from '../../hooks/useTags';
import { useTagStore } from '../../store/tagStore';

interface GroupItemProps {
  group: any;
}

const GroupItem: React.FC<GroupItemProps> = ({ group }) => {
  const { tags } = useTags();
  const { selectedTags, selectTag } = useTagStore();
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: group.expanded });

  const groupTags = tags.filter(tag => tag.group_name === group.name);
  const totalTags = groupTags.length;
  const activeTags = groupTags.filter(tag => tag.active).length;
  const connectedTags = groupTags.filter(tag => tag.connection_status === 'Connected').length;

  return (
    <Box w="100%">
      <Box border="1px" borderColor="gray.200" borderRadius="md" mb={2}>
        <Box p={3}>
          <HStack justify="space-between">
            <HStack flex={1} onClick={onToggle} cursor="pointer" spacing={2}>
              <IconButton
                aria-label="Toggle group"
                size="xs"
                variant="ghost"
                icon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
              />
              <Text fontSize="sm" fontWeight="semibold" color="industrial.700">
                {group.name}
              </Text>
              <Badge colorScheme="blue" size="sm">
                {totalTags}
              </Badge>
            </HStack>
            <IconButton
              aria-label="Group settings"
              size="xs"
              variant="ghost"
              icon={<SettingsIcon />}
            />
          </HStack>
        </Box>
        
        <Collapse in={isOpen}>
          <Box px={3} pb={3}>
            {group.description && (
              <Text fontSize="xs" color="gray.600" mb={2}>
                {group.description}
              </Text>
            )}
            
            <HStack mb={3} flexWrap="wrap" spacing={2}>
              <Badge colorScheme="green" size="sm">
                {activeTags} Active
              </Badge>
              <Badge colorScheme="blue" size="sm">
                {connectedTags} Connected
              </Badge>
            </HStack>

            <VStack align="stretch" spacing={1}>
              {groupTags.map(tag => (
                <HStack
                  key={tag.id}
                  p={2}
                  bg={selectedTags.includes(tag.id) ? 'brand.50' : 'gray.50'}
                  borderRadius="md"
                  cursor="pointer"
                  onClick={() => selectTag(tag.id)}
                  _hover={{ bg: 'brand.100' }}
                  spacing={2}
                >
                  <Box
                    w={2}
                    h={2}
                    borderRadius="full"
                    bg={tag.connection_status === 'Connected' ? 'green.500' : 
                        tag.connection_status === 'Error' ? 'red.500' : 'gray.400'}
                  />
                  <Text fontSize="xs" flex={1}>
                    {tag.name}
                  </Text>
                  <Badge
                    colorScheme={
                      tag.data_source === 'Internal' ? 'gray' :
                      tag.data_source === 'MQTT' ? 'purple' :
                      tag.data_source === 'OPC' ? 'orange' : 'blue'
                    }
                    size="sm"
                  >
                    {tag.data_source}
                  </Badge>
                </HStack>
              ))}
              
              {groupTags.length === 0 && (
                <Text fontSize="xs" color="gray.500" textAlign="center" py={2}>
                  No tags in this group
                </Text>
              )}
            </VStack>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default GroupItem;
