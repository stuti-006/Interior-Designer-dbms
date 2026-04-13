import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

// Clients Hooks
export const useClients = () => useQuery({ queryKey: ["clients"], queryFn: api.getClients });

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createClient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Parameters<typeof api.updateClient>[1]) => api.updateClient(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteClient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });
};

// Designers Hooks
export const useDesigners = () => useQuery({ queryKey: ["designers"], queryFn: api.getDesigners });

export const useCreateDesigner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createDesigner,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["designers"] }),
  });
};

export const useUpdateDesigner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Parameters<typeof api.updateDesigner>[1]) => api.updateDesigner(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["designers"] }),
  });
};

export const useDeleteDesigner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteDesigner,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["designers"] }),
  });
};

// Projects Hooks
export const useProjects = () => useQuery({ queryKey: ["projects"], queryFn: api.getProjects });

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Parameters<typeof api.updateProject>[1]) => api.updateProject(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
};

// Payments Hooks
export const usePayments = () => useQuery({ queryKey: ["payments"], queryFn: api.getPayments });

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createPayment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payments"] }),
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Parameters<typeof api.updatePayment>[1]) => api.updatePayment(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payments"] }),
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deletePayment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payments"] }),
  });
};
