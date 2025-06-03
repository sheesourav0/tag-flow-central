
import React from 'react';
import {
  Stack,
  HStack,
  Field,
  Input,
  NativeSelectRoot,
  NativeSelectField,
  Textarea,
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
    <Stack gap={4}>
      <HStack gap={4}>
        <Field.Root required>
          <Field.Label fontSize="sm">Tag Name</Field.Label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter tag name"
            size="sm"
          />
        </Field.Root>
        
        <Field.Root required>
          <Field.Label fontSize="sm">Data Type</Field.Label>
          <NativeSelectRoot size="sm">
            <NativeSelectField
              value={formData.data_type}
              onChange={(e) => handleChange('data_type', e.target.value)}
            >
              {dataTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>
        </Field.Root>
      </HStack>

      <HStack gap={4}>
        <Field.Root required>
          <Field.Label fontSize="sm">Address</Field.Label>
          <Input
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Tag address"
            size="sm"
          />
        </Field.Root>
        
        <Field.Root>
          <Field.Label fontSize="sm">Initial Value</Field.Label>
          <Input
            value={formData.value}
            onChange={(e) => handleChange('value', e.target.value)}
            placeholder="Initial value"
            size="sm"
          />
        </Field.Root>
      </HStack>

      <Field.Root>
        <Field.Label fontSize="sm">Group</Field.Label>
        <NativeSelectRoot size="sm">
          <NativeSelectField
            value={formData.group_name}
            onChange={(e) => handleChange('group_name', e.target.value)}
          >
            {groups.map(group => (
              <option key={group.id} value={group.name}>{group.name}</option>
            ))}
          </NativeSelectField>
        </NativeSelectRoot>
      </Field.Root>

      <Field.Root>
        <Field.Label fontSize="sm">Comment</Field.Label>
        <Textarea
          value={formData.comment}
          onChange={(e) => handleChange('comment', e.target.value)}
          placeholder="Optional description"
          size="sm"
          rows={3}
        />
      </Field.Root>

      <HStack gap={6}>
        <Field.Root>
          <HStack>
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => handleChange('active', e.target.checked)}
            />
            <Text fontSize="sm">Active</Text>
          </HStack>
        </Field.Root>
        
        <Field.Root>
          <HStack>
            <input
              type="checkbox"
              checked={formData.retain}
              onChange={(e) => handleChange('retain', e.target.checked)}
            />
            <Text fontSize="sm">Retain Value</Text>
          </HStack>
        </Field.Root>
      </HStack>
    </Stack>
  );
};

export default BasicTab;
