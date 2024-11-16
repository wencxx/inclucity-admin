<template>
    <aside class="absolute left-0 top-0 lg:relative lg:block  h-screen bg-custom-primary lg:py-10 flex flex-col gap-y-5">
        <Icon icon="mdi:close" class="text-3xl text-white ml-auto mr-2 mt-2 lg:hidden" @click="toggleSidebar" />
        <h1 class="font-poppins text-3xl text-center text-white">IncluCity</h1>
        <nav class="flex flex-col font-poppins text-white gap-y-3 h-full pb-10">
            <p class="pl-5 mt-5">Pages</p>
            <div class="flex flex-col gap-y-1">
                <router-link :to="{ name: 'dashboard' }" class="px-5 flex items-center gap-x-3 py-2 font-medium hover:bg-activeLink">
                    <Icon icon="ph:house-light" class="text-3xl" />
                    <span class="mt-1">Dashboard</span>
                </router-link>
                <router-link :to="{ name: 'user Accounts' }" class="px-5 flex items-center gap-x-3 py-2 font-medium hover:bg-activeLink">
                    <Icon icon="ion:person-outline" class="text-3xl" />
                    <span class="mt-1">Registered Users</span>
                </router-link>
                <div class="px-5 flex items-center gap-x-3 py-2 font-medium hover:bg-activeLink cursor-pointer" @click="recordsDropdown = !recordsDropdown, changeIcon()">
                    <Icon icon="gg:notes" class="text-3xl" />
                    <span class="mt-1">Records</span>
                    <Icon :icon="recordsDropdownIcon" class="text-3xl ml-auto" />
                </div>
                <div class="bg-gray-600 -mt-1" v-if="recordsDropdown">
                    <router-link :to="{ name: 'PWD Per Barangay' }" class="px-10 flex items-center gap-x-5 py-2 font-medium hover:bg-activeLink">
                        <div class="h-6 w-[2px] bg-white"></div>
                        <span class="mt-1">PWD per Barangay</span>
                    </router-link>
                    <!-- <router-link :to="{ name: 'total number of pwd' }" class="px-10 flex items-center gap-x-5 py-2 font-medium hover:bg-activeLink">
                        <div class="h-6 w-[2px] bg-white"></div>
                        <span class="mt-1">Total Number of PWD</span>
                    </router-link> -->
                    <router-link :to="{ name: 'total employment status' }" class="px-10 flex items-center gap-x-5 py-2 font-medium hover:bg-activeLink">
                        <div class="h-6 w-[2px] bg-white"></div>
                        <span class="mt-1">PWD Employment Status</span>
                    </router-link>
                </div>
                <div class="px-5 flex items-center gap-x-3 py-2 font-medium hover:bg-activeLink cursor-pointer" @click="applicationsDropdown = !applicationsDropdown, changeIconApplications()">
                    <Icon icon="gg:notes" class="text-3xl" />
                    <span class="mt-1">Applications</span>
                    <Icon :icon="applicationsDropdownIcon" class="text-3xl ml-auto" />
                </div>
                <div class="bg-gray-600 -mt-1" v-if="applicationsDropdown">
                    <router-link :to="{ name: 'PWD ID application' }" class="px-5 flex items-center gap-x-3 py-2 font-medium hover:bg-activeLink relative">
                    <Icon icon="mage:edit" class="text-3xl" />
                    <span class="mt-1">PWD ID Application</span>
                    <div v-if="applicantsCount > 0" class="bg-red-500 w-5 aspect-square flex items-center justify-center absolute top-1 left-56 rounded-full">
                        <p class="text-xs">{{ applicantsCount }}</p>
                    </div>
                    </router-link>
                    <router-link :to="{ name: 'PWD ID renewal' }" class="px-5 flex items-center gap-x-3 py-2 font-medium hover:bg-activeLink relative">
                        <Icon icon="mage:edit" class="text-3xl" />
                        <span class="mt-1">PWD ID Renewal</span>
                        <div v-if="renewalCount > 0" class="bg-red-500 w-5 aspect-square flex items-center justify-center absolute top-1 left-56 rounded-full">
                            <p class="text-xs">{{ renewalCount }}</p>
                        </div>
                    </router-link>
                    <router-link :to="{ name: 'registered PWD' }" class="px-5 flex items-center gap-x-3 py-2 font-medium hover:bg-activeLink">
                        <Icon icon="mingcute:group-3-line" class="text-3xl" />
                        <span class="mt-1">Registered PWD</span>
                    </router-link>
                    <!-- <router-link :to="{ name: 'released ID' }" class="px-5 flex items-center gap-x-3 py-2 font-medium hover:bg-activeLink">
                        <Icon icon="hugeicons:id-verified" class="text-3xl" />
                        <span class="mt-1">Released ID</span>
                    </router-link> -->
                    <router-link :to="{ name: 'rejected Applications' }" class="px-5 flex items-center gap-x-3 py-2 font-medium hover:bg-activeLink">
                        <Icon icon="mdi:person-remove-outline" class="text-3xl" />
                        <span class="mt-1">Rejected Applications</span>
                    </router-link>
                </div>
                <router-link :to="{ name: 'announcement' }" class="px-5 flex items-center gap-x-3 py-2 font-medium hover:bg-activeLink">
                    <Icon icon="ri:telegram-2-line" class="text-3xl" />
                    <span class="mt-1">Announcement</span>
                </router-link>
                <router-link :to="{ name: 'disabilities' }" class="px-5 flex items-center gap-x-3 py-2 font-medium hover:bg-activeLink">
                    <Icon icon="hugeicons:disability-01" class="text-3xl" />
                    <span class="mt-1">Disabilities</span>
                </router-link>
                <div class="px-5 flex items-center gap-x-3 py-2 font-medium hover:bg-activeLink cursor-pointer" @click="archivesDropdown = !archivesDropdown, changeIconArchives()">
                    <Icon icon="fluent:archive-16-filled" class="text-3xl" />
                    <span class="mt-1">Archives</span>
                    <Icon :icon="archivesDropdownIcon" class="text-3xl ml-auto" />
                </div>
                <div class="bg-gray-600 -mt-1" v-if="archivesDropdown">
                    <router-link :to="{ name: 'deleted announcement' }" class="px-10 flex items-center gap-x-5 py-2 font-medium hover:bg-activeLink">
                        <div class="h-6 w-[2px] bg-white"></div>
                        <span class="mt-1">Archived annoucement</span>
                    </router-link>
                    <router-link :to="{ name: 'deleted User Accounts' }" class="px-10 flex items-center gap-x-5 py-2 font-medium hover:bg-activeLink">
                        <div class="h-6 w-[2px] bg-white"></div>
                        <span class="mt-1">Archived users</span>
                    </router-link>
                </div>
            </div>
            <button class="mt-auto flex items-center justify-center gap-x-2" @click="willLogout = true">
                <Icon icon="mdi-light:logout" class="text-4xl" />
                Logout
            </button>

            <!-- log out confirmation -->
            <div v-if="willLogout" class="fixed top-0 left-0 h-screen w-screen bg-black/10 flex items-center justify-center">
                <div class="bg-white rounded shadow w-80 h-56 flex flex-col gap-y-10 items-center justify-center">
                    <div class="flex flex-col items-center gap-y-2">
                        <Icon icon="material-symbols-light:warning" class="text-5xl text-orange-500" />
                        <h1 class="font-semibold text-black">Are you sure you want to logout?</h1>
                    </div>
                    <div class="flex gap-x-5">
                        <button @click="willLogout = false" class="w-20 border border-custom-primary text-custom-primary rounded">No</button>
                        <button @click="logout" class="w-20 border border-transparent bg-custom-primary text-white rounded">Yes</button>
                    </div>
                </div>
            </div>
        </nav>
    </aside>
