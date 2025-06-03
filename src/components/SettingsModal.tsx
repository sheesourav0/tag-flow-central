
import React from 'react';
import {
  Button,
  Stack,
  HStack,
  Text,
  Badge,
  Box,
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
  CloseButton,
} from '@chakra-ui/react';
import { useTagStore } from '../store/tagStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { columns, toggleColumn } = useTagStore();

  const visibleCount = columns.filter(col => col.visible).length;

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Column Settings
            <Badge ml={2} colorPalette="blue">
              {visibleCount}/{columns.length} visible
            </Badge>
          </DialogTitle>
          <DialogCloseTrigger asChild>
            <CloseButton />
          </DialogCloseTrigger>
        </DialogHeader>
        
        <DialogBody>
          <Stack gap={3}>
            <Text fontSize="sm" color="gray.600">
              Configure which columns to display in the tag table.
            </Text>
            
            <Box borderBottom="1px" borderColor="gray.200" pb={2} />
            
            {columns.map((column) => (
              <HStack key={column.key} justify="space-between" p={2} borderRadius="md" _hover={{ bg: 'gray.50' }}>
                <Stack gap={0}>
                  <Text fontSize="sm" fontWeight="medium">
                    {column.label}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Width: {column.width}px
                  </Text>
                </Stack>
                <label>
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => toggleColumn(column.key)}
                  />
                </label>
              </HStack>
            ))}
          </Stack>
        </DialogBody>

        <DialogFooter>
          <Button colorPalette="blue" onClick={onClose} size="sm">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default SettingsModal;
