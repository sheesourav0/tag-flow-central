
import React from 'react';
import {
  Stack,
  HStack,
  Field,
  NativeSelectRoot,
  NativeSelectField,
  NumberInputRoot,
  NumberInputField,
  Text,
  Separator,
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
    <Stack gap={4}>
      <Text fontSize="md" fontWeight="semibold" color="gray.700">
        Data Logging
      </Text>
      
      <HStack gap={6}>
        <Field.Root>
          <HStack>
            <input
              type="checkbox"
              checked={formData.direct_logging}
              onChange={(e) => handleChange('direct_logging', e.target.checked)}
            />
            <Text fontSize="sm">Enable Direct Logging</Text>
          </HStack>
        </Field.Root>
      </HStack>

      {formData.direct_logging && (
        <Field.Root>
          <Field.Label fontSize="sm">Log Duration</Field.Label>
          <NativeSelectRoot size="sm">
            <NativeSelectField
              value={formData.log_duration}
              onChange={(e) => handleChange('log_duration', e.target.value)}
            >
              {logDurations.map(duration => (
                <option key={duration} value={duration}>{duration}</option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>
        </Field.Root>
      )}

      <Separator />

      <Text fontSize="md" fontWeight="semibold" color="gray.700">
        Alarms
      </Text>

      <HStack gap={6}>
        <Field.Root>
          <HStack>
            <input
              type="checkbox"
              checked={formData.alarm_enabled}
              onChange={(e) => handleChange('alarm_enabled', e.target.checked)}
            />
            <Text fontSize="sm">Enable Alarms</Text>
          </HStack>
        </Field.Root>
      </HStack>

      {formData.alarm_enabled && (
        <HStack gap={4}>
          <Field.Root>
            <Field.Label fontSize="sm">High Limit</Field.Label>
            <NumberInputRoot
              value={formData.alarm_high_limit.toString()}
              onValueChange={(e) => handleChange('alarm_high_limit', parseInt(e.value) || 100)}
              size="sm"
            >
              <NumberInputField />
            </NumberInputRoot>
          </Field.Root>
          
          <Field.Root>
            <Field.Label fontSize="sm">Low Limit</Field.Label>
            <NumberInputRoot
              value={formData.alarm_low_limit.toString()}
              onValueChange={(e) => handleChange('alarm_low_limit', parseInt(e.value) || 0)}
              size="sm"
            >
              <NumberInputField />
            </NumberInputRoot>
          </Field.Root>
        </HStack>
      )}
    </Stack>
  );
};

export default LoggingAlarmsTab;