</template>

<script setup>
import { defineEmits, onMounted, ref } from 'vue'
import { useAuthStore } from '../store'
import { useRouter } from 'vue-router'
const serverUrl = import.meta.env.VITE_SERVER_URL
import axios from 'axios'

const willLogout = ref(false)

const authStore = useAuthStore()
const router = useRouter()

const emit = defineEmits(['toggleSidebar'])

const recordsDropdown = ref(false)
const archivesDropdown = ref(false)
const applicationsDropdown = ref(false)
const archivesDropdownIcon = ref('iconamoon:arrow-down-2-duotone')
const recordsDropdownIcon = ref('iconamoon:arrow-down-2-duotone')
const applicationsDropdownIcon = ref('iconamoon:arrow-down-2-duotone')


const changeIcon = () => {
    if(recordsDropdown.value) return recordsDropdownIcon.value = 'iconamoon:arrow-up-2-duotone'
    recordsDropdownIcon.value = 'iconamoon:arrow-down-2-duotone'
}

const changeIconArchives = () => {
    if(archivesDropdown.value) return archivesDropdownIcon.value = 'iconamoon:arrow-up-2-duotone'
    archivesDropdownIcon.value = 'iconamoon:arrow-down-2-duotone'
}

const changeIconApplications = () => {
    if(applicationsDropdown.value) return applicationsDropdownIcon.value = 'iconamoon:arrow-up-2-duotone'
    applicationsDropdownIcon.value = 'iconamoon:arrow-down-2-duotone'
}

const toggleSidebar = () => {
    emit('toggleSidebar')
}

const logout = () => {
    authStore.logout()
    router.push('/')
}

const applicantsCount = ref(0)

const getPendingApplications = async () => {
    try {
        const res = await axios.get(`${serverUrl}/get-all-pending-applications`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if(res.data === 'no data') return


        applicantsCount.value = res.data.length
    } catch (error) {
        console.log(error)
    }
}

const renewalCount = ref(0)

const getPendingRenewal = async () => {
    try {
        const res = await axios.get(`${serverUrl}/get-all-pending-renewal`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if(res.data === 'no data') return
        
        renewalCount.value = res.data.length
    } catch (error) {
        console.log(error)
    }
}

onMounted(() => {
    getPendingApplications()
    getPendingRenewal()

    setInterval(() => {
        getPendingApplications()
        getPendingRenewal()
    }, 3000)
})
</script>

<style scoped>
.router-link-active {
    background-color: rgba(255, 255, 255, 0.50)
}
</style>