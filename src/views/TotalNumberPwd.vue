<template>
    <section class="h-[94dvh] overflow-auto font-poppins py-10 px-5 lg:px-10 bg-gray-100">
        <div class="lg:flex lg:justify-between space-y-3 lg:space-y-0">
            <div class="bg-white h-10 w-fit flex items-center px-3 rounded shadow">
                <input type="text" placeholder="Search" v-model="searchQuery" class="bg-transparent h-full lg:h-5 focus:outline-none">
                <Icon icon="iconoir:search" />
            </div>
            <div class="flex items-center gap-x-3 h-10">
                <button class="bg-custom-primary h-full text-white p-2 rounded-md shadow hover:bg-red-950 flex items-center gap-x-1" @click="downloadCSV">
                    <Icon icon="ph:export" />
                    Export
                </button>
            </div>
        </div>
        <!-- table -->
        <div class="w-full mt-12 flex flex-col gap-y-5">
            <div class="w-full overflow-x-auto  rounded-md">
                <table class="w-[150dvw] lg:w-full border-collapse" id="userTable">
                    <thead class="bg-custom-primary text-white md:h-10 font-manrope font-extralight tracking-wide">
                        <tr class="w-full">
                            <th class=" text-xs">Year</th>
                            <th class=" text-sm">Male</th>
                            <th class=" text-sm">Female</th>
                            <th class=" text-sm">Total</th>
                        </tr>
                    </thead>
                    <tbody v-if="!noBarangay" class="bg-white text-center">
                        <tr v-if="paginatedApplicants.length > 0" v-for="barangay in paginatedApplicants" :key="barangay._id" class="border-b border-gray-500">
                            <td class="md:py-3 text-sm">{{ barangay.year }}</td>
                            <td class="text-sm">{{ barangay.male }}</td>
                            <td class="text-sm">{{ barangay.female }}</td>
                            <td class="text-sm">{{ barangay.female + barangay.male }}</td>
                        </tr>
                        <tr v-else> 
                            <td colspan="4">Cant find result</td>
                        </tr>
                    </tbody>
                    <tbody v-else class="bg-white text-center">
                        <tr class="border-b border-gray-500">
                            <td class="md:py-3" colspan="10">No PWD Applications</td>
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
import { computed, onMounted, ref, useId } from "vue";
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import * as mammoth from 'mammoth'
const serverUrl = import.meta.env.VITE_SERVER_URL

const router = useRouter()
const route = useRoute()

const barangay = ref([])
const noBarangay = ref(false)

const getGroupedBarangay = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/get-total-pwd`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if(res.data === 'no data'){
            noBarangay.value = true
            return
        }

        barangay.value = res.data
        console.log(res.data)
    } catch (error) {
        console.log(error.message)
    }
}

const searchQuery = ref('');

const filteredbarangay = computed(() => {
    if (!searchQuery.value) return barangay.value || [];
    return barangay.value.filter(barangay => {
        const barangaySearch = `${barangay.year}`.toLowerCase();
        return barangaySearch.includes(searchQuery.value.toLowerCase());
    });
});

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = computed(() => Math.ceil(barangay.value?.length / itemsPerPage.value))

const paginatedApplicants = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredbarangay.value.slice(start, end);
});

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

const downloadCSV = () => {
    let table = document.getElementById('userTable');
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

onMounted(() => {
    getGroupedBarangay()
})
</script>

<style>

</style>
