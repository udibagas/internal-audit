import { create, deleteById, getAll, updateById } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useState } from "react";

export const useCrud = <
  FetchType,
  CreateType = FetchType,
  UpdateType = FetchType,
>(
  endpoint: string
) => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<FetchType | undefined>(
    undefined
  );

  function useFetch<T = FetchType[]>(
    params?: Record<string, string | number | boolean>
  ) {
    return useQuery({
      queryKey: [endpoint, params],
      queryFn: () => getAll<T>(endpoint, params),
      staleTime: 60 * 1000 * 10, // 10 minutes
    });
  }

  const createMutation = useMutation({
    mutationFn: (data: CreateType) => create(endpoint, data),
    onSuccess: () => {
      message.success("Data created successfully");
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Failed to create data");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateType }) =>
      updateById(endpoint, id, data),
    onSuccess: () => {
      message.success("Data updated successfully");
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Failed to update user");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteById(endpoint, id),
    onSuccess: () => {
      message.success("Data deleted successfully");
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Failed to delete data");
    },
  });

  const handleEdit = (data: FetchType) => {
    setEditingData(data);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingData(undefined);
  };

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    modalOpen,
    editingData,
    queryClient,
    useFetch,
    setModalOpen,
    setEditingData,
    handleEdit,
    handleDelete,
    handleModalClose,
  };
};
