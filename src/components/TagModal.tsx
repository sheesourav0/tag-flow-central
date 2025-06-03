
import React, { useState, useEffect } from 'react';
import {
  Button,
  Stack,
  Badge,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
  CloseButton,
} from '@chakra-ui/react';
import { DatabaseTag } from '../services/tagService';
import { useTags } from '../hooks/useTags';
import { useGroups } from '../hooks/useGroups';
import BasicTab from './tag-modal/BasicTab';
import DataSourceTab from './tag-modal/DataSourceTab';
import LoggingAlarmsTab from './tag-modal/LoggingAlarmsTab';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag?: DatabaseTag | null;
}

const TagModal: React.FC<TagModalProps> = ({ isOpen, onClose, tag }) => {
  const { createTag, updateTag } = useTags();
  const { groups } = useGroups();
  const [activeTab, setActiveTab] = useState('basic');
  
  const [formData, setFormData] = useState({
    name: '',
    data_type: 'Bool' as string,
    address: '',
    value: '',
    comment: '',
    group_name: '',
    active: true,
    retain: false,
    data_source: 'Internal' as string,
    mqtt_path: '',
    opc_node_id: '',
    modbus_register: 0,
    update_interval: '1s',
    multiplier: 1,
    device_id: '',
    direct_logging: false,
    log_duration: '24h',
    alarm_enabled: false,
    alarm_high_limit: 100,
    alarm_low_limit: 0,
    connection_status: 'Unknown' as string,
  });

  useEffect(() => {
    if (tag) {
      setFormData({
        name: tag.name,
        data_type: tag.data_type,
        address: tag.address,
        value: tag.value || '',
        comment: tag.comment || '',
        group_name: tag.group_name,
        active: tag.active || true,
        retain: tag.retain || false,
        data_source: tag.data_source,
        mqtt_path: tag.mqtt_path || '',
        opc_node_id: tag.opc_node_id || '',
        modbus_register: tag.modbus_register || 0,
        update_interval: tag.update_interval || '1s',
        multiplier: tag.multiplier || 1,
        device_id: tag.device_id || '',
        direct_logging: tag.direct_logging || false,
        log_duration: tag.log_duration || '24h',
        alarm_enabled: tag.alarm_enabled || false,
        alarm_high_limit: tag.alarm_high_limit || 100,
        alarm_low_limit: tag.alarm_low_limit || 0,
        connection_status: tag.connection_status || 'Unknown',
      });
    } else {
      setFormData({
        name: '',
        data_type: 'Bool',
        address: '',
        value: '',
        comment: '',
        group_name: groups[0]?.name || '',
        active: true,
        retain: false,
        data_source: 'Internal',
        mqtt_path: '',
        opc_node_id: '',
        modbus_register: 0,
        update_interval: '1s',
        multiplier: 1,
        device_id: '',
        direct_logging: false,
        log_duration: '24h',
        alarm_enabled: false,
        alarm_high_limit: 100,
        alarm_low_limit: 0,
        connection_status: 'Unknown',
      });
    }
  }, [tag, isOpen, groups]);

  const handleSave = () => {
    if (tag) {
      updateTag({ id: tag.id, updates: formData });
    } else {
      createTag(formData);
    }
    onClose();
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="2xl">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {tag ? 'Edit Tag' : 'Add New Tag'}
            {tag && (
              <Badge ml={2} colorPalette="blue">
                {tag.connection_status}
              </Badge>
            )}
          </DialogTitle>
          <DialogCloseTrigger asChild>
            <CloseButton />
          </DialogCloseTrigger>
        </DialogHeader>
        
        <DialogBody>
          {/* Tab Navigation */}
          <Stack gap={4}>
            <nav>
              <Stack direction="row" gap={2} borderBottom="1px" borderColor="gray.200">
                <Button
                  variant={activeTab === 'basic' ? 'solid' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('basic')}
                >
                  Basic
                </Button>
                <Button
                  variant={activeTab === 'datasource' ? 'solid' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('datasource')}
                >
                  Data Source
                </Button>
                <Button
                  variant={activeTab === 'logging' ? 'solid' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('logging')}
                >
                  Logging & Alarms
                </Button>
              </Stack>
            </nav>
            
            {/* Tab Content */}
            {activeTab === 'basic' && (
              <BasicTab formData={formData} setFormData={setFormData} />
            )}
            
            {activeTab === 'datasource' && (
              <DataSourceTab formData={formData} setFormData={setFormData} />
            )}
            
            {activeTab === 'logging' && (
              <LoggingAlarmsTab formData={formData} setFormData={setFormData} />
            )}
          </Stack>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" mr={3} onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button colorPalette="blue" onClick={handleSave} size="sm">
            {tag ? 'Update Tag' : 'Create Tag'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default TagModal;
