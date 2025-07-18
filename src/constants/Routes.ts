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
  TASK_LIST_OF_PRODUCTS: "/(main)/task/warehouse/list-products",
  TASK_ADD_PRODUCTS: "/(main)/task/warehouse/add-product",
  TASK_STOCK_IN: "/(main)/task/warehouse/stock-in",
  TASK_STOCK_OUT: "/(main)/task/warehouse/stock-out",
  TASK_RETURN_ITEM: "/(main)/task/warehouse/return-item",
  TASK_LIST_OF_PRIORITY_PRODUCTS:
    "/(main)/task/priority-product/list-priority-product",
  TASK_ADD_PRIORITY_PRODUCTS:
    "/(main)/task/priority-product/add-priority-product",
  TASK_FIX_ATTENDANCE: "/(main)/task/hr/fix-attendance",
  TASK_SHIFT_SCHEDULE: "/(main)/task/hr/shift-schedule",
  TASK_APPROVAL_SUBMISSION: "/(main)/task/hr/approval-submission",
  TASK_POINT_OF_SALE: "/(main)/task/sale/pos",

  // Profile
  PROFILE: "/profile",
  PROFILE_PERSONAL_DATA: "/profile/personal-data",
  PROFILE_PAYROLL: "/profile/payroll",
  PROFILE_DETAIL_PAYROLL: (id: string | number) => `/profile/payroll/${id}`,
  PROFILE_CONTACT_US: "/profile/contact-us",
  PROFILE_CHANGE_PASSWORD: "/profile/change-password",
} as const;
