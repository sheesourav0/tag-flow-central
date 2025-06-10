
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createToaster } from '@chakra-ui/react';
import { dataSourceService } from '../services/dataSourceService';
import { DataSource } from '../types/dataSource';

const toaster = createToaster({
  placement: 'top',
});

export const useDataSources = () => {
  const queryClient = useQueryClient();

  const {
    data: dataSources,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dataSources'],
    queryFn: dataSourceService.fetchDataSources,
  });

  const createMutation = useMutation({
    mutationFn: dataSourceService.createDataSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataSources'] });
      toaster.create({
        title: 'Data source created successfully',
        status: 'success',
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: 'Failed to create data source',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<DataSource> }) =>
      dataSourceService.updateDataSource(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataSources'] });
      toaster.create({
        title: 'Data source updated successfully',
        status: 'success',
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: 'Failed to update data source',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: dataSourceService.deleteDataSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataSources'] });
      toaster.create({
        title: 'Data source deleted successfully',
        status: 'success',
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: 'Failed to delete data source',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    },
  });

  return {
    dataSources,
    isLoading,
    error,
    refetch,
    createDataSource: createMutation.mutate,
    updateDataSource: (id: string, updates: Partial<DataSource>) =>
      updateMutation.mutate({ id, updates }),
    deleteDataSource: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
