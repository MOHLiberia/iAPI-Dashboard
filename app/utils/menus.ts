export const mainMenuList = [
    {name: 'Home', to: '/dashboard', icon: 'tabler:home', permission: '', role: '', subMenu: []},
    {name: 'Applications', to: '', icon: 'tabler:app-window', permission: 'view_applications', role: 'admin', openSubmenu: false, subMenu: [
        {name: 'All Applications', to: '/dashboard/applications', icon: 'tabler:app-window', permission: 'view_applications', role: 'admin'},
            {name: 'Add Application', to: '/dashboard/applications/create', icon: 'tabler:plus', permission: 'create_application', role: 'admin'}
        ]
    },
    {name: 'DHIS2', to: '', icon: 'tabler:database', permission: 'view_dhis2', role: '', openSubmenu: false, subMenu: [
        {name: 'All Instances', to: '/dashboard/dhis2', icon: 'tabler:database', permission: 'view_dhis2', role: ''},
            {name: 'Add DHIS2 Instance', to: '/dashboard/dhis2/create', icon: 'tabler:plus', permission: 'add_dhis2_instance', role: ''},
        ]},
    {name: 'Users', to: '', icon: 'tabler:users', permission: 'view_users', role: '', subMenu: [
            {name: 'All Users', to: '/dashboard/users', icon: 'tabler:user', permission: 'create_user', role: 'admin'},
            {name: 'New User', to: '/dashboard/users/create', icon: 'tabler:user-plus', permission: 'create_user', role: 'admin'},
            {name: 'Account Requests', to: '/dashboard/users/requests', icon: 'tabler:users-plus', permission: 'create_user', role: 'admin'},
        ]},
    {name: 'Metadata', to: '/dashboard/metadata', icon: 'tabler:adjustments-horizontal', permission: 'view_metadata', role: '', subMenu: [
            {name: 'Units', to: '/dashboard/metadata/units', icon: 'ri:user-community-fill', permission: 'manage_unit', role: 'admin'},
            {name: 'Organizations', to: '/dashboard/metadata/organizations', icon: 'codicon:organization', permission: 'create_application', role: 'admin'},
            {name: 'Departments', to: '/dashboard/metadata/departments', icon: 'tabler:users-group', permission: 'create_application', role: 'admin'},
            {name: 'Permissions', to: '/dashboard/metadata/permissions', icon: 'icon-park-outline:permissions', permission: 'create_application', role: 'admin'},
            {name: 'Roles', to: '/dashboard/metadata/roles', icon: 'oui:app-users-roles', permission: 'create_application', role: 'admin'},
        ]},
    {name: 'Settings', to: '/dashboard/settings', icon: 'tabler:settings', permission: 'view_settings', role: '', subMenu: []},
]

export const profileMenuList = [
    { label: 'Account', to: '/dashboard/account', icon: 'tabler:user', permission: '' },
    { label: 'Settings', to: '/dashboard/settings', icon: 'tabler:settings', permission: 'view_settings'}
]