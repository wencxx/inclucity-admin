<template>
  <section class="h-screen bg-bg1 bg-center bg-no-repeat bg-cover flex items-center justify-center font-poppins">
    <form @submit.prevent="login" class="glass-morphism w-3/4 h-fit py-5 lg:py-10 md:w-2/4 lg:w-1/4 flex flex-col items-center px-10">
        <!-- logo -->
        <div class="w-3/4 lg:w-3/4 flex justify-center">
            <img src="../assets/logo.png" alt="logo" class="w-full md:w-3/4 lg:w-full">
        </div>
        <!-- forms -->
        <p v-if="invalidPassword" class="bg-red-500 text-white pl-2 py-1 rounded w-full mb-1">Invalid password</p>
        <p v-if="invalidCredentials" class="bg-red-500 text-white pl-2 py-1 rounded w-full mb-1">Invalid credentials</p>
        <p v-if="err" class="bg-red-500 text-white pl-2 py-1 rounded w-full mb-1">Somethings wrong with the server!</p>
        <div class="flex flex-col gap-y-3 w-full">
            <input type="text" v-model="username" placeholder="Username" class="pl-2 h-8 lg:h-10 rounded focus:outline focus:outline-2">
            <div class="flex items-center bg-white rounded pr-1 group focus-within:outline focus-within:outline-2">
                <input :type="passwordType" v-model="password" placeholder="Password" class="pl-2 h-8 lg:h-10 w-full bg-transparent focus:outline-none">
                <Icon :icon="eyeIconType" class="text-2xl text-gray-500" @click="togglePassword" />
            </div>
        </div>
        <!-- remember me -->
        <div class="flex items-center gap-x-2 w-full px-2 mt-2">
            <input type="checkbox">
            <p class="font-semibold text-white tracking-wide">Remember me</p>
        </div>
        <button v-if="!loadingLogin" class="bg-custom-primary w-full py-2 text-white rounded-full mt-2">Sign In</button>
        <button v-else class="bg-custom-primary w-full py-2 text-white rounded-full mt-2">Signing in</button>
    </form>
  </section>
</template>

<script setup>
import axios from 'axios'
import { ref } from "vue"
import { useRouter } from 'vue-router' 
import { useAuthStore } from '../store'
const serverUrl = import.meta.env.VITE_SERVER_URL

const router = useRouter()
const authStore = useAuthStore()

const passwordType = ref('password')
const eyeIconType = ref('mdi:eye-outline')

const togglePassword  = () => {
    if(passwordType.value === 'password'){
        passwordType.value = 'text'
        eyeIconType.value = 'mdi:eye-off-outline'
        return
    }
    passwordType.value = 'password'
    eyeIconType.value = 'mdi:eye-outline'
}


const username = ref('')
const password = ref('')

const loadingLogin = ref(false)
const invalidPassword = ref(false)
const invalidCredentials = ref(false)
const err = ref(false)

const login = async () => {
    invalidPassword.value = false
    invalidCredentials.value = false
    loadingLogin.value =  true
    
    const loginCredentials = {
        email: username.value,
        password: password.value,
    }

    try {
        const res = await axios.post(`${serverUrl}/login`, loginCredentials)

        if(res.data === 'invalid password') return invalidPassword.value = true
        if(res.data === 'invalid credentials' || res.data.role !== 'admin') return invalidCredentials.value = true

        authStore.login(res.data.token)    
        router.push('/dashboard')

        console.log(res.data)
    } catch (error) {
        console.error(error)
        err.value = true
    }finally{
        loadingLogin.value = false
    }
}
</script>

<style>
.glass-morphism {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}
</style>