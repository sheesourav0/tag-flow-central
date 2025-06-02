
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService, DatabaseGroup } from '../services/tagService';
import { useToast } from './use-toast';

export const useGroups = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: groups = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['groups'],
    queryFn: tagService.getAllGroups,
  });

  const createGroupMutation = useMutation({
    mutationFn: tagService.createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast({
        title: 'Success',
        description: 'Group created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create group',
        variant: 'destructive',
      });
      console.error('Create group error:', error);
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<DatabaseGroup> }) =>
      tagService.updateGroup(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast({
        title: 'Success',
        description: 'Group updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update group',
        variant: 'destructive',
      });
      console.error('Update group error:', error);
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: tagService.deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast({
        title: 'Success',
        description: 'Group deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete group',
        variant: 'destructive',
      });
      console.error('Delete group error:', error);
    },
  });

  return {
    groups,
    isLoading,
    error,
    refetch,
    createGroup: createGroupMutation.mutate,
    updateGroup: updateGroupMutation.mutate,
    deleteGroup: deleteGroupMutation.mutate,
    isCreating: createGroupMutation.isPending,
    isUpdating: updateGroupMutation.isPending,
    isDeleting: deleteGroupMutation.isPending,
  };
};
