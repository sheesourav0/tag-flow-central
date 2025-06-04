
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService, DatabaseTag } from '../services/tagService';
import { useToast } from './use-toast';

export const useTags = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: tags = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['tags'],
    queryFn: tagService.getAllTags,
  });

  const createTagMutation = useMutation({
    mutationFn: tagService.createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast({
        title: 'Success',
        description: 'Tag created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create tag',
        variant: 'destructive',
      });
      console.error('Create tag error:', error);
    },
  });

  const updateTagMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<DatabaseTag> }) =>
      tagService.updateTag(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast({
        title: 'Success',
        description: 'Tag updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update tag',
        variant: 'destructive',
      });
      console.error('Update tag error:', error);
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: tagService.deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast({
        title: 'Success',
        description: 'Tag deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete tag',
        variant: 'destructive',
      });
      console.error('Delete tag error:', error);
    },
  });

  const deleteTagsMutation = useMutation({
    mutationFn: tagService.deleteTags,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast({
        title: 'Success',
        description: 'Tags deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete tags',
        variant: 'destructive',
      });
      console.error('Delete tags error:', error);
    },
  });

  return {
    tags,
    isLoading,
    error,
    refetch,
    createTag: createTagMutation.mutate,
    updateTag: updateTagMutation.mutate,
    deleteTag: deleteTagMutation.mutate,
    deleteTags: deleteTagsMutation.mutate,
    isCreating: createTagMutation.isPending,
    isUpdating: updateTagMutation.isPending,
    isDeleting: deleteTagMutation.isPending || deleteTagsMutation.isPending,
  };
};
