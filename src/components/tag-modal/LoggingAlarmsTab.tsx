
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
  Tooltip,
} from '@chakra-ui/react';

interface LoggingAlarmsTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

const LoggingAlarmsTab: React.FC<LoggingAlarmsTabProps> = ({ formData, setFormData }) => {
  return (
    <VStack align="stretch" spacing={4}>
      <Tooltip 
        label="Enable automatic logging of this tag's values to the database. Useful for historical analysis and trending."
        hasArrow
        placement="top"
        bg="green.600"
        color="white"
        fontSize="sm"
      >
        <HStack spacing={2}>
          <Text fontSize="sm">Direct Logging</Text>
          <Switch
            isChecked={formData.direct_logging}
            onChange={(e) => setFormData(prev => ({ ...prev, direct_logging: e.target.checked }))}
          />
        </HStack>
      </Tooltip>

      {formData.direct_logging && (
        <Box>
          <Tooltip 
            label="How long to keep logged data in the database. Longer durations require more storage space but provide more historical data."
            hasArrow
            placement="top"
            bg="green.600"
            color="white"
            fontSize="sm"
          >
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={1}>Log Duration</Text>
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
          </Tooltip>
        </Box>
      )}

      <Tooltip 
        label="Enable alarm notifications when this tag's value goes outside normal operating ranges. Helps with proactive monitoring."
        hasArrow
        placement="top"
        bg="orange.600"
        color="white"
        fontSize="sm"
      >
        <HStack spacing={2}>
          <Text fontSize="sm">Enable Alarms</Text>
          <Switch
            isChecked={formData.alarm_enabled}
            onChange={(e) => setFormData(prev => ({ ...prev, alarm_enabled: e.target.checked }))}
          />
        </HStack>
      </Tooltip>

      {formData.alarm_enabled && (
        <VStack align="stretch" spacing={4}>
          <Text fontSize="sm" fontWeight="medium" color="orange.600">
            Alarm Configuration
          </Text>
          
          <HStack spacing={4}>
            <Box flex={1}>
              <Tooltip 
                label="Set the maximum acceptable value. An alarm will trigger when the tag value exceeds this limit."
                hasArrow
                placement="top"
                bg="red.600"
                color="white"
                fontSize="sm"
              >
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>High Limit</Text>
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
              </Tooltip>
            </Box>
            
            <Box flex={1}>
              <Tooltip 
                label="Set the minimum acceptable value. An alarm will trigger when the tag value falls below this limit."
                hasArrow
                placement="top"
                bg="red.600"
                color="white"
                fontSize="sm"
              >
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>Low Limit</Text>
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
              </Tooltip>
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
