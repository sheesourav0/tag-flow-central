
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Switch,
  Divider,
  Badge,
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
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Column Settings
          <Badge ml={2} colorScheme="blue">
            {visibleCount}/{columns.length} visible
          </Badge>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={3} align="stretch">
            <Text fontSize="sm" color="gray.600">
              Configure which columns to display in the tag table.
            </Text>
            
            <Divider />
            
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
                  isChecked={column.visible}
                  onChange={() => toggleColumn(column.key)}
                  colorScheme="brand"
                />
              </HStack>
            ))}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose} size="sm">
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SettingsModal;
