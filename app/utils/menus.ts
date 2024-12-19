export const mainMenuList = [
    {name: 'Home', to: '/dashboard', icon: 'tabler:home', permission: '', role: '', subMenu: []},
    {name: 'Applications', to: '/dashboard/applications', icon: 'tabler:app-window', permission: 'view_applications', role: 'admin', openSubmenu: false, subMenu: [
        {name: 'Create Application', to: '/dashboard/applications/new', icon: 'tabler:plus', permission: 'create_application', role: 'admin'}]
    },
    {name: 'Users', to: '/dashboard/users', icon: 'tabler:users', permission: 'view_users', role: '', subMenu: [
            {name: 'New User', to: '/dashboard/users/new', icon: 'tabler:plus', permission: 'create_user', role: 'admin'},
        ]},
    {name: 'Metadata', to: '/dashboard/metadata', icon: 'tabler:adjustments-horizontal', permission: 'view_metadata', role: '', subMenu: [
            {name: 'Permissions & Roles', to: '/dashboard/applications/new', icon: 'tabler:plus', permission: 'create_application', role: 'admin'},
        ]},
    {name: 'Settings', to: '/dashboard/settings', icon: 'tabler:settings', permission: 'view_settings', role: '', subMenu: []},

]

export const profileMenuList = [
    { label: 'Account', to: '/dashboard/account', icon: 'tabler:user', permission: '' },
    { label: 'Settings', to: '/dashboard/settings', icon: 'tabler:settings', permission: 'view_settings'}
]