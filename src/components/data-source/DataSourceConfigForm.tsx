
import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  FormControl,
  FormLabel,
  Textarea,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { DataSource, DataSourceConfig } from '../../services/dataSourceService';
import ClickableTooltip from '../ui/clickable-tooltip';

interface DataSourceConfigFormProps {
  dataSource: Partial<DataSource>;
  config: DataSourceConfig;
  onConfigChange: (config: DataSourceConfig) => void;
}

const DataSourceConfigForm: React.FC<DataSourceConfigFormProps> = ({
  dataSource,
  config,
  onConfigChange
}) => {
  const updateConfig = (section: keyof DataSourceConfig, updates: any) => {
    onConfigChange({
      ...config,
      [section]: {
        ...config[section],
        ...updates
      }
    });
  };

  const renderHTTPSConfig = () => (
    <VStack align="stretch" spacing={4}>
      <HStack spacing={4}>
        <FormControl flex={1}>
          <HStack spacing={2} mb={1}>
            <FormLabel fontSize="sm" fontWeight="medium" mb={0}>Method</FormLabel>
            <ClickableTooltip content="HTTP method for the API request" />
          </HStack>
          <Select
            value={config.https?.method || 'GET'}
            onChange={(e) => updateConfig('https', { method: e.target.value })}
            size="sm"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </Select>
        </FormControl>

        <FormControl flex={1}>
          <HStack spacing={2} mb={1}>
            <FormLabel fontSize="sm" fontWeight="medium" mb={0}>Polling Interval (seconds)</FormLabel>
            <ClickableTooltip content="How often to fetch data from the API" />
          </HStack>
          <NumberInput
            value={config.https?.polling_interval || 30}
            onChange={(_, value) => updateConfig('https', { polling_interval: value })}
            size="sm"
            min={1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </HStack>

      <FormControl>
        <HStack spacing={2} mb={1}>
          <FormLabel fontSize="sm" fontWeight="medium" mb={0}>Authentication Type</FormLabel>
          <ClickableTooltip content="Type of authentication required by the API" />
        </HStack>
        <Select
          value={config.https?.authType || 'none'}
          onChange={(e) => updateConfig('https', { authType: e.target.value })}
          size="sm"
        >
          <option value="none">None</option>
          <option value="bearer">Bearer Token</option>
          <option value="apikey">API Key</option>
          <option value="basic">Basic Auth</option>
        </Select>
      </FormControl>

      {config.https?.authType !== 'none' && (
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">Auth Token/Key</FormLabel>
          <Input
            type="password"
            value={config.https?.authToken || ''}
            onChange={(e) => updateConfig('https', { authToken: e.target.value })}
            placeholder="Enter your token or API key"
            size="sm"
          />
        </FormControl>
      )}

      <FormControl>
        <FormLabel fontSize="sm" fontWeight="medium">Custom Headers (JSON)</FormLabel>
        <Textarea
          value={JSON.stringify(config.https?.headers || {}, null, 2)}
          onChange={(e) => {
            try {
              const headers = JSON.parse(e.target.value);
              updateConfig('https', { headers });
            } catch (error) {
              // Invalid JSON, ignore
            }
          }}
          placeholder='{"Content-Type": "application/json"}'
          size="sm"
          rows={3}
        />
      </FormControl>
    </VStack>
  );

  const renderMQTTConfig = () => (
    <VStack align="stretch" spacing={4}>
      <FormControl>
        <HStack spacing={2} mb={1}>
          <FormLabel fontSize="sm" fontWeight="medium" mb={0}>Topic</FormLabel>
          <ClickableTooltip content="MQTT topic to subscribe to (e.g., sensors/device1/data)" />
        </HStack>
        <Input
          value={config.mqtt?.topic || ''}
          onChange={(e) => updateConfig('mqtt', { topic: e.target.value })}
          placeholder="sensors/device1/data"
          size="sm"
        />
      </FormControl>

      <HStack spacing={4}>
        <FormControl flex={1}>
          <FormLabel fontSize="sm" fontWeight="medium">Client ID</FormLabel>
          <Input
            value={config.mqtt?.clientId || ''}
            onChange={(e) => updateConfig('mqtt', { clientId: e.target.value })}
            placeholder="client_123"
            size="sm"
          />
        </FormControl>

        <FormControl flex={1}>
          <HStack spacing={2} mb={1}>
            <FormLabel fontSize="sm" fontWeight="medium" mb={0}>QoS Level</FormLabel>
            <ClickableTooltip content="Quality of Service level (0=At most once, 1=At least once, 2=Exactly once)" />
          </HStack>
          <Select
            value={config.mqtt?.qos || 0}
            onChange={(e) => updateConfig('mqtt', { qos: parseInt(e.target.value) })}
            size="sm"
          >
            <option value={0}>0 - At most once</option>
            <option value={1}>1 - At least once</option>
            <option value={2}>2 - Exactly once</option>
          </Select>
        </FormControl>
      </HStack>

      <HStack spacing={4}>
        <FormControl flex={1}>
          <FormLabel fontSize="sm" fontWeight="medium">Username</FormLabel>
          <Input
            value={config.mqtt?.username || ''}
            onChange={(e) => updateConfig('mqtt', { username: e.target.value })}
            placeholder="Optional"
            size="sm"
          />
        </FormControl>

        <FormControl flex={1}>
          <FormLabel fontSize="sm" fontWeight="medium">Password</FormLabel>
          <Input
            type="password"
            value={config.mqtt?.password || ''}
            onChange={(e) => updateConfig('mqtt', { password: e.target.value })}
            placeholder="Optional"
            size="sm"
          />
        </FormControl>
      </HStack>
    </VStack>
  );

  const renderOPCUAConfig = () => (
    <VStack align="stretch" spacing={4}>
      <HStack spacing={4}>
        <FormControl flex={1}>
          <FormLabel fontSize="sm" fontWeight="medium">Security Mode</FormLabel>
          <Select
            value={config.opcua?.securityMode || 'None'}
            onChange={(e) => updateConfig('opcua', { securityMode: e.target.value })}
            size="sm"
          >
            <option value="None">None</option>
            <option value="Sign">Sign</option>
            <option value="SignAndEncrypt">Sign & Encrypt</option>
          </Select>
        </FormControl>

        <FormControl flex={1}>
          <FormLabel fontSize="sm" fontWeight="medium">Security Policy</FormLabel>
          <Select
            value={config.opcua?.securityPolicy || 'None'}
            onChange={(e) => updateConfig('opcua', { securityPolicy: e.target.value })}
            size="sm"
          >
            <option value="None">None</option>
            <option value="Basic128Rsa15">Basic128Rsa15</option>
            <option value="Basic256">Basic256</option>
          </Select>
        </FormControl>
      </HStack>

      <HStack spacing={4}>
        <FormControl flex={1}>
          <FormLabel fontSize="sm" fontWeight="medium">Username</FormLabel>
          <Input
            value={config.opcua?.username || ''}
            onChange={(e) => updateConfig('opcua', { username: e.target.value })}
            placeholder="Optional"
            size="sm"
          />
        </FormControl>

        <FormControl flex={1}>
          <FormLabel fontSize="sm" fontWeight="medium">Password</FormLabel>
          <Input
            type="password"
            value={config.opcua?.password || ''}
            onChange={(e) => updateConfig('opcua', { password: e.target.value })}
            placeholder="Optional"
            size="sm"
          />
        </FormControl>
      </HStack>
    </VStack>
  );

  const renderModbusConfig = () => (
    <VStack align="stretch" spacing={4}>
      <HStack spacing={4}>
        <FormControl flex={1}>
          <HStack spacing={2} mb={1}>
            <FormLabel fontSize="sm" fontWeight="medium" mb={0}>Unit ID</FormLabel>
            <ClickableTooltip content="Modbus device unit identifier (1-247)" />
          </HStack>
          <NumberInput
            value={config.modbus?.unitId || 1}
            onChange={(_, value) => updateConfig('modbus', { unitId: value })}
            size="sm"
            min={1}
            max={247}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl flex={1}>
          <FormLabel fontSize="sm" fontWeight="medium">Protocol</FormLabel>
          <Select
            value={config.modbus?.protocol || 'TCP'}
            onChange={(e) => updateConfig('modbus', { protocol: e.target.value })}
            size="sm"
          >
            <option value="TCP">TCP</option>
            <option value="RTU">RTU</option>
          </Select>
        </FormControl>
      </HStack>

      <FormControl>
        <HStack spacing={2} mb={1}>
          <FormLabel fontSize="sm" fontWeight="medium" mb={0}>Timeout (ms)</FormLabel>
          <ClickableTooltip content="Connection timeout in milliseconds" />
        </HStack>
        <NumberInput
          value={config.modbus?.timeout || 5000}
          onChange={(_, value) => updateConfig('modbus', { timeout: value })}
          size="sm"
          min={1000}
          max={30000}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
    </VStack>
  );

  const renderS7Config = () => (
    <VStack align="stretch" spacing={4}>
      <HStack spacing={4}>
        <FormControl flex={1}>
          <HStack spacing={2} mb={1}>
            <FormLabel fontSize="sm" fontWeight="medium" mb={0}>Rack</FormLabel>
            <ClickableTooltip content="S7 PLC rack number (usually 0)" />
          </HStack>
          <NumberInput
            value={config.s7?.rack || 0}
            onChange={(_, value) => updateConfig('s7', { rack: value })}
            size="sm"
            min={0}
            max={7}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl flex={1}>
          <HStack spacing={2} mb={1}>
            <FormLabel fontSize="sm" fontWeight="medium" mb={0}>Slot</FormLabel>
            <ClickableTooltip content="S7 PLC slot number (usually 2)" />
          </HStack>
          <NumberInput
            value={config.s7?.slot || 2}
            onChange={(_, value) => updateConfig('s7', { slot: value })}
            size="sm"
            min={0}
            max={31}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel fontSize="sm" fontWeight="medium">Connection Type</FormLabel>
        <Select
          value={config.s7?.connectionType || 'PG'}
          onChange={(e) => updateConfig('s7', { connectionType: e.target.value })}
          size="sm"
        >
          <option value="PG">PG</option>
          <option value="OP">OP</option>
          <option value="S7Basic">S7 Basic</option>
        </Select>
      </FormControl>
    </VStack>
  );

  const renderConfigSection = () => {
    switch (dataSource.type) {
      case 'HTTPS':
        return renderHTTPSConfig();
      case 'MQTT':
        return renderMQTTConfig();
      case 'OPC UA':
        return renderOPCUAConfig();
      case 'Modbus':
        return renderModbusConfig();
      case 'S7':
        return renderS7Config();
      default:
        return (
          <Text fontSize="sm" color="gray.600">
            Select a data source type to configure connection settings.
          </Text>
        );
    }
  };

  if (!dataSource.type) {
    return null;
  }

  return (
    <Accordion allowToggle defaultIndex={0}>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Text fontSize="sm" fontWeight="medium">
                {dataSource.type} Configuration
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          {renderConfigSection()}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default DataSourceConfigForm;
