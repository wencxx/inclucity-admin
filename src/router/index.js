import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from '../store'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import UsersAccount from '../views/UsersAccount.vue'
import DeletedUsersAccount from '../views/DeletedUsersAccount.vue'
import RegisteredPwd from '../views/RegisteredPwd.vue'
import ReleasedId from '../views/ReleasedId.vue'
import RejectedApplications from '../views/Rejected.vue'
import PwdPerBarangay from '../views/PwdPerBarangay.vue'
import TotalNumberPwd from '../views/TotalNumberPwd.vue'
import TotalEmploymentStatus from '../views/TotalEmploymentStatus.vue'
import Application from '../views/Application.vue'
import Announcement from '../views/Announcement.vue'
import DeletedAnnouncement from '../views/DeletedAnnouncement.vue'


const routes = [
    {
        path: '',
        name: 'login',
        component: LoginView
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/user-accounts',
        name: 'user Accounts',
        component: UsersAccount
    },
    {
        path: '/deleted-user-accounts',
        name: 'deleted User Accounts',
        component: DeletedUsersAccount
    },
    {
        path: '/registered-pwd',
        name: 'registered PWD',
        component: RegisteredPwd
    },
    {
        path: '/released-id',
        name: 'released ID',
        component: ReleasedId
    },
    {
        path: '/rejected',
        name: 'declined Applications',
        component: RejectedApplications
    },
    {
        path: '/pwd-per-barangay',
        name: 'PWD Per Barangay',
        component: PwdPerBarangay
    },
    {
        path: '/total-pwd',
        name: 'total number of pwd',
        component: TotalNumberPwd
    },
    {
        path: '/total-employment',
        name: 'total employment status',
        component: TotalEmploymentStatus
    },
    {
        path: '/pwd-applications',
        name: 'PWD ID application',
        component: Application
    },
    {
        path: '/announcement',
        name: 'announcement',
        component: Announcement
    },
    {
        path: '/deleted-announcement',
        name: 'deleted announcement',
        component: DeletedAnnouncement
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const isAuthenticated = authStore.isAuthenticated
    
    if(to.meta.requiresAuth && !isAuthenticated){
        next('/')
    }if(to.path == '/' && isAuthenticated){
        next('/dashboard')
    }
    else{
        next()
    }
})
export default router