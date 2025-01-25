import { createApp } from 'vue'
import { createStore } from 'vuex'
import { VuexPersistence } from 'vuex-persist'

import App from './App.vue'

import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './views/HomeView.vue'
import RegisterView from './views/RegisterView.vue'
import DashboardView from './views/DashboardView.vue'
import LoginView from './views/LoginView.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/register', component: RegisterView },
    { path: '/dashboard', component: DashboardView },
    { path: '/login', component: LoginView },
]

const vuexSessionStorage = new VuexPersistence({
    storage: window.sessionStorage
})

const store = createStore({
    state() {
        return {
            loggedIn: false,
            user: null,
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user
            state.loggedIn = true
        },
    },
    getters: {
        user: (state) => state.user,
        loggedIn: (state) => state.loggedIn,
    },
    plugins: [vuexSessionStorage.plugin]
})

const router = createRouter({
    history: createMemoryHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    console.log(store.state.user)
    if (to.path === '/dashboard' && !store.getters.loggedIn) {
        next('/login')
    } else if (to.path === '/login' && store.getters.loggedIn) {
        next('/dashboard')
    } else {
        next()
    }
})



createApp(App)
    .use(router)
    .use(store)
    .mount('#app')
