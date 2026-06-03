"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { LogoutButton } from "@/components/auth/logout-button";
import { COUNTRY_OPTIONS } from "@/lib/countries";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useProfileQuery,
  profileQueryKey,
} from "@/hooks/queries/use-profile-queries";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateProfileMutation } from "@/hooks/mutations/use-profile-mutations";
import { uploadUserAvatar } from "@/actions/user";
import {
  SettingsTabFooter,
  SettingsTabLayout,
} from "@/components/settings/settings-tab-layout";

const MyProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be under 80 characters.")
    .refine((val) => val.trim().length > 0, "Name cannot be empty."),
  country: z
    .string()
    .min(1, "Please select a country.")
    .transform((code) => {
      const match = COUNTRY_OPTIONS.find((c) => c.value === code);
      return match?.label ?? code;
    }),
});

type MyProfileFormValues = z.infer<typeof MyProfileSchema>;

interface MyProfileTabProps {
  onClose: () => void;
}

export default function MyProfileTab({ onClose }: MyProfileTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [manualAvatar, setManualAvatar] = useState<string | null | "deleted">(
    null,
  );

  const { data: profile, isPending: isLoadingProfile } = useProfileQuery();
  const updateProfile = useUpdateProfileMutation();
  const queryClient = useQueryClient();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const avatar =
    manualAvatar === "deleted"
      ? null
      : (manualAvatar ?? profile?.avatarUrl ?? null);

  const form = useForm<MyProfileFormValues>({
    resolver: zodResolver(MyProfileSchema),
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
    if (profile) {
      const countryCode =
        COUNTRY_OPTIONS.find((c) => c.label === profile.country)?.value ?? "";

      form.reset({
        fullName: profile.fullName ?? "",
        country: countryCode,
      });
    }
  }, [profile, form]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isUploadingAvatar) return;

    const previewUrl = URL.createObjectURL(file);
    setManualAvatar(previewUrl);
    setIsUploadingAvatar(true);

    try {
      const result = await uploadUserAvatar(file);

      if (!result.ok) {
        toast.error(
          result.error ?? "Could not upload avatar. Please try again.",
        );
        setManualAvatar(null);
        URL.revokeObjectURL(previewUrl);
        return;
      }

      setManualAvatar(result.data.avatarUrl);
      URL.revokeObjectURL(previewUrl);
      queryClient.invalidateQueries({ queryKey: profileQueryKey });
      toast.success("Avatar updated successfully.");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAvatar = () => {
    setManualAvatar("deleted");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (values: MyProfileFormValues) => {
    try {
      await updateProfile.mutateAsync({
        fullName: values.fullName.trim(),
        country: values.country,
      });
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update profile. Please try again.",
      );
    }
  };

  return (
    <SettingsTabLayout
      footer={
        <SettingsTabFooter className="md:flex-row md:items-center md:justify-between">
          <button
            type="submit"
            disabled={isSubmitting || updateProfile.isPending}
            form="profile-form"
            className="order-1 w-full rounded-[10px] bg-primary px-10 py-3 text-sm 
            font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed
             disabled:opacity-50 md:order-2 md:w-auto md:text-base"
          >
            {isSubmitting || updateProfile.isPending
              ? "Saving..."
              : "Save Changes"}
          </button>
          <LogoutButton
            variant="menu"
            className="order-2 w-full rounded-[8px] border border-red-100 bg-red-50 px-10 py-3
             text-center text-sm font-medium text-red-500 hover:opacity-90 md:order-1 md:w-auto md:text-base"
          />
        </SettingsTabFooter>
      }
    >
      <div className="flex flex-col gap-6 pb-4">
        <h3 className="text-[20px] font-medium text-black-300">My Profile</h3>

        <div className="flex flex-col items-center gap-[30px] rounded-[12px] border-[0.5px] border-gray-500 p-[24px] w-full">
          <div className="h-[122px] w-[122px] overflow-hidden rounded-full bg-gray-100">
            {avatar ? (
              <Image
                src={avatar}
                alt="Profile"
                width={122}
                height={122}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400 text-2xl font-medium">
                {(profile?.fullName ?? fullName)?.charAt(0).toUpperCase() ||
                  "?"}
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
              disabled={isUploadingAvatar}
              onClick={() => fileInputRef.current?.click()}
              className="h-[40px] whitespace-nowrap rounded-[8px] border border-gray-300 px-[24px] 
            py-[8px] text-sm md:text-base text-foreground hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Upload new picture
            </button>
            <button
              type="button"
              disabled={isUploadingAvatar}
              onClick={handleDeleteAvatar}
              className="h-[40px] whitespace-nowrap rounded-[8px] border border-red-100 bg-red-50
            px-[24px] py-[8px] text-sm md:text-base text-red-500 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="profile-form"
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
                      disabled={isSubmitting || isLoadingProfile}
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
                  className="w-full h-full rounded-[8px] border border-primary-500 px-[16px] 
                py-[12px] text-[16px] font-medium leading-[150%] text-black-500 outline-none 
                bg-gray-50 opacity-60 cursor-not-allowed"
                />
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
                          disabled={isSubmitting || isLoadingProfile}
                          {...field}
                          className="w-full h-full appearance-none rounded-[8px] border border-primary-500 
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
        </Form>
      </div>
    </SettingsTabLayout>
  );
}
