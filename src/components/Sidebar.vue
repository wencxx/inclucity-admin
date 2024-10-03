<template>
    <aside class="absolute left-0 top-0 lg:relative lg:block w-3/5 md:w-2/5 lg:w-1/5 h-screen bg-custom-primary lg:py-10 flex flex-col gap-y-5">
        <Icon icon="mdi:close" class="text-3xl text-white ml-auto mr-2 mt-2 lg:hidden" @click="toggleSidebar" />
        <h1 class="font-poppins text-3xl text-center text-white">IncluCity</h1>
        <nav class="flex flex-col font-poppins text-white gap-y-3 h-full pb-10">
            <p class="pl-5">Pages</p>
            <div class="flex flex-col gap-y-1">
                <router-link :to="{ name: 'dashboard' }" class="px-5 flex items-center gap-x-3 py-2 font-medium hover:bg-activeLink">
                    <Icon icon="ph:house-light" class="text-3xl" />
                    <span class="mt-1">Dashboard</span>
                </router-link>
                <router-link :to="{ name: 'user Accounts' }" class="px-5 flex items-center gap-x-3 py-2 font-medium hover:bg-activeLink">
                    <Icon icon="ion:person-outline" class="text-3xl" />
                    <span class="mt-1">Users</span>
                </router-link>
                <div class="px-5 flex items-center gap-x-3 py-2 font-medium hover:bg-activeLink" @click="recordsDropdown = !recordsDropdown, changeIcon()">
                    <Icon icon="gg:notes" class="text-3xl" />
                    <span class="mt-1">Records</span>
                    <Icon :icon="recordsDropdownIcon" class="text-3xl ml-auto" />
                </div>
                <div class="bg-gray-600 -mt-1" v-if="recordsDropdown">
                    <router-link :to="{ name: 'login' }" class="px-10 flex items-center gap-x-5 py-2 font-medium hover:bg-activeLink">
                        <div class="h-6 w-[2px] bg-white"></div>
                        <span class="mt-1">PWD per Barangay</span>
                    </router-link>
                    <router-link :to="{ name: 'login' }" class="px-10 flex items-center gap-x-5 py-2 font-medium hover:bg-activeLink">
                        <div class="h-6 w-[2px] bg-white"></div>
                        <span class="mt-1">Total Number of PWD</span>
                    </router-link>
                    <router-link :to="{ name: 'login' }" class="px-10 flex items-center gap-x-5 py-2 font-medium hover:bg-activeLink">
                        <div class="h-6 w-[2px] bg-white"></div>
                        <span class="mt-1">PWD Employment Status</span>
                    </router-link>
                </div>
                <router-link :to="{ name: 'application' }" class="px-5 flex items-center gap-x-3 py-2 font-medium hover:bg-activeLink">
                    <Icon icon="mage:edit" class="text-3xl" />
                    <span class="mt-1">PWD ID Application</span>
                </router-link>
                <router-link :to="{ name: 'registered PWD' }" class="px-5 flex items-center gap-x-3 py-2 font-medium hover:bg-activeLink">
                    <Icon icon="mingcute:group-3-line" class="text-3xl" />
                    <span class="mt-1">Registered PWD</span>
                </router-link>
                <router-link :to="{ name: 'announcement' }" class="px-5 flex items-center gap-x-3 py-2 font-medium hover:bg-activeLink">
                    <Icon icon="ri:telegram-2-line" class="text-3xl" />
                    <span class="mt-1">Announcement</span>
                </router-link>
                <router-link :to="{ name: 'login' }" class="px-5 flex items-center gap-x-3 py-2 font-medium hover:bg-activeLink">
                    <Icon icon="mingcute:download-line" class="text-3xl" />
                    <span class="mt-1">Archives</span>
                </router-link>
            </div>
            <button class="mt-auto flex items-center justify-center gap-x-2" @click="logout">
                <Icon icon="mdi-light:logout" class="text-4xl" />
                Logout
            </button>
        </nav>
    </aside>
</template>

<script setup>
import { defineEmits, ref } from 'vue'
import { useAuthStore } from '../store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const emit = defineEmits(['toggleSidebar'])

const recordsDropdown = ref(false)
const recordsDropdownIcon = ref('iconamoon:arrow-up-2-duotone')


const changeIcon = () => {
    if(recordsDropdown.value) return recordsDropdownIcon.value = 'iconamoon:arrow-up-2-duotone'
    recordsDropdownIcon.value = 'iconamoon:arrow-down-2-duotone'
}

const toggleSidebar = () => {
    emit('toggleSidebar')
}

const logout = () => {
    authStore.logout()
    router.push('/')
}
</script>

<style scoped>
.router-link-active {
    background-color: rgba(255, 255, 255, 0.50)
}
</style>