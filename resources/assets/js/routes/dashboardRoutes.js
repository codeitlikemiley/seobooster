const Accounts = () => import('../pages/Accounts.vue')
const Reports = () => import('../pages/Reports.vue')
const Posts = () => import('../pages/Posts.vue')
export default [
    /* Start Dashboard Routes */
    {
        path: '/accounts',
        component: Accounts,
        name: 'accounts',
        meta: {
            requiresAuth: true,
            permission: 'guest',
            fail: '/error'
        }
    },
    {
        path: '/reports',
        component: Reports,
        name: 'reports',
        meta: {
            requiresAuth: true,
            permission: 'guest',
            fail: '/error'
        }
    },
    {
        path: '/posts',
        component: Posts,
        name: 'posts',
        meta: {
            requiresAuth: true,
            permission: 'guest',
            fail: '/error'
        }
    }
    /* End Dashboard Routes */
]
