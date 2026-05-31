export type NotificationPreferences = {
  id: string;
  userId: string;
  emailFunnelReady: boolean;
  emailStageUnlocked: boolean;
  emailStageCompleted: boolean;
  emailWeeklyDigest: boolean;
  inappTaskCompleted: boolean;
  inappStageUnlocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UpdateNotificationPreferencesInput = {
  email_funnel_ready?: boolean;
  email_stage_unlocked?: boolean;
  email_stage_completed?: boolean;
  email_weekly_digest?: boolean;
  inapp_task_completed?: boolean;
  inapp_stage_unlocked?: boolean;
};
