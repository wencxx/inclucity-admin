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
        <div  v-if="$route.query.page === 'summary'" class="w-full mt-12 flex flex-col gap-y-5">
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
                            <td class="md:py-3 text-sm font-semibold">Age Group</td>
                            <td class="text-sm">Children (0-17)</td>
                            <td class="text-sm">{{ childrenApplicants() }}</td>
                            <td class="text-sm">{{ (childrenApplicants() / applicants?.length * 100 || 0 ) }}%</td>
                        </tr>
                        <tr class="border-b border-gray-500">
                            <td class="text-sm"></td>
                            <td class="text-sm md:py-3 ">Adults (18-59)</td>
                            <td class="text-sm">{{ adultApplicants() }}</td>
                            <td class="text-sm">{{ (adultApplicants() / applicants?.length * 100 || 0 ) }}%</td>
                        </tr>
                        <tr class="border-b border-gray-500">
                            <td class="text-sm"></td>
                            <td class="text-sm md:py-3 ">Elderly (60+)</td>
                            <td class="text-sm">{{ elderApplicants() }}</td>
                            <td class="text-sm">{{ (elderApplicants() / applicants?.length * 100 || 0 ) }}%</td>
                        </tr>
                        <tr class="border-b border-gray-500">
                            <td class="md:py-3 text-sm font-semibold">Gender</td>
                            <td class="text-sm">Male</td>
                            <td class="text-sm">{{ genderCount('Male') }}</td>
                            <td class="text-sm">{{ (genderCount('Male') / applicants?.length * 100 || 0 ) }}%</td>
                        </tr>
                        <tr class="border-b border-gray-500">
                            <td class="text-sm"></td>
                            <td class="text-sm md:py-3 ">Female</td>
                            <td class="text-sm">{{ genderCount('Female') }}</td>
                            <td class="text-sm">{{ (genderCount('Female') / applicants?.length * 100 || 0 ) }}%</td>
                        </tr>
                        <tr class="border-b border-gray-500">
                            <td class="md:py-3 text-sm font-semibold">Type Of Disability</td>
                            <td class="text-sm">Deaf/Hard of hearing</td>
                            <td class="text-sm">{{ disabilityCount('Deaf/Hard of hearing') }}</td>
                            <td class="text-sm">{{ (disabilityCount('Deaf/Hard of hearing') / applicants?.length * 100 || 0 ) }}%</td>
                        </tr>
                        <tr class="border-b border-gray-500">
                            <td class="mtext-sm"></td>
                            <td class="text-sm md:py-3 ">Intellectual Disability</td>
                            <td class="text-sm">{{ disabilityCount('Intellectual Disability') }}</td>
                            <td class="text-sm">{{ (disabilityCount('Intellectual Disability') / applicants?.length * 100 || 0 ) }}%</td>
                        </tr>
                        <tr class="border-b border-gray-500">
                            <td class="mtext-sm"></td>
                            <td class="text-sm md:py-3 ">Learning Disability</td>
                            <td class="text-sm">{{ disabilityCount('Learning Disability') }}</td>
                            <td class="text-sm">{{ (disabilityCount('Learning Disability') / applicants?.length * 100 || 0 ) }}%</td>
                        </tr>
                        <tr class="border-b border-gray-500">
                            <td class="mtext-sm"></td>
                            <td class="text-sm md:py-3 ">Mental Disability</td>
                            <td class="text-sm">{{ disabilityCount('Mental Disability') }}</td>
                            <td class="text-sm">{{ (disabilityCount('Mental Disability') / applicants?.length * 100 || 0 ) }}%</td>
                        </tr>
                        <tr class="border-b border-gray-500">
                            <td class="mtext-sm"></td>
                            <td class="text-sm md:py-3 ">Physical Disability(Orthopedic)</td>
                            <td class="text-sm">{{ disabilityCount('Physical Disability(Orthopedic)') }}</td>
                            <td class="text-sm">{{ (disabilityCount('Physical Disability(Orthopedic)') / applicants?.length * 100 || 0 ) }}%</td>
                        </tr>
                        <tr class="border-b border-gray-500">
                            <td class="mtext-sm"></td>
                            <td class="text-sm md:py-3 ">Psychosocial Disability</td>
                            <td class="text-sm">{{ disabilityCount('Psychosocial Disability') }}</td>
                            <td class="text-sm">{{ (disabilityCount('Psychosocial Disability') / applicants?.length * 100 || 0 ) }}%</td>
                        </tr>
                        <tr class="border-b border-gray-500">
                            <td class="mtext-sm"></td>
                            <td class="text-sm md:py-3 ">Speach and Language Impairment</td>
                            <td class="text-sm">{{ disabilityCount('Speach and Language Impairment') }}</td>
                            <td class="text-sm">{{ (disabilityCount('Speach and Language Impairment') / applicants?.length * 100 || 0 ) }}%</td>
                        </tr>
                        <tr class="border-b border-gray-500">
                            <td class="mtext-sm"></td>
                            <td class="text-sm md:py-3 ">Visual Disability</td>
                            <td class="text-sm">{{ disabilityCount('Visual Disability') }}</td>
                            <td class="text-sm">{{ (disabilityCount('Visual Disability') / applicants?.length * 100 || 0 ) }}%</td>
                        </tr>
                        <tr class="border-b border-gray-500">
                            <td class="mtext-sm"></td>
                            <td class="text-sm md:py-3 ">Cancer (RA11215)</td>
                            <td class="text-sm">{{ disabilityCount('Cancer (RA11215)') }}</td>
                            <td class="text-sm">{{ (disabilityCount('Cancer (RA11215)') / applicants?.length * 100 || 0 ) }}%</td>
                        </tr>
                        <tr class="border-b border-gray-500">
                            <td class="mtext-sm"></td>
                            <td class="text-sm md:py-3 ">Rare Disease (RA107747)</td>
                            <td class="text-sm">{{ disabilityCount('Rare Disease (RA107747)') }}</td>
                            <td class="text-sm">{{ (disabilityCount('Rare Disease (RA107747)') / applicants?.length * 100 || 0 ) }}%</td>
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
                        </tr>
                    </thead>
                    <tbody v-if="filteredApplicants.length > 0" class="bg-white text-center">
                        <tr class="border-b border-gray-500" v-for="(applicant, index) in filteredApplicants" :key="index">
                            <td class="md:py-3 text-sm font-semibold">{{ applicant.controlNumber }}</td>
                            <td class="text-sm">{{ applicant.firstName + ' ' + applicant.middleName + ' ' + applicant.lastName }}</td>
                            <td class="text-sm">{{ applicant.gender }}</td>
                            <td class="text-sm">{{ applicant.barangay }}</td>
                            <td class="text-sm">{{ applicant.typeOfDisability }}</td>
                        </tr>
                    </tbody>
                    <tbody v-else class="bg-white text-center">
                        <tr class="border-b border-gray-500">
                            <td colspan="6" class="text-sm py-3">No applicants to show</td>
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
    </section>
