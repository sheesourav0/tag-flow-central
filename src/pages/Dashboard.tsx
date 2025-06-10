
import React, { useState } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Button,
  Grid,
  GridItem,
  Text,
  Badge,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { MdAdd, MdStorage, MdTrendingUp, MdError } from 'react-icons/md';
import { useDataSources } from '../hooks/useDataSources';
import DataSourceModal from '../components/DataSourceModal';
import DataSourceCard from '../components/DataSourceCard';

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { dataSources, isLoading } = useDataSources();
  const [editingDataSource, setEditingDataSource] = useState(null);

  const handleEdit = (dataSource: any) => {
    setEditingDataSource(dataSource);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingDataSource(null);
    setIsModalOpen(false);
  };

  const stats = [
    {
      label: 'Total Data Sources',
      value: dataSources?.length || 0,
      icon: MdStorage,
      color: 'blue',
    },
    {
      label: 'Active Connections',
      value: dataSources?.filter(ds => ds.status === 'active').length || 0,
      icon: MdTrendingUp,
      color: 'green',
    },
    {
      label: 'Failed Connections',
      value: dataSources?.filter(ds => ds.status === 'error').length || 0,
      icon: MdError,
      color: 'red',
    },
  ];

  return (
    <Container maxW="7xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <VStack align="start" gap={2}>
          <Heading size="lg" color="gray.800">
            Data Source Manager
          </Heading>
          <Text color="gray.600">
            Manage your data connections and monitor their status
          </Text>
        </VStack>
        <Button
          onClick={() => setIsModalOpen(true)}
          size="lg"
        >
          <MdAdd size={20} style={{ marginRight: '8px' }} />
          Add Data Source
        </Button>
      </Flex>

      <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={8}>
        {stats.map((stat, index) => (
          <GridItem key={index}>
            <Box
              p={6}
              bg="white"
              borderRadius="lg"
              shadow="sm"
              border="1px"
              borderColor="gray.200"
            >
              <HStack gap={4}>
                <Box
                  p={3}
                  bg={`${stat.color}.100`}
                  borderRadius="lg"
                >
                  <stat.icon color={`${stat.color}.500`} size={24} />
                </Box>
                <VStack align="start" gap={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    {stat.value}
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    {stat.label}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </GridItem>
        ))}
      </Grid>

      <Box>
        <Heading size="md" mb={6} color="gray.800">
          Data Sources
        </Heading>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : dataSources && dataSources.length > 0 ? (
          <Grid templateColumns="repeat(auto-fill, minmax(350px, 1fr))" gap={6}>
            {dataSources.map((dataSource) => (
              <DataSourceCard
                key={dataSource.id}
                dataSource={dataSource}
                onEdit={handleEdit}
              />
            ))}
          </Grid>
        ) : (
          <Box
            textAlign="center"
            py={12}
            bg="white"
            borderRadius="lg"
            border="1px"
            borderColor="gray.200"
          >
            <MdStorage size={48} color="gray" style={{ margin: '0 auto 16px' }} />
            <Heading size="md" color="gray.600" mb={2}>
              No data sources found
            </Heading>
            <Text color="gray.500" mb={4}>
              Get started by creating your first data source connection
            </Text>
            <Button onClick={() => setIsModalOpen(true)}>
              Create Data Source
            </Button>
          </Box>
        )}
      </Box>

      <DataSourceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        dataSource={editingDataSource}
      />
    </Container>
  );
};

export default Dashboard;
