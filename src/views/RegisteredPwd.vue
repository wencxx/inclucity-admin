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
                <button class="bg-custom-primary h-full text-white p-2 rounded-md shadow hover:bg-red-950 flex items-center gap-x-1" @click="addApplicant">
                    <Icon icon="mingcute:user-add-line" />
                    Add
                </button>
                <select v-model="typeOfExport" @change="handleExportChange" class="px-2 bg-custom-primary text-white rounded h-full">
                    <option value="" disabled>Export</option>
                    <option>PDF</option>
                    <option>CSV</option>
                </select>
            </div>
        </div>
        <!-- table -->
        <div v-if="route.query.page === 'expired'" class="w-full mt-12 flex flex-col gap-y-5">
            <div class="w-full overflow-x-auto  rounded-md">
                <table class="w-[150dvw] lg:w-full border-collapse" id="expired">
                    <thead class="bg-custom-primary text-white md:h-10 font-manrope font-extralight tracking-wide">
                        <tr class="w-full">
                            <th class="text-xs">CONTROL NUMBER</th>
                            <th class="text-sm">FULL NAME</th>
                            <th class="text-sm">EMAIL</th>
                            <th class="text-sm">AGE</th>
                            <th class="text-sm">GENDER</th>
                            <th class="text-sm">BARANGAY</th>
                            <th class="text-sm">DISABILITY</th>
                            <th class="text-xs">DATE REGISTERED</th>
                            <th class="text-sm">APPLICATION TYPE</th>
                            <th class="text-sm">STATUS</th>
                            <th class="text-sm">ACTION</th>
                        </tr>
                    </thead>
                    <tbody v-if="!noExpiredApplicants" class="bg-white text-center">
                        <tr v-if="paginatedExpiredApplicants.length > 0" v-for="applicant in paginatedExpiredApplicants" :key="applicant.id" class="border-b border-gray-500">
                            <td class="md:py-3 text-sm">{{ applicant.controlNumber }}</td>
                            <td class="text-sm">{{ applicant.firstName }} {{ applicant.middleName }} {{ applicant.lastName }}</td>
                            <td class="text-sm">{{ applicant.user?.email }}</td>
                            <td class="text-sm">{{ applicant.user?.age }}</td>
                            <td class="text-sm">{{ applicant.gender }}</td>
                            <td class="text-sm">{{ applicant.barangay }}</td>
                            <td class="text-sm">{{ applicant.typeOfDisability }}</td>
                            <td class="text-sm">{{ applicant.dateApplied?.split('T')[0] }}</td>
                            <td class="text-sm">
                                <div class="bg-yellow-200 py-1 text-yellow-700 text-sm px-3 rounded-md w-fit mx-auto">
                                    {{ applicant.typeOfApplication }}
                                </div>
                            </td>
                            <td class="text-sm">
                                <div class="bg-red-200 py-1 text-red-700 text-sm px-3 rounded-md w-fit mx-auto capitalize">
                                    {{ applicant.status }}
                                </div>
                            </td>
                            <td class="text-sm">
                                <div class="space-x-1">
                                    <button class="bg-gray-200 py-1 text-gray-700 text-lg px-3 rounded-md w-fit mx-auto" @click="generateFormExpired(index)">
                                        <Icon icon="fluent:form-24-regular" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-else class="border-b border-gray-500 text-center">
                            <td colspan="11" class="text-sm py-2">Can't find applicant</td>
                        </tr>
                    </tbody>
                    <tbody v-else class="bg-white text-center">
                        <tr class="border-b border-gray-500">
                            <td class="md:py-3" colspan="11">No expired PWD</td>
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
                            <th class="text-sm">FULL NAME</th>
                            <th class="text-sm">EMAIL</th>
                            <th class="text-sm">AGE</th>
                            <th class="text-sm">GENDER</th>
                            <th class="text-sm">BARANGAY</th>
                            <th class="text-sm">DISABILITY</th>
                            <th class="text-xs">DATE REGISTERED</th>
                            <th class="text-sm">APPLICATION TYPE</th>
                            <th class="text-sm">STATUS</th>
                            <th class="text-sm">ACTION</th>
                        </tr>
                    </thead>
                    <tbody v-if="!noApplicants" class="bg-white text-center">
                        <tr v-if="paginatedApplicants.length > 0" v-for="(applicant, index) in paginatedApplicants" :key="index" class="border-b border-gray-500">
                            <td class="md:py-5 text-sm">{{ applicant.controlNumber }}</td>
                            <td class="text-sm">{{ applicant.firstName }} {{ applicant.middleName }} {{ applicant.lastName }}</td>
                            <td class="text-sm">{{ applicant.emailAddress }}</td>
                            <td class="text-sm">{{ calculateAge(applicant.dateOfBirth) }}</td>
                            <td class="text-sm">{{ applicant.gender }}</td>
                            <td class="text-sm">{{ applicant.barangay }}</td>
                            <td class="text-sm">{{ applicant.typeOfDisability }}</td>
                            <td class="text-sm">{{ applicant.dateApplied?.split('T')[0] }}</td>
                            <td class="text-sm">
                                <div class="bg-yellow-200 py-1 text-yellow-700 text-sm px-3 rounded-md w-fit mx-auto">
                                    {{ applicant.typeOfApplication }}
                                </div>
                            </td>
                            <td class="text-sm">
                                <div class="bg-orange-200 py-1 text-orange-700 text-sm px-3 rounded-md w-fit mx-auto capitalize">
                                    <select class="bg-transparent" @change="showReleaseModal(applicant._id, applicant.isIdReleased, $event.target.value)">
                                        <option value="false">Unreleased</option>
                                        <option value="true" :selected="applicant.isIdReleased">Released</option>
                                    </select>
                                </div>
                            </td>
                            <td class="text-sm">
                                <div class="space-x-1">
                                    <!-- <button class="bg-green-200 cursor-pointer py-1 text-green-700 text-lg px-3 rounded-md w-fit mx-auto relative group" @click="showReleaseModal(applicant._id, applicant.isIdReleased)">
                                        <Icon icon="hugeicons:id" />
                                        <div class="absolute rounded top-[100%] right-0 w-32 bg-black/45 text-white py-1 hidden group-hover:block z-50">
                                            <p class="text-xs">Release ID</p>
                                        </div>
                                    </button> -->
                                    <button class="bg-gray-200 py-1 text-gray-700 text-lg px-3 rounded-md w-fit mx-auto relative group" @click="generateForm(index)">
                                        <Icon icon="fluent:form-24-regular" />
                                        <div class="absolute rounded top-[100%] right-0 w-32 bg-black/45 text-white py-1 hidden group-hover:block z-50">
                                            <p class="text-xs">download form</p>
                                        </div>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-else class="border-b border-gray-500 text-center">
                            <td colspan="11" class="text-sm py-2">Can't find applicant</td>
                        </tr>
                    </tbody>
                    <tbody v-else class="bg-white text-center">
                        <tr class="border-b border-gray-500">
                            <td class="md:py-3" colspan="11">No registered PWD</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- release id confimartion -->
            <div v-if="releaseModal" class="absolute top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
                <div class="w-[20dvw] h-1/3 bg-white rounded-md flex flex-col items-center justify-between py-10">
                    <Icon icon="uiw:warning" class="text-[6rem] text-gray-500" />
                    <p class="text-gray-500 font-manrope text-lg w-4/5 text-center">Release ID?</p>
                    <div class="flex items-center w-4/5 gap-x-5">
                        <button class="bg-red-500 text-white w-1/2 py-1 rounded" @click="releaseModal = false">Cancel</button>
                        <button v-if="!deleting" class="bg-blue-500 text-white w-1/2 py-1 rounded" @click="releasedId">Release</button>
                    </div>
                </div>
            </div>
            <!-- unreleaseModal -->
            <div v-if="unreleaseModal" class="absolute top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
                <div class="w-[20dvw] h-1/3 bg-white rounded-md flex flex-col items-center justify-between py-10">
                    <Icon icon="uiw:warning" class="text-[6rem] text-gray-500" />
                    <p class="text-gray-500 font-manrope text-lg w-4/5 text-center">Unrelease ID?</p>
                    <div class="flex items-center w-4/5 gap-x-5">
                        <button class="bg-red-500 text-white w-1/2 py-1 rounded" @click="unreleaseModal = false">Cancel</button>
                        <button v-if="!deleting" class="bg-blue-500 text-white w-1/2 py-1 rounded" @click="releasedId">Unrelease</button>
                    </div>
                </div>
            </div>

            <div v-if="alreadyReleasedModal" class="absolute top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
                <div class="w-[20dvw] h-1/3 bg-white rounded-md flex flex-col items-center justify-between py-10">
                    <Icon icon="uiw:warning" class="text-[6rem] text-gray-500" />
                    <p class="text-gray-500 font-manrope text-lg w-4/5 text-center">ID already released</p>
                    <div class="flex justify-center w-4/5">
                        <button class="bg-green-500 text-white w-1/2 py-1 rounded" @click="alreadyReleasedModal = false">Ok</button>
                    </div>
                </div>
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

        <!-- add new applicant modal -->
        <AddNewApplicant v-if="addApplicantModal" @click.self="addApplicantModal = false"  @closeModal="addApplicantModal = false" @addedNewApplicant="getApprovedApplications()"/>
    </section>
