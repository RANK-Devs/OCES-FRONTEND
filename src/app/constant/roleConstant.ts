export const roleConstant = {
  menus: [
    {
      path: '',
      text: 'Dashboard',
      icon: 'fa fa-dashboard',
      role: ['Super Admin', 'Admin', 'Student', 'Employee', 'CSCB'],
    },
    {
      path: 'document-reports',
      text: 'Document Reports',
      icon: 'fa fa-print',
      role: ['Super Admin', 'Admin', 'Employee', 'CSCB'],
    },
    {
      path: 'student-reports',
      text: 'Student Reports',
      icon: 'fa fa-users',
      role: ['Super Admin', 'Admin', 'Student', 'CSCB'],
    },
    // {
    //   path: 'approval',
    //   text: 'Document Approval',
    //   icon: 'fa fa-check',
    //   role: ['Super Admin', 'Admin', 'Student','CSCB'],
    // },
    {
      path: 'visual-reports',
      text: 'Visual Reports',
      icon: 'fa fa-pie-chart',
      role: ['Super Admin', 'Admin', 'Student', 'Employee', 'CSCB'],
    },
    {
      path: 'archive',
      text: 'Archive',
      icon: 'fa fa-briefcase',
      role: ['Super Admin', 'Admin'],
    },
    {
      path: 'account-admin',
      text: 'User Management',
      icon: 'fa fa-key',
      role: ['Super Admin'],
    },
    {
      path: 'schedule',
      text: 'Schedule Tracker',
      icon: 'fa fa-calendar',
      role: ['Super Admin', 'Admin', 'Student', 'Employee', 'CSCB'],
    },
  ],
};
