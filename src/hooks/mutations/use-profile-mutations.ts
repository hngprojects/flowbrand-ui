"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile, type UpdateProfileInput } from "@/actions/user";
import { profileQueryKey } from "@/hooks/queries/use-profile-queries";

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const res = await updateUserProfile(input);
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(profileQueryKey, updatedProfile);
    },
  });
}