</template>

<script setup>
import { computed, onMounted, ref, useId } from "vue";
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import * as mammoth from 'mammoth'
const serverUrl = import.meta.env.VITE_SERVER_URL

const router = useRouter()
const route = useRoute()

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

const applicants = ref(null)
const noApplicants = ref(false)

const searchQuery = ref('');

const filteredApplicants = computed(() => {
    if (!searchQuery.value) return applicants.value || [];
    return applicants.value.filter(applicant => {
        const fullName = `${applicant.firstName} ${applicant.middleName} ${applicant.lastName}`.toLowerCase();
        const barangay = applicant.barangay.toLowerCase();
        return fullName.includes(searchQuery.value.toLowerCase()) || barangay.includes(searchQuery.value.toLowerCase());
    });
});

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = computed(() => Math.ceil(applicants.value?.length / itemsPerPage.value))

const paginatedApplicants = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredApplicants.value.slice(start, end);
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

const childrenApplicants = () => {
    let count = 0
    const today = new Date()

    applicants.value?.filter(applicant => {
        const birthday = new Date(applicant.dateOfBirth)
        const age = today.getFullYear() - birthday.getFullYear()

        if(age < 18){
            count++
        }
    })

    return count
}

const elderApplicants = () => {
    let count = 0
    const today = new Date()

    applicants.value?.filter(applicant => {
        const birthday = new Date(applicant.dateOfBirth)
        const age = today.getFullYear() - birthday.getFullYear()

        if(age > 59){
            count++
        }
    })

    return count
}

const adultApplicants = () => {
    let count = 0
    const today = new Date()

    applicants.value?.filter(applicant => {
        const birthday = new Date(applicant.dateOfBirth)
        const age = today.getFullYear() - birthday.getFullYear()

        if(age > 17 && age < 60){
            count++
        }
    })

    return count
}

const genderCount = (gender) => {
    if(!applicants.value) return 0
    
    const male = applicants.value?.filter(applicant => applicant.gender === gender)

    const count = male.length

    return count
}

const disabilityCount = (disability) => {
    if(!applicants.value) return 0

    const female = applicants.value?.filter(applicant => applicant.typeOfDisability === disability)

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

    pdf.addImage(headerImage, 'PNG', 10, 10, 190, 30);

    html2canvas(table).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 190;
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 50; 

        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 40; 

        while (heightLeft >= 0) {
            pdf.addPage(); 
            pdf.addImage(headerImage, 'PNG', 10, 10, 190, 30);
            position = heightLeft - imgHeight + 40; 
            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight); 
            heightLeft -= pageHeight - 40;
        }

        pdf.save("Table.pdf");
    });

    typeOfExport.value = ''
}

onMounted(() => {
    getApprovedApplications()
})
</script>

<style>

</style>
