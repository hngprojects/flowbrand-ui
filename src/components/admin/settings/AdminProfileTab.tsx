"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiCountryLabelToCode, COUNTRY_OPTIONS } from "@/lib/countries";
import { updateAdminProfile } from "@/lib/admin-profile-api";
import { AdminLogoutButton } from "@/components/admin/auth/admin-logout-button";
import {
  adminProfileKeys,
  useAdminProfileQuery,
} from "@/hooks/queries/use-admin-profile-queries";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const AdminProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be under 80 characters.")
    .refine((val) => val.trim().length > 0, "Name cannot be empty."),
  country: z.string().min(1, "Please select a country."),
});

type AdminProfileFormValues = z.infer<typeof AdminProfileSchema>;

interface AdminProfileTabProps {
  onClose: () => void;
}

export default function AdminProfileTab({ onClose }: AdminProfileTabProps) {
  const queryClient = useQueryClient();
  const { data: profile } = useAdminProfileQuery();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [avatarOverride, setAvatarOverride] = useState<
    string | null | undefined
  >(undefined);
  const displayAvatar =
    avatarOverride !== undefined
      ? avatarOverride
      : (profile?.avatarUrl ?? null);

  const form = useForm<AdminProfileFormValues>({
    resolver: zodResolver(AdminProfileSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "",
      country: "",
    },
  });

  const { isSubmitting } = form.formState;
  const fullName = useWatch({ control: form.control, name: "fullName" });

  useEffect(() => {
    if (!profile) return;

    form.reset({
      fullName: profile.fullName,
      country: apiCountryLabelToCode(profile.country),
    });
  }, [profile, form]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;
    setAvatarOverride(previewUrl);
  };

  const handleDeleteAvatar = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setAvatarOverride(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (values: AdminProfileFormValues) => {
    try {
      await updateAdminProfile({
        full_name: values.fullName.trim(),
        country: values.country,
      });
      await queryClient.invalidateQueries({
        queryKey: adminProfileKeys.me(),
      });
      toast.success("Profile updated successfully.");
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update profile. Please try again.",
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-[20px] font-medium text-black-300">My Profile</h3>

      <div className="flex flex-col items-center gap-[30px] rounded-[12px] border-[0.5px] border-gray-500 p-[24px] w-full">
        <div className=" h-[100px] w-[100px]md:h-[122px] md:w-[122px] overflow-hidden rounded-full bg-gray-100">
          {displayAvatar ? (
            <Image
              src={displayAvatar}
              alt="Profile"
              width={122}
              height={122}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400 text-2xl font-medium">
              {fullName?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-[40px] whitespace-nowrap rounded-[8px] border border-gray-300 px-[24px] 
            py-[8px] text-sm md:text-base text-foreground hover:bg-gray-50 transition-colors"
          >
            Upload new picture
          </button>
          <button
            type="button"
            onClick={handleDeleteAvatar}
            className="h-[40px] whitespace-nowrap rounded-[8px] border border-red-100 bg-red-50
            px-[24px] py-[8px] text-sm md:text-base text-red-500 hover:opacity-90 transition-opacity"
          >
            Delete
          </button>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="admin-profile-form"
          className="flex flex-col gap-[21px] rounded-[12px] border-[0.5px] border-gray-500 p-[24px] w-full"
        >
          <h4 className="text-[16px] font-medium leading-[150%] text-primary-900">
            Personal Information
          </h4>

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] font-medium leading-[150%] text-primary-900">
                  Full name
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    {...field}
                    className="w-full h-[44px] rounded-[8px] border border-primary-500 px-[16px] 
                    py-[12px] text-[16px] font-medium leading-[150%] text-black-500 outline-none 
                    focus:border-primary-500 transition-colors disabled:opacity-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[16px] font-medium leading-[150%] text-primary-900">
                Email address
              </label>
              <input
                type="email"
                disabled
                value={profile?.email ?? ""}
                readOnly
                className="w-full h-[44px] rounded-[8px] border border-primary-500 px-[16px] 
                py-[12px] text-[16px] font-medium leading-[150%] text-black-500 outline-none 
                bg-gray-50 opacity-60 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-[16px] font-medium leading-[150%] text-primary-900">
                    Country
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <select
                        disabled={isSubmitting}
                        {...field}
                        className="w-full h-[44px] appearance-none rounded-[8px] border border-primary-500 
                        px-[16px] py-[12px] text-[16px] font-medium leading-[150%] text-black-500 
                        outline-none focus:border-primary-500 transition-colors bg-white disabled:opacity-50"
                      >
                        {COUNTRY_OPTIONS.map((c) => (
                          <option
                            key={c.value === "" ? "_placeholder" : c.value}
                            value={c.value}
                          >
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M4 6L8 10L12 6"
                            stroke="#6B7280"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <AdminLogoutButton className="rounded-[8px] border border-red-100 bg-red-50 px-10 py-3 text-sm md:text-base font-medium text-red-500 hover:opacity-90 w-auto text-center" />
          <button
            type="submit"
            disabled={isSubmitting}
            form="admin-profile-form"
            className="rounded-[10px] bg-primary px-10 py-3 text-sm md:text-base font-medium 
            text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </Form>
    </div>
  );
}