</template>

<script setup>
import AddNewApplicant from '../components/AddNewApplicant.vue'
import { computed, onMounted, ref } from "vue";
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { saveAs } from 'file-saver'
import ImageModule from 'docxtemplater-image-module-free'
import { useAuthStore } from '../store/index'
import moment from "moment";
const serverUrl = import.meta.env.VITE_SERVER_URL

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const router = useRouter()
const route = useRoute()

const calculateAge = (birthday) => {
  const birthDate = new Date(birthday);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return age;
}

const applicants = ref(null)
const noApplicants = ref(false)

const searchQuery = ref('');

const filteredApplicants = computed(() => {
    if (!searchQuery.value) return applicants.value || [];
    return applicants.value.filter(applicant => {
        const fullName = `${applicant.firstName} ${applicant.middleName} ${applicant.lastName}`.toLowerCase();
        const controlNumber = applicant.controlNumber.toLowerCase();
        const barangay = applicant.barangay.toLowerCase();
        const gender = applicant.gender.toLowerCase();
        const disability = applicant.typeOfDisability.toLowerCase();
        return fullName.includes(searchQuery.value.toLowerCase()) || barangay.includes(searchQuery.value.toLowerCase()) || controlNumber.includes(searchQuery.value.toLowerCase()) || gender.includes(searchQuery.value.toLowerCase()) || disability.includes(searchQuery.value.toLowerCase());
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
        
        addApplicantModal.value = false
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
        const controlNumber = applicant.controlNumber.toLowerCase();
        const barangay = applicant.barangay.toLowerCase();
        const gender = applicant.gender.toLowerCase();
        const disability = applicant.typeOfDisability.toLowerCase();
        return fullName.includes(searchQuery.value.toLowerCase()) || barangay.includes(searchQuery.value.toLowerCase()) || controlNumber.includes(searchQuery.value.toLowerCase()) || gender.includes(searchQuery.value.toLowerCase()) || disability.includes(searchQuery.value.toLowerCase());
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

const idToReleased = ref('')
const releaseModal = ref(false)
const unreleaseModal = ref(false)
const alreadyReleasedModal = ref(false)
const releaseStatus = ref(true)

const showReleaseModal = (id, isReleased, value) => {
    if(isReleased == value){
        alreadyReleasedModal.value = true
    }else{
        idToReleased.value = id
        releaseStatus.value = value
        if(value == 'true'){
            releaseModal.value = true
        }else{
            unreleaseModal.value = true
        }
    }
}

const releasedId = async () => {
    try {
        const res = await axios.patch(`${serverUrl}/release-id/${idToReleased.value}`, {
            status: releaseStatus.value
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        releaseModal.value = false
        unreleaseModal.value = false
        console.log(res.data)
    } catch (error) {
        console.log(error)
    }
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
        link.download = 'Table.csv';
        link.click();
    }

    typeOfExport.value = ''
}

const downloadPDF = () => {
    if(route.query.page === 'expired'){
        const pdf = new jsPDF();
        const table = document.getElementById("expired");
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
        pdf.text("Expired Applicants", 90, 43);

        html2canvas(table).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const imgWidth = 190;
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 50; 
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

            pdf.save("Table.pdf");
        });
    }else{
        const pdf = new jsPDF();
        const table = document.getElementById("active");
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
        pdf.text("Registered Applicants", 90, 43);

        html2canvas(table).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const imgWidth = 190;
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 50; 
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

            pdf.save("Table.pdf");
        });
    }

    typeOfExport.value = ''
}

// download form
const loadImageAsArrayBuffer = async (imageUrl) => {
  const response = await fetch(imageUrl)
  if (!response.ok) throw new Error('Network response was not ok')
  return await response.arrayBuffer()
}

const generateForm = async (index) => {

    const applicantData = applicants.value[index]

    try {
        // const response = await fetch('/public/PRPWD-APPLICATION_FORM.docx')
        const response = await fetch('PRPWD-APPLICATION_FORM.docx')

        if (!response.ok) throw new Error('Failed to fetch DOCX template')

        const docxArrayBuffer = await response.arrayBuffer()

        const imageArrayBuffer = await loadImageAsArrayBuffer(applicantData.photo1x1)

        const zip = new PizZip(docxArrayBuffer)

        const imageModule = new ImageModule({
            centered: false,
            getImage: function () {
                return imageArrayBuffer
            },
            getSize: function () {
                return [200, 200]
            },
        })

        const doc = new Docxtemplater(zip, {
            modules: [imageModule],
        })

        doc.setData({
            // image: infoToShow.value.photo1x1,
            newApplicant: applicantData.typeOfApplicant === 'new' ? '◾' : '◽',
            renewal: applicantData.typeOfApplicant === 'renewal' ? '◾' : '◽',
            dateApplied: applicantData.dateApplied,
            dateOfBirth: applicantData.dateOfBirth,
            first: applicantData.firstName,
            middle: applicantData.middleName,
            last: applicantData.lastName,
            suffix: applicantData.suffix,
            houseNo: applicantData.houseNoAndStreet,
            barangay: applicantData.barangay,
            municipality: applicantData.municipalityCity,
            province: applicantData.province,
            region: applicantData.region,
            landlineNo: applicantData.landlineNo,
            mobileNo: applicantData.mobileNo,
            email: applicantData.emailAddress,
            fathersLname: applicantData.fathersLname,
            fathersFname: applicantData.fathersFname,
            fathersMname: applicantData.fathersMname,
            mothersLname: applicantData.mothersLname,
            mothersFname: applicantData.mothersFname,
            mothersMname: applicantData.mothersMname,   
            guardiansLname: applicantData.guardiansLname,
            guardiansFname: applicantData.guardiansFname,
            guardiansMname: applicantData.guardiansMname,
            Lname: applicantData.accomplishedByLname,
            Fname: applicantData.accomplishedByFname,
            Mname: applicantData.accomplishedByMname,
            controlNum: applicantData.controlNumber,
            sexcb: applicantData.gender === 'Female' ? '◾' : '◽',
            sexcb2: applicantData.gender === 'Male' ? '◾' : '◽',
            organizationAffiliated: applicantData.organizationAffiliated,
            contactPerson: applicantData.contactInformation,
            officeAddress: applicantData.officeAddress,
            telNo: applicantData.telNo,
            sssNo: applicantData.sssNo,
            gsisNo: applicantData.gsisNo,
            pagibigNo: applicantData.pagibigNo,
            psnNo: applicantData.psnNo,
            philHNo: applicantData.philhealthNo,
            physicianName: `${applicantData.physicianByFname} ${applicantData.physicianByMname} ${applicantData.physicianByLname}`,
            single: applicantData.civilStatus === 'Single' ? '◾' : '◽',
            seperated: applicantData.civilStatus === 'Seperated' ? '◾' : '◽',
            livein: applicantData.civilStatus === 'Cohabitation' ? '◾' : '◽',
            married: applicantData.civilStatus === 'Married' ? '◾' : '◽',
            widow: applicantData.civilStatus === 'Widow/er' ? '◾' : '◽',
            d: applicantData.typeOfDisability === 'Deaf/Hard of hearing' ? '◾' : '◽',
            id: applicantData.typeOfDisability === 'Intellectual Disability' ? '◾' : '◽',
            ld: applicantData.typeOfDisability === 'Learning Disability' ? '◾' : '◽',
            md: applicantData.typeOfDisability === 'Mental Disability' ? '◾' : '◽',
            pd: applicantData.typeOfDisability === 'Physical Disability (Orthopedic)' ? '◾' : '◽',
            psd: applicantData.typeOfDisability === 'Psychosocial Disability' ? '◾' : '◽',
            sli: applicantData.typeOfDisability === 'Speech and Language Impairment' ? '◾' : '◽',
            vd: applicantData.typeOfDisability === 'Visual Disability' ? '◾' : '◽',
            c: applicantData.typeOfDisability === 'Cancer (RA11215)' ? '◾' : '◽',
            rd: applicantData.typeOfDisability === 'Rare Disease (RA107747)' ? '◾' : '◽',
            aut: applicantData.causeOfDisability === 'Autism' ? '◾' : '◽',
            ad: applicantData.causeOfDisability === 'ADHD' ? '◾' : '◽',
            cp: applicantData.causeOfDisability === 'Cerebral Palsy' ? '◾' : '◽',
            ds: applicantData.causeOfDisability === 'Down Syndrome' ? '◾' : '◽',
            ci: applicantData.causeOfDisability === 'Chronic Illness' ? '◾' : '◽',
            i: applicantData.causeOfDisability === 'Injury' ? '◾' : '◽',
            na: applicantData.educationalAttainment === 'None' ? '◾' : '◽',
            k: applicantData.educationalAttainment === 'Kindergarten' ? '◾' : '◽',
            el: applicantData.educationalAttainment === 'Elementary' ? '◾' : '◽',
            jhs: applicantData.educationalAttainment === 'Junior High School' ? '◾' : '◽',
            shs: applicantData.educationalAttainment === 'Senior High School' ? '◾' : '◽',
            col: applicantData.educationalAttainment === 'College' ? '◾' : '◽',
            voc: applicantData.educationalAttainment === 'Vocational' ? '◾' : '◽',
            pg: applicantData.educationalAttainment === 'Post Graduate' ? '◾' : '◽',
            emp: applicantData.statusOfEmployment === 'employed' ? '◾' : '◽',
            une: applicantData.statusOfEmployment === 'unemployed' ? '◾' : '◽',
            sel: applicantData.statusOfEmployment === 'self-employed' ? '◾' : '◽',
            gov: applicantData.categoryOfEmployment === 'government' ? '◾' : '◽',
            pri: applicantData.categoryOfEmployment === 'private' ? '◾' : '◽',
            per: applicantData.typeOfEmployment === 'permanent/regular' ? '◾' : '◽',
            sea: applicantData.typeOfEmployment === 'seasonal' ? '◾' : '◽',
            cas: applicantData.typeOfEmployment === 'casual' ? '◾' : '◽',
            eme: applicantData.typeOfEmployment === 'emergency' ? '◾' : '◽',
            man: applicantData.occupation === 'Managers' ? '◾' : '◽',
            pro: applicantData.occupation === 'Professionals' ? '◾' : '◽',
            tec: applicantData.occupation === 'Technicians and Associate Professionals' ? '◾' : '◽',
            cle: applicantData.occupation === 'Clerical Support Worker' ? '◾' : '◽',
            ser: applicantData.occupation === 'Service and Sales Worker' ? '◾' : '◽',
            saf: applicantData.occupation === 'Skilled Agricultural, Forestry and Fishery Workers' ? '◾' : '◽',
            car: applicantData.occupation === 'Craft and Related Trade Workers' ? '◾' : '◽',
            pla: applicantData.occupation === 'Plant and Machine Operators and Assemblers' ? '◾' : '◽',
            ele: applicantData.occupation === 'Elementary Occupation' ? '◾' : '◽',
            arm: applicantData.occupation === 'Armed Forces Occupation' ? '◾' : '◽',
            oth: applicantData.otherOccupation ? '◾' : '◽',
            others: applicantData.otherOccupation
        })

        doc.render()

        const output = doc.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        })

        saveAs(output, 'Application-form.docx')
    } catch (error) {
        console.error('Error generating document:', error)
    }
}

