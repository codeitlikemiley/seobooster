const Accounts = () => import('../pages/Accounts.vue')
const Reports = () => import('../pages/Reports.vue')
const Posts = () => import('../pages/Posts.vue')
const Failure = () => import('../pages/Failure.vue')
const Published = () => import('../pages/Published.vue')
const Scheduled = () => import('../pages/Scheduled.vue')
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
    },
    {
        path: '/failure',
        component: Failure,
        name: 'failure',
        meta: {
            requiresAuth: true,
            permission: 'guest',
            fail: '/error'
        }
    },
    {
        path: '/published',
        component: Published,
        name: 'published',
        meta: {
            requiresAuth: true,
            permission: 'guest',
            fail: '/error'
        }
    },
    {
        path: '/scheduled',
        component: Scheduled,
        name: 'scheduled',
        meta: {
            requiresAuth: true,
            permission: 'guest',
            fail: '/error'
        }
    }
    /* End Dashboard Routes */
]
