"use client";

import { useMutation } from "@tanstack/react-query";
import { changeUserPassword, type ChangePasswordInput } from "@/actions/user";

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: async (input: ChangePasswordInput) => {
      const res = await changeUserPassword(input);
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
  });
}