const generateFormExpired = async (index) => {

    const applicantData = expiredApplicants.value[index]
    try {
        const response = await fetch('/public/PRPWD-APPLICATION_FORM.docx')

        if (!response.ok) throw new Error('Failed to fetch DOCX template')

        const docxArrayBuffer = await response.arrayBuffer()

        const imageArrayBuffer = await loadImageAsArrayBuffer(applicantData.photo1x1)

        const zip = new PizZip(docxArrayBuffer)

        const imageModule = new ImageModule({
            centered: false,
            getImage: function () {
                return imageArrayBuffer
            },
            getSize: function () {
                return [200, 200]
            },
        })

        const doc = new Docxtemplater(zip, {
            modules: [imageModule],
        })

        doc.setData({
            // image: infoToShow.value.photo1x1,
            newApplicant: applicantData.typeOfApplicant === 'new' ? '◾' : '◽',
            renewal: applicantData.typeOfApplicant === 'renewal' ? '◾' : '◽',
            dateApplied: applicantData.dateApplied,
            dateOfBirth: applicantData.dateOfBirth,
            middle: applicantData.middleName,
            last: applicantData.lastName,
            suffix: applicantData.suffix,
            houseNo: applicantData.houseNoAndStreet,
            barangay: applicantData.barangay,
            municipality: applicantData.municipalityCity,
            province: applicantData.province,
            region: applicantData.region,
            landlineNo: applicantData.landlineNo,
            mobileNo: applicantData.mobileNo,
            email: applicantData.emailAddress,
            fathersLname: applicantData.fathersLname,
            fathersFname: applicantData.fathersFname,
            fathersMname: applicantData.fathersMname,
            mothersLname: applicantData.mothersLname,
            mothersFname: applicantData.mothersFname,
            mothersMname: applicantData.mothersMname,
            guardiansLname: applicantData.guardiansLname,
            guardiansFname: applicantData.guardiansFname,
            guardiansMname: applicantData.guardiansMname,
            Lname: applicantData.accomplishedByLname,
            Fname: applicantData.accomplishedByFname,
            Mname: applicantData.accomplishedByMname,
            controlNum: applicantData.controlNumber,
            sexcb: applicantData.gender === 'Female' ? '◾' : '◽',
            sexcb2: applicantData.gender === 'Male' ? '◾' : '◽',
            organizationAffiliated: applicantData.organizationAffiliated,
            contactPerson: applicantData.contactInformation,
            officeAddress: applicantData.officeAddress,
            telNo: applicantData.telNo,
            sssNo: applicantData.sssNo,
            gsisNo: applicantData.gsisNo,
            pagibigNo: applicantData.pagibigNo,
            psnNo: applicantData.psnNo,
            philHNo: applicantData.philhealthNo,
            physicianName: `${applicantData.physicianByFname} ${applicantData.physicianByMname} ${applicantData.physicianByLname}`
        })

        doc.render()

        const output = doc.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        })

        saveAs(output, 'parents-consent.docx')
    } catch (error) {
        console.error('Error generating document:', error)
    }
}

// toggle add applicant
const addApplicantModal = ref(false)

const addApplicant = async () => {
    addApplicantModal.value = true
}

onMounted(() => {
    getApprovedApplications()
    getExpiredApplications()
    authStore.getUser()
})
</script>

<style scoped>
.overflow-x-auto::-webkit-scrollbar {
    display: none;
}
</style>