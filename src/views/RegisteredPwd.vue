<template>
    <section class="h-[94dvh] overflow-auto font-poppins py-10 px-5 lg:px-10 bg-gray-100">
        <div class="lg:flex lg:justify-between space-y-3 lg:space-y-0">
            <div class="flex items-center w-1/6 h-10 relative cursor-default">
                <h1 class="z-10 rounded w-1/2 h-full flex items-center justify-center text-white" :class="{ '!text-black shadow': route.query.page === 'expired' }" @click="toggleExpired('active')">Active</h1>
                <h1 class="z-10 rounded w-1/2 h-full flex items-center justify-center shadow" :class="{ 'text-white shadow-none': route.query.page === 'expired' }" @click="toggleExpired('expired')">Expired</h1>
                <div class="bg-custom-primary rounded w-1/2 h-full left-0 absolute transition-all" :class="{ '!left-1/2': route.query.page === 'expired' }"></div>
            </div>
            <div class="flex items-center gap-x-3 h-10">
                <div class="bg-white h-full w-fit flex items-center px-3 rounded shadow">
                    <input type="text" placeholder="Search" v-model="searchQuery" class="bg-transparent h-8 lg:h-5 focus:outline-none">
                    <Icon icon="iconoir:search" />
                </div>
                <button class="bg-custom-primary h-full text-white p-2 rounded-md shadow hover:bg-red-950 flex items-center gap-x-1" @click="downloadCSV">
                    <Icon icon="ph:export" />
                    Export
                </button>
            </div>
        </div>
        <!-- table -->
        <div v-if="route.query.page === 'expired'" class="w-full mt-12 flex flex-col gap-y-5">
            <div class="w-full overflow-x-auto  rounded-md">
                <table class="w-[150dvw] lg:w-full border-collapse" id="expired">
                    <thead class="bg-custom-primary text-white md:h-10 font-manrope font-extralight tracking-wide">
                        <tr class="w-full">
                            <th class="text-xs">CONTROL NUMBER</th>
                            <th class="text-sm">Full Name</th>
                            <th class="text-sm">EMAIL</th>
                            <th class="text-sm">AGE</th>
                            <th class="text-sm">gender</th>
                            <th class="text-sm">BARANGAY</th>
                            <th class="text-sm">DISABILITY</th>
                            <th class="text-xs">DATE REGISTERED</th>
                            <th class="text-sm">STATUS</th>
                        </tr>
                    </thead>
                    <tbody v-if="!noExpiredApplicants" class="bg-white text-center">
                        <tr v-if="paginatedExpiredApplicants.length > 0" v-for="applicant in paginatedExpiredApplicants" :key="applicant.id" class="border-b border-gray-500">
                            <td class="md:py-3 text-sm">{{ convertApplicationNum(applicant.applicationNumber) }}</td>
                            <td class="text-sm">{{ applicant.firstName }} {{ applicant.middleName }} {{ applicant.lastName }}</td>
                            <td class="text-sm">{{ applicant.user?.email }}</td>
                            <td class="text-sm">{{ applicant.user?.age }}</td>
                            <td class="text-sm">{{ applicant.gender }}</td>
                            <td class="text-sm">{{ applicant.barangay }}</td>
                            <td class="text-sm">{{ applicant.typeOfDisability }}</td>
                            <td class="text-sm">{{ applicant.dateApplied?.split('T')[0] }}</td>
                            <td class="text-sm">
                                <div class="bg-red-200 py-1 text-red-700 text-sm px-3 rounded-md w-fit mx-auto">
                                    {{ applicant.status }}
                                </div>
                            </td>
                        </tr>
                        <tr v-else class="border-b border-gray-500 text-center">
                            <td colspan="9" class="text-sm py-2">Can't find applicant</td>
                        </tr>
                    </tbody>
                    <tbody v-else class="bg-white text-center">
                        <tr class="border-b border-gray-500">
                            <td class="md:py-3" colspan="9">No expired PWD</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- pagination -->
            <div class="flex gap-x-2 font-manrope ml-auto">
                <button class="bg-custom-primary text-white w-6 aspect-square flex justify-center items-center rounded-full" @click="expiredPrevPage()" :disabled="expiredCurrentPage == 1">
                    <Icon icon="fe-arrow-left" />
                </button>
                <p>Page {{ expiredCurrentPage }} of {{ expiredTotalPages }}</p>
                <button class="bg-custom-primary text-white w-6 aspect-square flex justify-center items-center rounded-full" @click="expiredNextPage()" :disabled="expiredCurrentPage == expiredTotalPages">
                    <Icon icon="fe-arrow-right" />
                </button>
            </div>
        </div>
        <div v-else class="w-full mt-12 flex flex-col gap-y-5">
            <div class="w-full overflow-x-auto  rounded-md">
                <table class="w-[150dvw] lg:w-full border-collapse" id="active">
                    <thead class="bg-custom-primary text-white md:h-10 font-manrope font-extralight tracking-wide">
                        <tr class="w-full">
                            <th class="text-xs">CONTROL NUMBER</th>
                            <th class="text-sm">Full Name</th>
                            <th class="text-sm">EMAIL</th>
                            <th class="text-sm">AGE</th>
                            <th class="text-sm">gender</th>
                            <th class="text-sm">BARANGAY</th>
                            <th class="text-sm">DISABILITY</th>
                            <th class="text-xs">DATE REGISTERED</th>
                            <th class="text-sm">STATUS</th>
                            <th class="text-sm">Action</th>
                        </tr>
                    </thead>
                    <tbody v-if="!noApplicants" class="bg-white text-center">
                        <tr v-if="paginatedApplicants.length > 0" v-for="applicant in paginatedApplicants" :key="applicant._id" class="border-b border-gray-500">
                            <td class="md:py-3 text-sm">{{ convertApplicationNum(applicant.applicationNumber) }}</td>
                            <td class="text-sm">{{ applicant.firstName }} {{ applicant.middleName }} {{ applicant.lastName }}</td>
                            <td class="text-sm">{{ applicant.user?.email }}</td>
                            <td class="text-sm">{{ applicant.user?.age }}</td>
                            <td class="text-sm">{{ applicant.gender }}</td>
                            <td class="text-sm">{{ applicant.barangay }}</td>
                            <td class="text-sm">{{ applicant.typeOfDisability }}</td>
                            <td class="text-sm">{{ applicant.dateApplied?.split('T')[0] }}</td>
                            <td class="text-sm">
                                <div class="bg-orange-200 py-1 text-orange-700 text-sm px-3 rounded-md w-fit mx-auto">
                                    {{ applicant.status }}
                                </div>
                            </td>
                            <td class="text-sm">
                                <button class="bg-green-200 py-1 text-green-700 text-sm px-3 rounded-md w-fit mx-auto" @click="releasedId(applicant._id)">Release ID</button>
                            </td>
                        </tr>
                        <tr v-else class="border-b border-gray-500 text-center">
                            <td colspan="10" class="text-sm py-2">Can't find applicant</td>
                        </tr>
                    </tbody>
                    <tbody v-else class="bg-white text-center">
                        <tr class="border-b border-gray-500">
                            <td class="md:py-3" colspan="10">No registered PWD</td>
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

