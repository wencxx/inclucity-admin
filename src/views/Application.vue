<template>
    <section class="h-[94dvh] overflow-auto font-poppins py-10 px-5 lg:px-10 bg-gray-100">
        <div class="lg:flex lg:justify-between space-y-3 lg:space-y-0">
            <div class="bg-white h-10 w-fit flex items-center px-3 rounded shadow">
                <input type="text" placeholder="Search" class="bg-transparent h-full lg:h-5 focus:outline-none">
                <Icon icon="iconoir:search" />
            </div>
            <div class="flex items-center gap-x-3 h-10">
                <button class="bg-custom-primary h-full text-white p-2 rounded-md shadow hover:bg-red-950 flex items-center gap-x-1">
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
                            <th class="md:w-1/12 text-xs">APPLICATION NUMBER</th>
                            <th class="md:w-2/12 text-sm">Full Name</th>
                            <th class="md:w-2/12 text-sm">EMAIL</th>
                            <th class="md:w-2/12 text-sm">AGE</th>
                            <th class="md:w-2/12 text-sm">gender</th>
                            <th class="md:w-2/12 text-sm">BARANGAY</th>
                            <th class="md:w-1/12 text-sm">DISABILITY</th>
                            <th class="md:w-1/12 text-xs">APPLICATION DATE</th> 
                            <th class="md:w-2/12 text-sm">STATUS</th>
                            <th class="md:w-2/12 text-sm">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody v-if="!noApplicants" class="bg-white text-center">
                        <tr v-for="applicant in paginatedApplicants" :key="applicant.id" class="border-b border-gray-500">
                            <td class="md:py-3 text-sm">{{ convertApplicationNum(applicant.applicationNumber) }}</td>
                            <td class="text-sm">{{ applicant.firstName }} {{ applicant.middleName }} {{ applicant.lastName }}</td>
                            <td class="text-sm">{{ applicant.user?.email }}</td>
                            <td class="text-sm">{{ applicant.user?.age }}</td>
                            <td class="text-sm">{{ applicant.gender }}</td>
                            <td class="text-sm">{{ applicant.barangay }}</td>
                            <td class="text-sm">{{ applicant.typeOfDisability }}</td>
                            <td class="text-sm">{{ applicant.dateApplied?.split('T')[0] }}</td>
                            <td class="text-sm">
                                <div class="bg-orange-200 py-1 text-orange-700 text-sm px-3 rounded-md w-fit mx-2">
                                    {{ applicant.status }}
                                </div>
                            </td>
                            <td>
                                <div class="flex justify-center gap-x-1">
                                    <Icon icon="iconoir:eye-solid" class="text-lg" />
                                    <Icon icon="octicon:check-16" class="text-lg text-green-500" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else class="bg-white text-center">
                        <tr class="border-b border-gray-500">
                            <td class="md:py-3" colspan="9">No PWD Applications</td>
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
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
const serverUrl = import.meta.env.VITE_SERVER_URL

const router = useRouter()
const route = useRoute()

const applicants = ref(null)

const noApplicants = ref(false)

const getPendingApplications = async () => {
    try {
        const res = await axios.get(`${serverUrl}/get-all-pending-applications`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if(res.data === 'no data') return noApplicants.value = true
        
        applicants.value = res.data
    } catch (error) {
        console.log(error)
    }
}

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = computed(() => Math.ceil(applicants.value?.length / itemsPerPage.value))

const paginatedApplicants = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return applicants.value?.slice(start, end)
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

const convertApplicationNum = (num) => {
    const convertedToString = num?.toString()
    if(convertedToString?.length === 1) return `0000${num}`
    if(convertedToString?.length === 2) return `000${num}`
    if(convertedToString?.length === 3) return `00${num}`
    if(convertedToString?.length === 4) return `0${num}`
    if(convertedToString?.length === 5) return num
}

onMounted(() => {
    getPendingApplications()
})
</script>

<style>

</style>