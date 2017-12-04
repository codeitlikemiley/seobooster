import authRoutes from './routes/authRoutes'
import homeRoutes from './routes/homeRoutes'
import profileRoutes from './routes/profileRoutes'
import dashboardRoutes from './routes/dashboardRoutes'
import errorRoutes from './routes/errorRoutes'

let routeFiles = []
/* Multi Route Files */
const routes = routeFiles.concat(
    authRoutes,
    homeRoutes,
    profileRoutes, dashboardRoutes, errorRoutes
    /* add here Other Routes File */
)
export default routes