const searchQuery = ref('');

const filteredApplicants = computed(() => {
    if (!searchQuery.value) return applicants.value || [];
    return applicants.value.filter(applicant => {
        const fullName = `${applicant.firstName} ${applicant.middleName} ${applicant.lastName}`.toLowerCase();
        const barangay = applicant.barangay.toLowerCase();
        const gender = applicant.gender.toLowerCase();
        const disability = applicant.typeOfDisability.toLowerCase();
        return fullName.includes(searchQuery.value.toLowerCase()) || barangay.includes(searchQuery.value.toLowerCase()) || gender.includes(searchQuery.value.toLowerCase()) || disability.includes(searchQuery.value.toLowerCase());
    });
});

const getApprovedApplications = async () => {
    try {
        const res = await axios.get(`${serverUrl}/get-all-approved-applications`,{
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
    return filteredApplicants.value?.slice(start, end)
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

const expiredApplicants = ref(null)
const noExpiredApplicants = ref(false)

const getExpiredApplications = async () => {
    try {
        const res = await axios.get(`${serverUrl}/get-all-expired-applications`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if(res.data === 'no data') return noExpiredApplicants.value = true
        
        expiredApplicants.value = res.data
    } catch (error) {
        console.log(error)
    }
}

const expiredCurrentPage = ref(1)
const expiredItemsPerPage = ref(10)
const expiredTotalPages = computed(() => Math.ceil(expiredApplicants.value?.length / expiredItemsPerPage.value))


const filteredExpiredApplicants = computed(() => {
    if (!searchQuery.value) return expiredApplicants.value || [];
    return expiredApplicants.value.filter(applicant => {
        const fullName = `${applicant.firstName} ${applicant.middleName} ${applicant.lastName}`.toLowerCase();
        const barangay = applicant.barangay.toLowerCase();
        const gender = applicant.gender.toLowerCase();
        const disability = applicant.typeOfDisability.toLowerCase();
        return fullName.includes(searchQuery.value.toLowerCase()) || barangay.includes(searchQuery.value.toLowerCase()) || gender.includes(searchQuery.value.toLowerCase()) || disability.includes(searchQuery.value.toLowerCase());
    });
});

const paginatedExpiredApplicants = computed(() => {
    const start = (expiredCurrentPage.value - 1) * expiredItemsPerPage.value
    const end = start + expiredItemsPerPage.value
    return filteredExpiredApplicants.value?.slice(start, end)
})

const expiredPrevPage = () => {
  if (expiredCurrentPage.value > 1) {
    expiredCurrentPage.value--
  }
}

const expiredNextPage = () => {
  if (expiredCurrentPage.value < expiredTotalPages.value) {
    expiredCurrentPage.value++
  }
}

const toggleExpired = (page) => {

    if(page === 'expired'){
        router.push({
            query: {
                page: 'expired'
            }
        })
    }else{
        router.back()
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


const releasedId = async (appId) => {
    try {
        const res = await axios.patch(`${serverUrl}/release-id/${appId}`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        console.log(res.data)
    } catch (error) {
        console.log(error)
    }
}

const downloadCSV = () => {
    if(route.query.page === 'expired'){
            let table = document.getElementById('expired');
            let rows = table.querySelectorAll('tr');
            let csvContent = '';

            rows.forEach(row => {
                let rowData = [];
                let cols = row.querySelectorAll('td, th');
                for (let i = 0; i < cols.length - 1; i++) {
                    rowData.push(cols[i].innerText);
                }
                csvContent += rowData.join(',') + '\n';
            });

            let blob = new Blob([csvContent], { type: 'text/csv' });
            let link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'table.csv';
            link.click();
    }else{
        let table = document.getElementById('active');
        let rows = table.querySelectorAll('tr');
        let csvContent = '';

        rows.forEach(row => {
            let rowData = [];
            let cols = row.querySelectorAll('td, th');
            for (let i = 0; i < cols.length - 1; i++) {
                rowData.push(cols[i].innerText);
            }
            csvContent += rowData.join(',') + '\n';
        });

        let blob = new Blob([csvContent], { type: 'text/csv' });
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'table.csv';
        link.click();
    }
}

onMounted(() => {
    getApprovedApplications()
    getExpiredApplications()
})
</script>

<style>

</style>