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

  // Attendance
  ATTENDANCE: "/(main)/attendance",
  ATTENDANCE_CLOCKIN: "/(main)/attendance/clock-in",
  ATTENDANCE_SELFIE: "/(main)/attendance/selfie",
  ATTENDANCE_FORM: "/(main)/attendance/form",

  // Task
  TASK: "/(main)/task",
} as const;
