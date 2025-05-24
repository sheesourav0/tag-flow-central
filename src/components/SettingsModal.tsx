
import React from 'react';
import {
  Button,
  VStack,
  HStack,
  Text,
  Badge,
  Box,
} from '@chakra-ui/react';
import { Switch } from '../ui/switch';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '../ui/dialog';
import { useTagStore } from '../store/tagStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { columns, toggleColumn } = useTagStore();

  const visibleCount = columns.filter(col => col.visible).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Column Settings
            <Badge ml={2} colorScheme="blue">
              {visibleCount}/{columns.length} visible
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <Box>
          <VStack align="stretch" spacing={3}>
            <Text fontSize="sm" color="gray.600">
              Configure which columns to display in the tag table.
            </Text>
            
            <Box borderBottom="1px" borderColor="gray.200" pb={2} />
            
            {columns.map((column) => (
              <HStack key={column.key} justify="space-between" p={2} borderRadius="md" _hover={{ bg: 'gray.50' }}>
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" fontWeight="medium">
                    {column.label}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Width: {column.width}px
                  </Text>
                </VStack>
                <Switch
                  checked={column.visible}
                  onCheckedChange={() => toggleColumn(column.key)}
                />
              </HStack>
            ))}
          </VStack>
        </Box>

        <DialogFooter>
          <Button colorScheme="blue" onClick={onClose} size="sm">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
