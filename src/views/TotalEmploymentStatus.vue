<template>
    <section class="h-[94dvh] overflow-auto font-poppins py-10 px-5 lg:px-10 bg-gray-100">
        <div class="lg:flex lg:justify-between space-y-3 lg:space-y-0">
            <div class="bg-white h-10 w-fit flex items-center px-3 rounded shadow">
                <input type="text" placeholder="Search" v-model="searchQuery" class="bg-transparent h-full lg:h-5 focus:outline-none">
                <Icon icon="iconoir:search" />
            </div>
            <div class="flex items-center gap-x-3 h-10">
                <!-- <button class="bg-custom-primary h-full text-white p-2 rounded-md shadow hover:bg-red-950 flex items-center gap-x-1" @click="downloadCSV">
                    <Icon icon="ph:export" />
                    Export
                </button> -->
                <select v-model="typeOfExport" @change="handleExportChange" class="px-2 bg-custom-primary text-white rounded h-full">
                    <option value="" disabled>Export</option>
                    <option>PDF</option>
                    <option>CSV</option>
                </select>
            </div>
        </div>
        <!-- table -->
        <div v-if="$route.query.page === 'summary'" class="w-full mt-12 flex flex-col gap-y-5">
            <div class="w-full overflow-x-auto  rounded-md">
                <table class="w-[150dvw] lg:w-full border-collapse" id="userTable">
                    <thead class="bg-custom-primary text-white md:h-10 font-manrope font-extralight tracking-wide">
                        <tr class="w-full">
                            <th class=" text-xs">Category</th>
                            <th class=" text-sm">Sub-Category</th>
                            <th class=" text-sm">Number of PWDs</th>
                            <th class=" text-sm">Percentage Of Total</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white text-center">
                        <tr class="border-b border-gray-500">
                            <td class="md:py-3 text-sm font-semibold">Total Number of PWDs</td>
                            <td class="text-sm"></td>
                            <td class="text-sm">{{ applicants?.length || 0 }}</td>
                            <td class="text-sm" v-if="applicants?.length > 0">100%</td>
                            <td class="text-sm" v-else>0%</td>
                        </tr>
                        <tr class="border-b border-gray-500">
                            <td class="md:py-3 text-sm font-semibold">Status Of Employment</td>
                            <td class="text-sm">Employed</td>
                            <td class="text-sm">{{ statusCount('employed') }}</td>
                            <td class="text-sm">{{ (statusCount('employed') / applicants?.length * 100 || 0 ) }}%</td>
                        </tr>
                        <tr class="border-b border-gray-500">
                            <td class="text-sm font-semibold"></td>
                            <td class="text-sm md:py-3 ">Unemployed</td>
                            <td class="text-sm">{{ statusCount('unemployed') }}</td>
                            <td class="text-sm">{{ (statusCount('unemployed') / applicants?.length * 100 || 0 ) }}%</td>
                        </tr>
                        <tr class="border-b border-gray-500">
                            <td class="text-sm font-semibold"></td>
                            <td class="text-sm md:py-3 ">Self-employed</td>
                            <td class="text-sm">{{ statusCount('self-employed') }}</td>
                            <td class="text-sm">{{ (statusCount('self-employed') / applicants?.length * 100 || 0 ) }}%</td>
                        </tr>
                        <tr class="border-b border-gray-500">
                            <td class="md:py-3 text-sm font-semibold">Type Of Employment</td>
                            <td class="text-sm">Employed</td>
                            <td class="text-sm">{{ statusCount('employed') }}</td>
                            <td class="text-sm">{{ (statusCount('employed') / applicants?.length * 100 || 0 ) }}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-else class="w-full mt-12 flex flex-col gap-y-5">
            <div class="w-full overflow-x-auto  rounded-md">
                <table class="w-[150dvw] lg:w-full border-collapse" id="userTable">
                    <thead class="bg-custom-primary text-white md:h-10 font-manrope font-extralight tracking-wide">
                        <tr class="w-full">
                            <th class=" text-xs">Control Number</th>
                            <th class=" text-sm">Full Name</th>
                            <th class=" text-sm">Gender</th>
                            <th class=" text-sm">Barangay</th>
                            <th class=" text-sm">Disability</th>
                            <th class=" text-sm">Status Of Employment</th>
                            <th class=" text-sm">Employment Type</th>
                        </tr>
                    </thead>
                    <tbody v-if="paginatedApplicants.length > 0" class="bg-white text-center">
                        <tr class="border-b border-gray-500" v-for="(applicant, index) in paginatedApplicants" :key="index">
                            <td class="md:py-3 text-sm font-semibold">{{ applicant.controlNumber }}</td>
                            <td class="text-sm">{{ applicant.firstName + ' ' + applicant.middleName + ' ' + applicant.lastName }}</td>
                            <td class="text-sm">{{ applicant.gender }}</td>
                            <td class="text-sm">{{ applicant.barangay }}</td>
                            <td class="text-sm">{{ applicant.typeOfDisability }}</td>
                            <td class="text-sm">{{ applicant.statusOfEmployment }}</td>
                            <td class="text-sm">
                                <span v-if="applicant.statusOfEmployment !== 'unemployed'">{{ applicant.typeOfEmployment }}</span>
                                <span v-else>---</span>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else class="bg-white text-center">
                        <tr class="border-b border-gray-500">
                            <td colspan="7" class="text-sm py-3">No applicants to show</td>
                        </tr>
                    </tbody>
                </table>
            </div>
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
        <div class="rounded overflow-hidden w-4/12 mt-10">
            <button :class="{ '!bg-custom-primary text-white': $route.query.page !== 'summary' }" class="bg-white py-2 w-1/2" @click="changeTable('retrieve')">Retrieved Data</button>
            <button :class="{ '!bg-custom-primary text-white': $route.query.page === 'summary' }" class="bg-white py-2 w-1/2 rounded" @click="changeTable('summary')">Summary</button>
        </div>

        <!-- bg-custom-primary text-white -->
    </section>
