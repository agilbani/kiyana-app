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
    DASHBOARD_HISTORYCASHADVANCE:
        "/(main)/dashboard/finance/cash-advance/CashAdvanceHistory",
    DASHBOARD_DETAIL_CASHADVANCE:
        "/(main)/dashboard/finance/cash-advance/Detail",
    DASHBOARD_TRANSFER: "/(main)/dashboard/finance/transfer",
    DASHBOARD_TRANSFER_HISTORY: "/(main)/dashboard/finance/transfer/history",
    DASHBOARD_WITHDRAWAL: "/(main)/dashboard/finance/withdrawal",
    DASHBOARD_HISTORY_WITHDRAWAL:
        "/(main)/dashboard/finance/withdrawal/Withdraw",
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
    DASHBOARD_CREATE_PRODUCT_PRIORITAS:
        "/(main)/dashboard/task/createPriorityProduct",
    DASHBOARD_CREATE_MASSIVE_PRODUCT_PRIORITAS:
        "/(main)/dashboard/task/createMassivePriorityProduction",
    DASHBOARD_REQUEST_MATERIAL: "/(main)/dashboard/task/material-request",
    DASHBOARD_REQUEST_ACCESSORIES: "/(main)/dashboard/task/accessories-request",
    EDIT_ATTENDANCE: `/(main)/dashboard/editAttendance`,
    NOTIFICATION: `/(main)/dashboard/Notification`,
    DASHBOARD_APPROVAL: "/(main)/dashboard/hr",
    DETAIL_ABSENCE_REQUEST: "/(main)/dashboard/hr/DetailAbsence",
    DETAIL_SWAP_ABSENCE_REQUEST: "/(main)/dashboard/hr/DetailSwapRequest",
    DETAIL_LOAN_REQUEST: "/(main)/dashboard/hr/DetailLoanRequest",

    // Attendance
    ATTENDANCE: "/(main)/attendance",
    ATTENDANCE_CLOCKIN: `/(main)/attendance/clock-in`,
    ATTENDANCE_SELFIE: `/(main)/attendance/selfie`,
    ATTENDANCE_FORM: `/(main)/attendance/form`,
    ATTENDANCE_DETAIL: (id: string | number) => `/(main)/attendance/${id}`,
    ABSENCE_HISTORY: `/(main)/attendance/absence`,
    ABSENCE_ADD: `/(main)/attendance/add-absence`,
    PRESENCE_SCREEN: "/(main)/attendance/presenceScreen",
    ATTENDANCE_SUMMARY: "/(main)/attendance/attendanceSummary",
    REQUEST_CHANGE_SHIFT: "/(main)/attendance/requestChangeShift",
    OVER_TIME_HISTORY: "/(main)/attendance/overtime-history",
    TEMPORARY_EMPLOYEE: "/(main)/attendance/temporary-employee",

    //status
    LOG_ACTIVITY: "/(main)/log-activity",

    //warehouse
    AKSESORIS: "/task/warehouse/aksesoris",
    AKSESORIS_ADD: "/task/warehouse/aksesoris-add",
    BAHAN: "/task/warehouse/bahan",
    BAHAN_ADD: "/task/warehouse/bahan-add",
    PRODUK: "/task/warehouse/produk",
    PRODUK_ADD: "/task/warehouse/produk-add",

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
    TASK_ADD_PRIORITY_PRODUCTS: "/task/priority-product/add-priority-product",
    TASK_FIX_ATTENDANCE: "/task/hr/fix-attendance",
    TASK_SHIFT_SCHEDULE: "/task/hr/shift-schedule",
    TASK_APPROVAL_SUBMISSION: "/task/hr/approval-submission",
    TASK_POINT_OF_SALE: "/task/sale/pos",
    TASK_LIST_SALE: "/task/sale/list",
    TASK_DETAIL_SALE: "/task/sale/detail",
    TASK_LIST_CUSTOMER: "/task/customer",
    TASK_LIST_PRODUCT_VARIANT: "/task/warehouse/product-variant",
    TASK_POINT_OF_SALE_V2: "/task/sale/point-of-sales/list-product",
    TASK_POINT_OF_SALE_PREVIEW_PODUCT_V2:
        "/task/sale/point-of-sales/preview-product",
    TASK_POINT_OF_SALE_PAYMENT_PRODUCT_V2:
        "/task/sale/point-of-sales/payment-product",
    TASK_POINT_OF_SALE_PAYMENT_SUCCESS_PRODUCT_V2:
        "/task/sale/point-of-sales/payment-success-product",
    TASK_ADD_STOCK: "/task/warehouse/add-stock",
    TASK_CALCULATE_STOCK: "/task/warehouse/calculate-stock",

    // Profile
    PROFILE: "/(main)/profile",
    PROFILE_PERSONAL_DATA: "/(main)/profile/personal-data",
    PROFILE_PAYROLL: "/(main)/profile/payroll",
    PROFILE_DETAIL_PAYROLL: (id: any, salaryId: any) =>
        `/(main)/profile/payroll/${id}?salaryId=${salaryId}`,
    PROFILE_CONTACT_US: "/(main)/profile/contact-us",
    PROFILE_CHANGE_PASSWORD: "/(main)/profile/change-password",
} as const;
