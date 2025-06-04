
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
  Tooltip,
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
          <Tooltip 
            label="Enter a unique name for your tag. This will be used to identify the tag throughout the system."
            hasArrow
            placement="top"
            bg="blue.600"
            color="white"
            fontSize="sm"
          >
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={1}>Tag Name</Text>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Motor1_Speed"
                size="sm"
              />
            </Box>
          </Tooltip>
        </Box>
        
        <Box flex={1}>
          <Tooltip 
            label="Select the data type that matches your tag's value format. Bool for true/false, Int for whole numbers, Real for decimals, String for text."
            hasArrow
            placement="top"
            bg="blue.600"
            color="white"
            fontSize="sm"
          >
            <Box>
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
          </Tooltip>
        </Box>
      </HStack>

      <HStack spacing={4}>
        <Box flex={1}>
          <Tooltip 
            label="Specify the memory address or location where this tag's data is stored. Format depends on your system (e.g., %I0.0 for PLC inputs)."
            hasArrow
            placement="top"
            bg="blue.600"
            color="white"
            fontSize="sm"
          >
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={1}>Address</Text>
              <Input
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="%I0.0"
                size="sm"
              />
            </Box>
          </Tooltip>
        </Box>
        
        <Box flex={1}>
          <Tooltip 
            label="Set the default value for this tag when it's first created. This value will be used until the tag receives real data."
            hasArrow
            placement="top"
            bg="blue.600"
            color="white"
            fontSize="sm"
          >
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={1}>Initial Value</Text>
              <Input
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                placeholder="0, true, or any default value"
                size="sm"
              />
            </Box>
          </Tooltip>
        </Box>
      </HStack>

      <Box>
        <Tooltip 
          label="Assign this tag to a group for better organization. Groups help you categorize and manage related tags together."
          hasArrow
          placement="top"
          bg="blue.600"
          color="white"
          fontSize="sm"
        >
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
        </Tooltip>
      </Box>

      <Box>
        <Tooltip 
          label="Add a description or notes about this tag. This helps other users understand the purpose and context of the tag."
          hasArrow
          placement="top"
          bg="blue.600"
          color="white"
          fontSize="sm"
        >
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={1}>Comment</Text>
            <Textarea
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Description of what this tag represents..."
              rows={3}
            />
          </Box>
        </Tooltip>
      </Box>

      <HStack spacing={6}>
        <Tooltip 
          label="Enable this tag to start collecting and processing data. Disabled tags won't update their values."
          hasArrow
          placement="top"
          bg="blue.600"
          color="white"
          fontSize="sm"
        >
          <HStack spacing={2}>
            <Text fontSize="sm">Active</Text>
            <Switch
              isChecked={formData.active}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
            />
          </HStack>
        </Tooltip>
        
        <Tooltip 
          label="Keep the tag's value in memory even after system restart. Important for maintaining state across power cycles."
          hasArrow
          placement="top"
          bg="blue.600"
          color="white"
          fontSize="sm"
        >
          <HStack spacing={2}>
            <Text fontSize="sm">Retain</Text>
            <Switch
              isChecked={formData.retain}
              onChange={(e) => setFormData(prev => ({ ...prev, retain: e.target.checked }))}
            />
          </HStack>
        </Tooltip>
      </HStack>
    </VStack>
  );
};

export default BasicTab;
