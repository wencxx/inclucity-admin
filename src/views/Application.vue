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
                    <option>pdf</option>
                    <option>csv</option>
                </select>
            </div>
        </div>
        <!-- table -->
        <p v-if="declinedSuccessful" class="absolute right-0 bottom-10 bg-green-500 py-1 px-2 rounded text-white animate-pulse">Application declined</p>
        <div v-if="approvedSuccessful" class="absolute top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
            <div class="w-[20dvw] h-1/3 bg-white rounded-md flex flex-col items-center justify-between py-10">
                <Icon icon="lets-icons:check-fill" class="text-[6rem] text-green-500" />
                <p class="text-gray-500 font-manrope text-lg w-4/5 text-center">Application has been approved</p>
                <button class="border border-green-500 text-green-500 w-1/4 py-1 rounded" @click="approvedSuccessful = false">Ok</button>
            </div>
        </div>
        <div class="w-full mt-12 flex flex-col gap-y-5">
            <div class="w-full overflow-x-auto  rounded-md">
                <table class="w-[150dvw] lg:w-full border-collapse" id="userTable">
                    <thead class="bg-custom-primary text-white md:h-10 font-manrope font-extralight tracking-wide">
                        <tr class="w-full">
                            <th class=" text-xs">Application Number</th>
                            <th class=" text-sm">Full Name</th>
                            <th class=" text-sm">Email</th>
                            <th class=" text-sm">Age</th>
                            <th class="text-sm">Phone Number</th>
                            <th class=" text-sm">Gender</th>
                            <th class=" text-sm">Barangay</th>
                            <th class=" text-xs">Application Date</th> 
                            <th class=" text-sm">Status</th>
                            <th class=" text-sm px-1">Actions</th>
                        </tr>
                    </thead>
                    <tbody v-if="!noApplicants" class="bg-white text-center">
                        <tr v-if="paginatedApplicants.length > 0" v-for="applicant in paginatedApplicants" :key="applicant.id" class="border-b border-gray-500">
                            <td class="md:py-3 text-sm">{{ convertApplicationNum(applicant.applicationNumber) }}</td>
                            <td class="text-sm">{{ applicant.firstName }} {{ applicant.middleName }} {{ applicant.lastName }}</td>
                            <td class="text-sm">{{ applicant.user?.email }}</td>
                            <td class="text-sm">{{ applicant.user?.age }}</td>
                            <td class="text-sm">{{ applicant.user?.contactNumber }}</td>
                            <td class="text-sm">{{ applicant.gender }}</td>
                            <td class="text-sm">{{ applicant.barangay }}</td>
                            <td class="text-sm">{{ applicant.dateApplied?.split('T')[0] }}</td>
                            <td class="text-sm">
                                <div class="bg-orange-200 py-1 text-orange-700 text-sm px-3 rounded-md w-fit mx-auto">
                                    {{ applicant.status }}
                                </div>
                            </td>
                            <td>
                                <div class="flex flex-wrap justify-center gap-1 cursor-pointer">
                                    <button class="bg-green-200 py-1 text-green-700 text-xs px-2 rounded-md w-fit hover:shadow" @click="showModalRetype(applicant.user?._id, applicant._id)">approve</button>
                                    <button class="bg-orange-200 py-1 text-orange-700 text-xs px-2 rounded-md w-fit hover:shadow" @click="showModal(applicant.user?._id, applicant._id)">decline</button>
                                    <!-- <button class="bg-red-200 py-1 text-red-700 text-xs px-2 rounded-md hover:shadow" @click="showAttachment(applicant.photo1x1, applicant.medicalCert, applicant.barangayCert)">attachments</button> -->
                                    <button class="bg-red-200 py-1 text-red-700 text-xs px-2 rounded-md hover:shadow" @click="viewAppInfo(applicant._id)">View Info</button>
                                </div>
                            </td>
                        </tr>
                        <tr v-else class="border-b border-gray-500 text-center">
                            <td colspan="10" class="text-sm py-2">Can't find applicant</td>
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



        <!-- modal for declining -->
        <div v-if="declineModal" @click.self="declineModal = false" class="absolute top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
            <div class="w-[30dvw] flex flex-col items-center gap-y-5 p-5 xl:w-[20dvw] h-fit bg-white rounded-md shadow">
                <h1 class="font-medium text-xl">Reasons</h1>
                <div class="w-full flex gap-x-2 items-center">
                    <input type="radio" name="reasons" v-model="reasonForDeclining" class="w-5 aspect-square" value="Outdated Barangay Indigency" >
                    <label>Outdated Barangay Indigency</label>
                </div>
                <div class="w-full flex gap-x-2 items-center">
                    <input type="radio" name="reasons" v-model="reasonForDeclining" class="w-5 aspect-square" value="Legality Issues" >
                    <label>Legality Issues</label>
                </div>
                <div class="w-full flex gap-x-2 items-center">
                    <input type="radio" name="reasons" v-model="reasonForDeclining" class="w-5 aspect-square" value="Invalid Forms" >
                    <label>Invalid Forms</label>
                </div>
                <div class="w-full flex gap-x-2 items-center">
                    <input type="radio" name="reasons" v-model="reasonForDeclining" class="w-5 aspect-square" value="Others" >
                    <label>Others</label>
                </div>
                <div v-if="reasonForDeclining === 'Others'" class="w-full flex gap-x-2 items-center">
                    <input type="text" class="border w-full h-10 rounded pl-2 text-sm" v-model="otherReason" placeholder="State reason for rejection">
                </div>
                <div class="w-full flex justify-end items-center gap-x-2">
                    <button class="bg-green-500 text-white w-1/4 text-sm rounded py-1 hover:shadow" type="button" @click="declineModal = false">Cancel</button>
                    <button class="bg-red-500 text-white w-1/4 text-sm rounded py-1 hover:shadow" @click="updateApplicant('decline', uid, aid)">Decline</button>
                </div>
            </div>
        </div>

        <div v-if="retypeModal" @click.self="retypeModal = false" class="absolute top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
            <div class="w-[30dvw] flex flex-col items-center gap-y-5 p-5 xl:w-[20dvw] h-fit bg-white rounded-md shadow">
                <h1 class="font-medium text-xl">Retype Password</h1>
                <div class="w-full flex flex-col gap-x-2 items-center">
                    <p v-if="invalidPassword" class="w-full text-start bg-red-500 mb-1 rounded pl-2 text-white">Invalid Password</p>
                    <input type="text" name="reasons" v-model="password" class="w-full border rounded h-10 pl-2" placeholder="Enter password">
                </div>
                <div class="w-full flex justify-end items-center gap-x-2">
                    <button class="bg-green-500 text-white w-1/4 text-sm rounded py-1 hover:shadow" type="button" @click="declineModal = false">Cancel</button>
                    <button class="bg-red-500 text-white w-1/4 text-sm rounded py-1 hover:shadow" @click="verifyPassword()">Approve</button>
                </div>
            </div>
        </div>

        <div v-if="images.length > 0" @click.self="images = []" class="absolute flex items-center justify-center gap-x-10 bg-black/10 w-screen h-screen top-0 !left-0 !z-50">
            <button @click="prevImage" class="bg-gray-300 rounded-full flex items-center justify-center p-3">
                <Icon icon="oui:arrow-left" class="text-3xl" />
            </button>
            <div class="bg-black/10 h-full w-1/3 flex items-center justify-center gap-x-5 overflow-hidden relative">
                <img v-for="(image, index) in images" :src="image" :class="{ 'hidden': index != currentIndex }" :key="index" alt="this is a image">
                <div class="absolute left-1/2 bottom-5 flex -translate-x-1/2">
                    <Icon v-for="(dot, index) in images.length" :key="index" class="text-gray-100 text-2xl" :class="{ '!text-gray-400': index === currentIndex }" icon="radix-icons:dot-filled" />
                </div>
            </div>
            <button @click="nextImage" class="bg-gray-300 rounded-full flex items-center justify-center p-3">
                <Icon icon="oui:arrow-right" class="text-3xl" />
            </button>
        </div>


        <!-- application information -->
        <div v-if="showAppDetails" class="absolute h-screen w-screen top-0 left-0 bg-black/25 flex items-center justify-center">
            <div class="h-[90%] w-3/4 bg-gray-300 rounded-xl flex relative">
                <Icon icon="mdi:close" class="absolute right-5 top-4 text-2xl cursor-pointer" @click="showAppDetails = false" />
                <div class="w-1/5 h-full flex flex-col items-center py-10 gap-y-3">
                    <div class="rounded-full bg-gray-200 w-[150px] aspect-square border flex items-center justify-center">
                        <img v-if="infoToShow.photo1x1" :src="infoToShow.photo1x1" alt="1x1 photo" class="w-[130px] aspect-square rounded-full">
                        <Icon v-else icon="mdi:user-circle" class="w-full h-full text-custom-primary"/>
                    </div>
                    <h2 class="text-sm">{{ infoToShow.status }}</h2>
                    <h1 class="-my-2 capitalize">{{ infoToShow.firstName }} {{ infoToShow.middleName }} {{ infoToShow.lastName }}</h1>
                    <h1 class="text-sm text-green-900">{{ convertApplicationNum(infoToShow.applicationNumber) }}</h1>

                    <button class="bg-gray-200 px-3 py-1 rounded mt-20" @click="currentPageDets = 1">Details</button>
                    <button class=" bg-gray-200 px-3 py-1 rounded" @click="currentPageDets = 2">View Attachments</button>
                </div>
                <div v-if="currentPageDets == 1" class="grid grid-cols-2 w-4/5 h-full p-20 capitalize">
                    <div class="w-full h-full flex flex-col gap-y-10">
                        <div class="flex items-center pl-10 gap-x-14">
                            <p class="text-gray-600 font-semibold">Gender:</p>
                            <p>{{ infoToShow.gender }}</p>
                        </div>
                        <div class="flex items-center pl-10 gap-x-14">
                            <p class="text-gray-600 font-semibold">Contact Details:</p>
                            <p>{{ infoToShow.mobileNo }}</p>
                        </div>
                        <div class="flex items-center pl-10 gap-x-14">
                            <p class="text-gray-600 font-semibold">Email Address:</p>
                            <p>{{ infoToShow.emailAddress }}</p>
                        </div>
                        <div class="flex items-center pl-10 gap-x-14">
                            <p class="text-gray-600 font-semibold">Age:</p>
                            <p>{{ infoToShow.user.age }}</p>
                        </div>
                        <div class="flex items-center pl-10 gap-x-14">
                            <p class="text-gray-600 font-semibold">Birthday:</p>
                            <p>{{ infoToShow.dateOfBirth }}</p>
                        </div>
                        <div class="flex items-center pl-10 gap-x-14">
                            <p class="text-gray-600 font-semibold">Civil Status:</p>
                            <p>{{ infoToShow.civilStatus }}</p>
                        </div>
                        <div class="flex items-center pl-10 gap-x-14">
                            <p class="text-gray-600 font-semibold">Educational Attainment:</p>
                            <p>{{ infoToShow.educationalAttainment }}</p>
                        </div>
                        <div class="flex items-center pl-10 gap-x-14">
                            <p class="text-gray-600 font-semibold">Status of employment:</p>
                            <p>{{ infoToShow.statusOfEmployment }}</p>
                        </div>
                    </div>
                    <div class="w-full h-full flex flex-col gap-y-10">
                        <div class="flex items-center pl-10 gap-x-14">
                            <p class="text-gray-600 font-semibold">Type of Disability:</p>
                            <p>{{ infoToShow.typeOfDisability }}</p>
                        </div>
                        <div class="flex items-center pl-10 gap-x-14">
                            <p class="text-gray-600 font-semibold">Cause of Disability:</p>
                            <p>{{ infoToShow.causeOfDisability }} {{ infoToShow.otherCauseOfDisability }}</p>
                        </div>
                        <div class="flex items-center pl-10 gap-x-14">
                            <p class="text-gray-600 font-semibold">Occupation:</p>
                            <p>{{ infoToShow.occupation }} {{ infoToShow.otherOccupation }}</p>
                        </div>
                        <div class="flex items-center pl-10 gap-x-14">
                            <p class="text-gray-600 font-semibold">Accomplished by:</p>
                            <p>{{ infoToShow.accomplishedBy }}</p>
                        </div>
                        <div class="flex items-center pl-10 gap-x-14">
                            <p class="text-gray-600 font-semibold">Type of employment:</p>
                            <p>{{ infoToShow.typeOfEmployment }}</p>
                        </div>
                    </div>
                </div>
                <div v-else class="w-4/5 h-full p-20 grid grid-cols-2 grid-rows-2 gap-10 overflow-auto">
                    <img :src="infoToShow.photo1x1" alt="1x1 photo" class="w-full h-full">
                    <img :src="infoToShow.barangayCert" alt="barangay certitificate" class="max-w-full max-h-full">
                    <img :src="infoToShow.medicalCert" alt="medical certitificate" class="max-w-full max-h-full">
                </div>
            </div>
        </div>
        </section>
