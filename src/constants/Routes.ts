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
  DASHBOARD: "/(main)/dashboard/Dashboard",
  DASHBOARD_CASHADVANCE: "/(main)/dashboard/finance/cash-advance",
  DASHBOARD_HISTORYCASHADVANCE: "/(main)/dashboard/finance/cash-advance/CashAdvanceHistory",
  DASHBOARD_DETAIL_CASHADVANCE: "/(main)/dashboard/finance/cash-advance/Detail",
  DASHBOARD_TRANSFER: "/(main)/dashboard/finance/transfer",
  DASHBOARD_WITHDRAWAL: "/(main)/dashboard/finance/withdrawal",
  DASHBOARD_HISTORY_TRANSACTION: "/(main)/dashboard/finance/history",
  DASHBOARD_TASK_DETAIL: (id: string | number) =>
    `/(main)/dashboard/task/${id}`,
  DASHBOARD_DETAIL_TASK: `/(main)/dashboard/task/detailCutting`,
  DASHBOARD_DETAIL_PRODUCTION: `/(main)/dashboard/task/detailProduction`,
  DASHBOARD_SCAN_BATCH: `/(main)/dashboard/task/scanBatch`,
  DASHBOARD_WITHDRAW_HISTORY: `/(main)/dashboard/finance/withdrawal/Withdraw`,
  DASHBOARD_ASSIGN_SEWN: `/(main)/dashboard/task/assignTaskSewn`,
  DASHBOARD_ALL_TASK_PRODUCTION: `/(main)/dashboard/task/allTaskProduction`,
  DASHBOARD_ALL_TASK_TODAY: `/(main)/dashboard/task/todayTask`,
  DASHBOARD_ALL_TASKPRIORITY: `/(main)/dashboard/task/allPriorityTask`,
  DASHBOARD_CREATE_PLAN_PRODUCTION: `/(main)/dashboard/task/createPlanProduction`,
  DASHBOARD_MONITORING_PRODUCTION: `/(main)/dashboard/task/productionMonitoring`,
  DASHBOARD_CREATE_PRODUCT_PRIORITAS: "/(main)/dashboard/task/createPriorityProduct",

  // Attendance
  ATTENDANCE: "/(main)/attendance",
  ATTENDANCE_CLOCKIN: `/(main)/attendance/clock-in`,
  ATTENDANCE_SELFIE: `/(main)/attendance/selfie`,
  ATTENDANCE_FORM: `/(main)/attendance/form`,
  ATTENDANCE_DETAIL: (id: string | number) => `/(main)/attendance/${id}`,
  ABSENCE_HISTORY: `/(main)/attendance/absence`,
  ABSENCE_ADD: `/(main)/attendance/add-absence`,
  EDIT_ATTENDANCE: `/(main)/attendance/editAttendance`,

  // Task
  TASK: "/task",
  TASK_LIST_OF_PRODUCTS: "/task/warehouse/list-products",
  TASK_ADD_DATA_PRODUCTS: "/task/warehouse/add-product",
  TASK_COMPLETE_FLOW_PRODUCTS: "/task/warehouse/complete-product-flow",
  TASK_COMPLETE_ADD_PRODUCTS: "/task/warehouse/confirm-new-product",
  TASK_STOCK_IN: "/task/warehouse/stock-in",
  TASK_STOCK_OUT: "/task/warehouse/stock-out",
  TASK_RETURN_ITEM: "/task/warehouse/return-item",
  TASK_LIST_OF_PRIORITY_PRODUCTS:
    "/task/priority-product/list-priority-product",
  TASK_ADD_PRIORITY_PRODUCTS:
    "/task/priority-product/add-priority-product",
  TASK_FIX_ATTENDANCE: "/task/hr/fix-attendance",
  TASK_SHIFT_SCHEDULE: "/task/hr/shift-schedule",
  TASK_APPROVAL_SUBMISSION: "/task/hr/approval-submission",
  TASK_POINT_OF_SALE: "/task/sale/pos",
  TASK_LIST_SALE: "/task/sale/list",
  TASK_DETAIL_SALE: "/task/sale/detail",
  TASK_LIST_CUSTOMER : "/task/customer",
  TASK_LIST_PRODUCT_VARIANT: "/task/warehouse/product-variant",

  // Profile
  PROFILE: "/(main)/profile",
  PROFILE_PERSONAL_DATA: "/(main)/profile/personal-data",
  PROFILE_PAYROLL: "/(main)/profile/payroll",
  PROFILE_DETAIL_PAYROLL: (id: string | number) => `/(main)/profile/payroll/${id}`,
  PROFILE_CONTACT_US: "/(main)/profile/contact-us",
  PROFILE_CHANGE_PASSWORD: "/(main)/profile/change-password",
} as const;
