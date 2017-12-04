const Dashboard = () => import('../pages/Dashboard.vue')
const Settings = () => import('../pages/Settings.vue')
const Users = () => import('../pages/Users.vue')

export default [
    /* Start Authenticated Routes */
    {
        path: '/dashboard',
        component: Dashboard,
        name: 'dashboard',
        meta: {
            requiresAuth: true,
            permission: 'guest',
            fail: '/error'
        }
    },
    {
        path: '/settings',
        component: Settings,
        name: 'settings',
        meta: {
            requiresAuth: true,
            permission: 'guest',
            fail: '/error'
        }
    },
    {
        path: '/users',
        component: Users,
        name: 'users',
        meta: {
            requiresAuth: true,
            permission: 'guest',
            fail: '/error'
        }
    }
    /* End Authenticated Routes */
]