</template>

<script setup>
import { computed, onMounted, ref, useId } from "vue";
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
// import * as mammoth from 'mammoth'
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

// show app details
const showAppDetails = ref(false)
const infoToShow = ref({})

const currentPageDets = ref(1)

const viewAppInfo = (appId) => {
    const appli = applicants.value.filter(applicant => applicant._id == appId)

    const applicantObject = appli.reduce((acc, applicant) => {
        acc[applicant._id] = applicant;
        return acc;
    }, {});

    infoToShow.value = applicantObject[appId]

    showAppDetails.value = true
}

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

const convertApplicationNum = (num) => {
    const convertedToString = num?.toString()
    if(convertedToString?.length === 1) return `0000${num}`
    if(convertedToString?.length === 2) return `000${num}`
    if(convertedToString?.length === 3) return `00${num}`
    if(convertedToString?.length === 4) return `0${num}`
    if(convertedToString?.length === 5) return num
}

const docxContent = ref('');

const fetchDoc = async (id) => {
  try {
    const response = await axios.get(`${serverUrl}/generate-doc/${id}`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    // Create a new blob object from the response data
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    
    // Create a link element
    const link = document.createElement('a');
    
    // Create a URL for the blob and set it as the href attribute of the link
    const url = URL.createObjectURL(blob);
    link.href = url;
    
    // Set the download attribute with the desired filename
    link.download = 'document.docx';
    
    // Append the link to the document body and trigger a click
    document.body.appendChild(link);
    link.click();
    
    // Clean up and remove the link from the DOM
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Revoke the object URL to free up memory
  } catch (error) {
    console.error('Error fetching DOCX:', error);
  }
};

const declineModal = ref(false)

const reasonForDeclining = ref('')
const otherReason = ref('')


const uid = ref('')
const aid = ref('')

const showModal = async (userId, appId) => {
    declineModal.value = true

    uid.value = userId.toString()
    aid.value = appId
}

const retypeModal = ref(false)
const password = ref('')

const showModalRetype = async (userId, appId) => {
    retypeModal.value = true

    uid.value = userId.toString()
    aid.value = appId
}

const invalidPassword = ref(false)

const verifyPassword = async () => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/verify-password`, {
            password: password.value
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if(res.data === 'password match'){
            updateApplicant('approved', uid.value, aid.value )
            uid.value = ''
            aid.value = ''
        }else{
            invalidPassword.value = true
        }
    } catch (error) {
        console.log(error)
    }finally{
        retypeModal.value = false
    }
}

const declinedSuccessful = ref(false)
const approvedSuccessful = ref(false)

const updateApplicant = async (status, userId, appId) => {
    if(status === 'decline'){
        let data = {}

        if(reasonForDeclining.value === 'Others'){
            data.reason = otherReason.value
        }else{
            data.reason = reasonForDeclining.value
        }

        data.userId = uid.value
        data.applicationId = aid.value
        data.status = 'rejected'


        try {
            const res = await axios.post(`${serverUrl}/update-application`, data ,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if(res.data === 'application rejected succesfully'){
                applicants.value = applicants.value.filter(applicant => applicant._id != appId)
                reasonForDeclining.value = ''
                otherReason.value = ''
                fetchDoc()
                declinedSuccessful.value = true
                setTimeout(() => {
                    declinedSuccessful.value = false
                }, 3000)
            }
        } catch (error) {
            console.log(error)
        }finally{
            declineModal.value = false
        }
    }else{
        let data = {}

        data.userId = userId
        data.applicationId = appId
        data.status = status

        try {
            const res = await axios.post(`${serverUrl}/update-application`, data ,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if(res.data === 'application approved succesfully'){
                applicants.value = applicants.value.filter(applicant => applicant._id != appId)
                approvedSuccessful.value = true
                setTimeout(() => {
                    approvedSuccessful.value = false
                }, 3000)

                console.log(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

const currentIndex = ref(0)
const images = ref([])

const showAttachment = (photo1x1, medicalCert, barangayCert) => {
    images.value.push(photo1x1)
    images.value.push(medicalCert)
    images.value.push(barangayCert)
}

const nextImage = () => {
    currentIndex.value = (currentIndex.value + 1) % images.value.length;
}
const prevImage = () => {
    currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length;
}

const typeOfExport = ref('')

const handleExportChange = () => {
    if(typeOfExport.value === 'csv'){
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
    link.download = 'table.csv';
    link.click();
}

const downloadPDF = () => {
    const pdf = new jsPDF();
    const table = document.getElementById("userTable");

    html2canvas(table).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 190;
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 10;

        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight + 10;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save("table.pdf");
    });
}

onMounted(() => {
    getPendingApplications()
})
</script>

<style>

</style>