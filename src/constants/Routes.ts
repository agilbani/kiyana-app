export const ROUTES = {
  // Auth
  LOGIN: "/(auth)/login",

  // Onboarding
  ONBOARDING: "/(onboarding)/onboarding",
  PERMISSIONS: "/(onboarding)/permissions",
  CAMERA_PERMISSION: "/(onboarding)/permissions/camera",
  LOCATION_PERMISSION: "/(onboarding)/permissions/location",
  NOTIFICATION_PERMISSION: "/(onboarding)/permissions/notification",

  // Main
  DASHBOARD: "/(main)/dashboard",
  DASHBOARD_CASHADVANCE: "/(main)/dashboard/finance/cash-advance",
  DASHBOARD_TRANSFER: "/(main)/dashboard/finance/transfer",
  DASHBOARD_WITHDRAWAL: "/(main)/dashboard/finance/withdrawal",
  DASHBOARD_HISTORY_TRANSACTION: "/(main)/dashboard/finance/history",
  DASHBOARD_TASK_DETAIL: (id: string | number) =>
    `/(main)/dashboard/task/${id}`,

  // Attendance
  ATTENDANCE: "/(main)/attendance",
  ATTENDANCE_CLOCKIN: "/(main)/attendance/clock-in",
  ATTENDANCE_SELFIE: "/(main)/attendance/selfie",
  ATTENDANCE_FORM: "/(main)/attendance/form",
  ATTENDANCE_DETAIL: (id: string | number) => `/(main)/attendance/${id}`,

  // Task
  TASK: "/(main)/task",

  // Profile
  PROFILE: "/profile",
} as const;
