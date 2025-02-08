//路由配置规则数组
export const AppRoutes = [
    { 
        path: "/", 
        name:'layout',
        redirect: '/dashboard',
        component: ()=>import('@layout/index.vue'),
    },
    { 
        path: "/login", 
        name:'登录',
        component: ()=>import('@views/login/Login.vue') 
    }
]