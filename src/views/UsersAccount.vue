<template>
    <section class="h-[94dvh] overflow-auto font-poppins py-10 px-5 lg:px-10 bg-gray-100">
        <div class="lg:flex lg:justify-between space-y-3 lg:space-y-0">
            <div class="bg-white w-fit flex items-center px-3 rounded shadow">
                <input type="text" placeholder="Search" class="bg-transparent h-8 lg:h-5 focus:outline-none">
                <Icon icon="iconoir:search" />
            </div>
            <div class="flex items-center gap-x-3">
                <select class="rounded h-8 shadow">
                    <option>10-23-2023</option>
                    <option>10-23-2024</option>
                    <option>10-23-2025</option>
                    <option>10-23-2026</option>
                </select>
                <button class="bg-custom-primary text-white p-2 rounded-md shadow hover:bg-red-950 flex items-center gap-x-1">
                    <Icon icon="typcn:user-add-outline" />
                    Add
                </button>
                <button class="bg-custom-primary text-white p-2 rounded-md shadow hover:bg-red-950 flex items-center gap-x-1">
                    <Icon icon="ph:export" />
                    Export
                </button>
            </div>
        </div>
        <!-- table -->
        <div class="w-full mt-12 flex flex-col gap-y-5">
            <div class="w-full overflow-x-auto  rounded-md">
                <table class="w-[150dvw] lg:w-full border-collapse">
                    <thead class="bg-custom-primary text-white md:h-10 font-manrope font-extralight tracking-wide">
                        <tr class="w-full">
                            <th class="md:w-1/12">ID</th>
                            <th class="md:w-2/12">Full Name</th>
                            <th class="md:w-2/12">Email</th>
                            <th class="md:w-2/12">Phone Number</th>
                            <th class="md:w-2/12">Address</th>
                            <th class="md:w-1/12">Gender</th>
                            <th class="md:w-1/12">Action</th>
                        </tr>
                    </thead>
                    <tbody  v-if="!noUsers" class="bg-white text-center">
                        <tr v-for="user in paginatedUsers" :key="user.id" class="border-b border-gray-500">
                            <td class="md:p-3">{{ user._id }}</td>
                            <td>{{ user.name }}</td>
                            <td>{{ user.email }}</td>
                            <td>{{ user.contactNumber }}</td>
                            <td>{{ user.address }}</td>
                            <td>{{ user.gender }}</td>
                            <td>
                                <div class="flex justify-center w-full gap-x-2">
                                    <Icon icon="iconamoon:edit-fill" class="text-2xl text-gray-900 hover:text-gray-700" />
                                    <Icon icon="mdi:trash" class="text-2xl text-red-500 hover:text-red-700" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody  v-else class="bg-white text-center">
                        <tr class="border-b border-gray-500">
                            <td class="md:p-3" colspan="8">No users available</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- pagination -->
            <div class="flex gap-x-2 font-manrope ml-auto">
                <button class="bg-custom-primary text-white w-6 aspect-square flex justify-center items-center rounded-full" @click="prevPage()" :disabled="currentPage == 1">
                    <Icon icon="fe-arrow-left" />
                </button>
                <p>Page {{ currentPage }} of {{ totalPages }}</p>
                <button class="bg-custom-primary text-white w-6 aspect-square flex justify-center items-center rounded-full" @click="nextPage()" :disabled="currentPage == totalPages">
                    <Icon icon="fe-arrow-right" />
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import axios from 'axios'
const serverUrl = import.meta.env.VITE_SERVER_URL

const users = ref(null)
const noUsers = ref(false)

const getAllUsers = async () => {
    try {
        const res = await axios.get(`${serverUrl}/get-all-users`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if(res.data === 'no users found') return noUsers.value = true
        
        users.value = res.data
    } catch (error) {
        console.log(error)
    }
}

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = computed(() => Math.ceil(users.value?.length / itemsPerPage.value))

const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return users.value?.slice(start, end)
})

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

onMounted(() => {
    getAllUsers()
})
</script>

<style>

</style>