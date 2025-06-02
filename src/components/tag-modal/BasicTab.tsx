
import React from 'react';
import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Switch,
  Text,
} from '@chakra-ui/react';
import { useGroups } from '../../hooks/useGroups';

interface BasicTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

const BasicTab: React.FC<BasicTabProps> = ({ formData, setFormData }) => {
  const { groups } = useGroups();

  const dataTypes = ['Bool', 'Int16', 'Int32', 'Real', 'String', 'DateTime'];

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack spacing={4}>
        <FormControl isRequired>
          <FormLabel fontSize="sm">Tag Name</FormLabel>
          <Input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter tag name"
            size="sm"
          />
        </FormControl>
        
        <FormControl isRequired>
          <FormLabel fontSize="sm">Data Type</FormLabel>
          <Select
            value={formData.data_type}
            onChange={(e) => handleChange('data_type', e.target.value)}
            size="sm"
          >
            {dataTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
        </FormControl>
      </HStack>

      <HStack spacing={4}>
        <FormControl isRequired>
          <FormLabel fontSize="sm">Address</FormLabel>
          <Input
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Tag address"
            size="sm"
          />
        </FormControl>
        
        <FormControl>
          <FormLabel fontSize="sm">Initial Value</FormLabel>
          <Input
            value={formData.value}
            onChange={(e) => handleChange('value', e.target.value)}
            placeholder="Initial value"
            size="sm"
          />
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel fontSize="sm">Group</FormLabel>
        <Select
          value={formData.group_name}
          onChange={(e) => handleChange('group_name', e.target.value)}
          size="sm"
        >
          {groups.map(group => (
            <option key={group.id} value={group.name}>{group.name}</option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm">Comment</FormLabel>
        <Textarea
          value={formData.comment}
          onChange={(e) => handleChange('comment', e.target.value)}
          placeholder="Optional description"
          size="sm"
          rows={3}
        />
      </FormControl>

      <HStack spacing={6}>
        <FormControl display="flex" alignItems="center">
          <FormLabel fontSize="sm" mb="0">Active</FormLabel>
          <Switch
            isChecked={formData.active}
            onChange={(e) => handleChange('active', e.target.checked)}
            size="sm"
          />
        </FormControl>
        
        <FormControl display="flex" alignItems="center">
          <FormLabel fontSize="sm" mb="0">Retain Value</FormLabel>
          <Switch
            isChecked={formData.retain}
            onChange={(e) => handleChange('retain', e.target.checked)}
            size="sm"
          />
        </FormControl>
      </HStack>
    </VStack>
  );
};

export default BasicTab;
