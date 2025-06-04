
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
import ClickableTooltip from '../ui/clickable-tooltip';

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
          <HStack spacing={2} mb={1}>
            <Text fontSize="sm" fontWeight="medium">Tag Name</Text>
            <ClickableTooltip 
              content="Enter a unique name for your tag. This will be used to identify the tag throughout the system. Use descriptive names like 'Motor1_Speed' or 'Tank_Temperature'."
            />
          </HStack>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Motor1_Speed"
            size="sm"
          />
        </Box>
        
        <Box flex={1}>
          <HStack spacing={2} mb={1}>
            <Text fontSize="sm" fontWeight="medium">Data Type</Text>
            <ClickableTooltip 
              content={
                <div>
                  <p className="font-medium mb-2">Select the data type that matches your tag's value:</p>
                  <ul className="text-xs space-y-1">
                    <li>• <strong>Bool:</strong> True/False values</li>
                    <li>• <strong>Byte:</strong> 0-255 (8-bit)</li>
                    <li>• <strong>Word:</strong> 0-65535 (16-bit)</li>
                    <li>• <strong>DWord:</strong> 0-4294967295 (32-bit)</li>
                    <li>• <strong>Int:</strong> Whole numbers (-32768 to 32767)</li>
                    <li>• <strong>DInt:</strong> Large whole numbers</li>
                    <li>• <strong>Real:</strong> Decimal numbers</li>
                    <li>• <strong>String:</strong> Text values</li>
                  </ul>
                </div>
              }
            />
          </HStack>
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
          <HStack spacing={2} mb={1}>
            <Text fontSize="sm" fontWeight="medium">Address</Text>
            <ClickableTooltip 
              content="Specify the memory address or location where this tag's data is stored. Format depends on your system (e.g., %I0.0 for PLC inputs, %M0.0 for memory bits, %DB1.DBX0.0 for data blocks)."
            />
          </HStack>
          <Input
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="%I0.0"
            size="sm"
          />
        </Box>
        
        <Box flex={1}>
          <HStack spacing={2} mb={1}>
            <Text fontSize="sm" fontWeight="medium">Initial Value</Text>
            <ClickableTooltip 
              content="Set the default value for this tag when it's first created. This value will be used until the tag receives real data from its data source."
            />
          </HStack>
          <Input
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            placeholder="0, true, or any default value"
            size="sm"
          />
        </Box>
      </HStack>

      <Box>
        <HStack spacing={2} mb={1}>
          <Text fontSize="sm" fontWeight="medium">Group</Text>
          <ClickableTooltip 
            content="Assign this tag to a group for better organization. Groups help you categorize and manage related tags together, making it easier to find and maintain your tags."
          />
        </HStack>
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
        <HStack spacing={2} mb={1}>
          <Text fontSize="sm" fontWeight="medium">Comment</Text>
          <ClickableTooltip 
            content="Add a description or notes about this tag. This helps other users understand the purpose and context of the tag. Include information about what the tag represents, its normal operating range, or any special considerations."
          />
        </HStack>
        <Textarea
          value={formData.comment}
          onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
          placeholder="Description of what this tag represents..."
          rows={3}
        />
      </Box>

      <HStack spacing={6}>
        <HStack spacing={2}>
          <Text fontSize="sm">Active</Text>
          <ClickableTooltip 
            content="Enable this tag to start collecting and processing data. Disabled tags won't update their values and will appear grayed out in the interface."
          />
          <Switch
            isChecked={formData.active}
            onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
          />
        </HStack>
        
        <HStack spacing={2}>
          <Text fontSize="sm">Retain</Text>
          <ClickableTooltip 
            content="Keep the tag's value in memory even after system restart. Important for maintaining state across power cycles. Disable for temporary or calculated values."
          />
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
