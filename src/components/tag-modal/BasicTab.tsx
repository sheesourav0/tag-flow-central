
import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Input,
  Select,
  Textarea,
  Switch,
} from '@chakra-ui/react';
import { useGroups } from '../../hooks/useGroups';

interface BasicTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

const BasicTab: React.FC<BasicTabProps> = ({ formData, setFormData }) => {
  const { groups } = useGroups();

  return (
    <VStack align="stretch" spacing={4}>
      <HStack spacing={4}>
        <Box flex={2}>
          <Text fontSize="sm" fontWeight="medium" mb={1}>Tag Name</Text>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            size="sm"
          />
        </Box>
        
        <Box flex={1}>
          <Text fontSize="sm" fontWeight="medium" mb={1}>Data Type</Text>
          <Select
            value={formData.data_type}
            onChange={(e) => setFormData(prev => ({ ...prev, data_type: e.target.value }))}
            size="sm"
          >
            <option value="Bool">Bool</option>
            <option value="Byte">Byte</option>
            <option value="Word">Word</option>
            <option value="DWord">DWord</option>
            <option value="Int">Int</option>
            <option value="DInt">DInt</option>
            <option value="Real">Real</option>
            <option value="String">String</option>
          </Select>
        </Box>
      </HStack>

      <HStack spacing={4}>
        <Box flex={1}>
          <Text fontSize="sm" fontWeight="medium" mb={1}>Address</Text>
          <Input
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="%I0.0"
            size="sm"
          />
        </Box>
        
        <Box flex={1}>
          <Text fontSize="sm" fontWeight="medium" mb={1}>Initial Value</Text>
          <Input
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            size="sm"
          />
        </Box>
      </HStack>

      <Box>
        <Text fontSize="sm" fontWeight="medium" mb={1}>Group</Text>
        <Select
          value={formData.group_name}
          onChange={(e) => setFormData(prev => ({ ...prev, group_name: e.target.value }))}
          size="sm"
        >
          {groups.map(group => (
            <option key={group.id} value={group.name}>
              {group.name}
            </option>
          ))}
        </Select>
      </Box>

      <Box>
        <Text fontSize="sm" fontWeight="medium" mb={1}>Comment</Text>
        <Textarea
          value={formData.comment}
          onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
          rows={3}
        />
      </Box>

      <HStack spacing={6}>
        <HStack spacing={2}>
          <Text fontSize="sm">Active</Text>
          <Switch
            isChecked={formData.active}
            onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
          />
        </HStack>
        
        <HStack spacing={2}>
          <Text fontSize="sm">Retain</Text>
          <Switch
            isChecked={formData.retain}
            onChange={(e) => setFormData(prev => ({ ...prev, retain: e.target.checked }))}
          />
        </HStack>
      </HStack>
    </VStack>
  );
};

export default BasicTab;
