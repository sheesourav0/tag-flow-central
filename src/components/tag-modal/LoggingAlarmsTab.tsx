
import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Select,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import ClickableTooltip from '../ui/clickable-tooltip';

interface LoggingAlarmsTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

const LoggingAlarmsTab: React.FC<LoggingAlarmsTabProps> = ({ formData, setFormData }) => {
  return (
    <VStack align="stretch" spacing={4}>
      <HStack spacing={2}>
        <Text fontSize="sm">Direct Logging</Text>
        <ClickableTooltip 
          content="Enable automatic logging of this tag's values to the database. Useful for historical analysis, trending, and compliance reporting. Logged data can be viewed in charts and exported for analysis."
        />
        <Switch
          isChecked={formData.direct_logging}
          onChange={(e) => setFormData(prev => ({ ...prev, direct_logging: e.target.checked }))}
        />
      </HStack>

      {formData.direct_logging && (
        <Box>
          <HStack spacing={2} mb={1}>
            <Text fontSize="sm" fontWeight="medium">Log Duration</Text>
            <ClickableTooltip 
              content="How long to keep logged data in the database. Longer durations require more storage space but provide more historical data. Consider your storage capacity and compliance requirements."
            />
          </HStack>
          <Select
            value={formData.log_duration}
            onChange={(e) => setFormData(prev => ({ ...prev, log_duration: e.target.value }))}
            size="sm"
          >
            <option value="1h">1 hour</option>
            <option value="6h">6 hours</option>
            <option value="12h">12 hours</option>
            <option value="24h">24 hours</option>
            <option value="7d">7 days</option>
            <option value="30d">30 days</option>
          </Select>
        </Box>
      )}

      <HStack spacing={2}>
        <Text fontSize="sm">Enable Alarms</Text>
        <ClickableTooltip 
          content="Enable alarm notifications when this tag's value goes outside normal operating ranges. Helps with proactive monitoring and prevents equipment damage or production issues."
        />
        <Switch
          isChecked={formData.alarm_enabled}
          onChange={(e) => setFormData(prev => ({ ...prev, alarm_enabled: e.target.checked }))}
        />
      </HStack>

      {formData.alarm_enabled && (
        <VStack align="stretch" spacing={4}>
          <Text fontSize="sm" fontWeight="medium" color="orange.600">
            Alarm Configuration
          </Text>
          
          <HStack spacing={4}>
            <Box flex={1}>
              <HStack spacing={2} mb={1}>
                <Text fontSize="sm" fontWeight="medium">High Limit</Text>
                <ClickableTooltip 
                  content="Set the maximum acceptable value. An alarm will trigger when the tag value exceeds this limit. Consider safety margins and normal operating conditions."
                />
              </HStack>
              <NumberInput
                value={formData.alarm_high_limit}
                onChange={(valueString, valueNumber) => 
                  setFormData(prev => ({ ...prev, alarm_high_limit: valueNumber || 100 }))
                }
                size="sm"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
            
            <Box flex={1}>
              <HStack spacing={2} mb={1}>
                <Text fontSize="sm" fontWeight="medium">Low Limit</Text>
                <ClickableTooltip 
                  content="Set the minimum acceptable value. An alarm will trigger when the tag value falls below this limit. Useful for detecting equipment failures or process deviations."
                />
              </HStack>
              <NumberInput
                value={formData.alarm_low_limit}
                onChange={(valueString, valueNumber) => 
                  setFormData(prev => ({ ...prev, alarm_low_limit: valueNumber || 0 }))
                }
                size="sm"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
          </HStack>

          <Box p={3} bg="orange.50" borderRadius="md" borderLeft="4px" borderColor="orange.400">
            <Text fontSize="xs" color="orange.700">
              Alarms will trigger when the tag value exceeds the high limit ({formData.alarm_high_limit}) 
              or falls below the low limit ({formData.alarm_low_limit}).
            </Text>
          </Box>
        </VStack>
      )}
    </VStack>
  );
};

export default LoggingAlarmsTab;