</template>

<script setup>
import { computed, onMounted, ref, useId } from "vue";
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import * as mammoth from 'mammoth'
import moment from 'moment'
import { useAuthStore } from '../store/index'
const serverUrl = import.meta.env.VITE_SERVER_URL

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const router = useRouter()
const route = useRoute()

const applicants = ref(null)
const noApplicants = ref(false)

const tableToShow = ref('')

const changeTable = (type) => {
    if(type === 'summary'){
        router.push({
            query: {
                page: 'summary'
            }
        })
        tableToShow.value = type
    }else{
         router.push({
            query: {}
        })
        tableToShow.value = type
    }
}

const searchQuery = ref('');

const filteredApplicants = computed(() => {
    if (!searchQuery.value) return applicants.value || [];
    return applicants.value.filter(applicant => {
        const fullName = `${applicant.firstName} ${applicant.middleName} ${applicant.lastName}`.toLowerCase();
        const controlNumber = applicant.controlNumber.toLowerCase();
        const barangay = applicant.barangay.toLowerCase();
        const gender = applicant.gender.toLowerCase();
        const statusOfEmployment = applicant.statusOfEmployment.toLowerCase();
        const typeOfEmployment = applicant.typeOfEmployment.toLowerCase();
        const typeOfDisability = applicant.typeOfDisability.toLowerCase();
        return fullName.includes(searchQuery.value.toLowerCase()) || barangay.includes(searchQuery.value.toLowerCase()) || gender === searchQuery.value.toLowerCase() || statusOfEmployment == searchQuery.value.toLowerCase() || typeOfEmployment.includes(searchQuery.value.toLowerCase()) || typeOfDisability.includes(searchQuery.value.toLowerCase()) || controlNumber.includes(searchQuery.value.toLowerCase());
    });
});

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = computed(() => Math.ceil(applicants.value?.length / itemsPerPage.value))

const paginatedApplicants = computed(() => {
    // Sort applicants by barangay in alphabetical order
    const sortedApplicants = filteredApplicants.value.slice().sort((a, b) => {
        if (a.barangay < b.barangay) return -1;
        if (a.barangay > b.barangay) return 1;
        return 0;
    });

    // Apply pagination
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return sortedApplicants.slice(start, end);
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

const statusCount = (status) => {
    if(!applicants.value) return 0

    const female = applicants.value?.filter(applicant => applicant.statusOfEmployment === status)

    const count = female.length

    return count
}

const typeCount = (status) => {
    if(!applicants.value) return 0

    const female = applicants.value?.filter(applicant => applicant.statusOfEmployment === status)

    const count = female.length

    return count
}

const typeOfExport = ref('')

const handleExportChange = () => {
    if(typeOfExport.value === 'CSV'){
        downloadCSV()
    }else{
        downloadPDF()
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
    link.download = 'Table.csv';
    link.click();
}

const downloadPDF = () => {
    const pdf = new jsPDF();
    const table = document.getElementById("userTable");
    const headerImage = "../../header.png"; 
    const today = new Date()

    // Function to add footer
    const addFooter = (pdf, pageNumber) => {
        pdf.setFontSize(10);
        pdf.text("Approved by:", 10, pdf.internal.pageSize.height - 50);
        pdf.setFontSize(12);
        pdf.text("Lolita SP. Santos, RSW", 50, pdf.internal.pageSize.height - 50);
        pdf.setFontSize(10);
        pdf.text("____________________________________", 40, pdf.internal.pageSize.height - 49);
        pdf.setFontSize(10);
        pdf.text("City Social Welfare and Development Officer", 40, pdf.internal.pageSize.height - 44);
        pdf.setFontSize(10);
        pdf.text(`Prepared By: Admin - ${user.value.name}`, 10, pdf.internal.pageSize.height - 20);
        pdf.setFontSize(10);
        pdf.text(`Date: ${moment(today).format('ll')}`, 10, pdf.internal.pageSize.height - 15);
        pdf.setFontSize(10);
        pdf.text(`Time: ${moment(today).format('LT')}`, 10, pdf.internal.pageSize.height - 10);
        pdf.text(String(pageNumber), pdf.internal.pageSize.width - 10, pdf.internal.pageSize.height - 10, { align: "right" });
    };

    pdf.addImage(headerImage, 'PNG', 10, 0, 190, 35);

    pdf.setFontSize(10);
    pdf.text("PWD Employment Status", 90, 43);
    pdf.setFontSize(10);
    pdf.text("This table contains a detailed list of the PWDs' Employment Status. The table contains their Control Number, Full name, Gender, Barangay, Disability, Status of Employment and its types..", 10, 117, { maxWidth: 190 });

    html2canvas(table).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 190;
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 48; 
        let pageNumber = 1;

        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        addFooter(pdf, pageNumber);
        heightLeft -= pageHeight - 40; 

        while (heightLeft >= 0) {
            pdf.addPage(); 
            pageNumber++;
            pdf.addImage(headerImage, 'PNG', 10, 10, 190, 30);
            position = heightLeft - imgHeight + 40; 
            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight); 
            addFooter(pdf, pageNumber); 
            heightLeft -= pageHeight - 40;
        }

        pdf.save("Total-employment-status.pdf");
    });

    typeOfExport.value = ''
};

onMounted(() => {
    getApprovedApplications()
    authStore.getUser()
})
</script>

<style>

</style>
