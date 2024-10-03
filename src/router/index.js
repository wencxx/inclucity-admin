import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from '../store'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import UsersAccount from '../views/UsersAccount.vue'
import RegisteredPwd from '../views/RegisteredPwd.vue'
import Application from '../views/Application.vue'
import Announcement from '../views/Announcement.vue'


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
        path: '/registered-pwd',
        name: 'registered PWD',
        component: RegisteredPwd
    },
    {
        path: '/pwd-applications',
        name: 'application',
        component: Application
    },
    {
        path: '/announcement',
        name: 'announcement',
        component: Announcement
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