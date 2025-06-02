
import React from 'react';
import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Select,
  Switch,
  NumberInput,
  NumberInputField,
  Text,
  Divider,
} from '@chakra-ui/react';

interface LoggingAlarmsTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

const LoggingAlarmsTab: React.FC<LoggingAlarmsTabProps> = ({ formData, setFormData }) => {
  const logDurations = ['1h', '24h', '7d', '30d', '1y'];

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="md" fontWeight="semibold" color="gray.700">
        Data Logging
      </Text>
      
      <HStack spacing={6}>
        <FormControl display="flex" alignItems="center">
          <FormLabel fontSize="sm" mb="0">Enable Direct Logging</FormLabel>
          <Switch
            isChecked={formData.direct_logging}
            onChange={(e) => handleChange('direct_logging', e.target.checked)}
            size="sm"
          />
        </FormControl>
      </HStack>

      {formData.direct_logging && (
        <FormControl>
          <FormLabel fontSize="sm">Log Duration</FormLabel>
          <Select
            value={formData.log_duration}
            onChange={(e) => handleChange('log_duration', e.target.value)}
            size="sm"
          >
            {logDurations.map(duration => (
              <option key={duration} value={duration}>{duration}</option>
            ))}
          </Select>
        </FormControl>
      )}

      <Divider />

      <Text fontSize="md" fontWeight="semibold" color="gray.700">
        Alarms
      </Text>

      <HStack spacing={6}>
        <FormControl display="flex" alignItems="center">
          <FormLabel fontSize="sm" mb="0">Enable Alarms</FormLabel>
          <Switch
            isChecked={formData.alarm_enabled}
            onChange={(e) => handleChange('alarm_enabled', e.target.checked)}
            size="sm"
          />
        </FormControl>
      </HStack>

      {formData.alarm_enabled && (
        <HStack spacing={4}>
          <FormControl>
            <FormLabel fontSize="sm">High Limit</FormLabel>
            <NumberInput
              value={formData.alarm_high_limit}
              onChange={(_, num) => handleChange('alarm_high_limit', num || 100)}
              size="sm"
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
          
          <FormControl>
            <FormLabel fontSize="sm">Low Limit</FormLabel>
            <NumberInput
              value={formData.alarm_low_limit}
              onChange={(_, num) => handleChange('alarm_low_limit', num || 0)}
              size="sm"
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
        </HStack>
      )}
    </VStack>
  );
};

export default LoggingAlarmsTab;
