<template>
    <section class="h-[94dvh] overflow-auto font-poppins py-10 px-5 lg:px-10 bg-gray-100">
        <div class="lg:flex lg:justify-between space-y-3 lg:space-y-0">
            <div class="bg-white w-fit flex items-center px-3 rounded shadow">
                <input type="text" placeholder="Search" v-model="searchQuery" class="bg-transparent h-8 lg:h-5 focus:outline-none">
                <Icon icon="iconoir:search" />
            </div>
            <div class="flex items-center gap-x-3">
                <!-- <select class="rounded h-8 px-2 shadow">
                    <option>10-23-2023</option>
                    <option>10-23-2024</option>
                    <option>10-23-2025</option>
                    <option>10-23-2026</option>
                </select> -->
                <!-- <button class="bg-custom-primary text-white p-2 rounded-md shadow hover:bg-red-950 flex items-center h-8 gap-x-1 w-24 justify-center">
                    <Icon icon="typcn:user-add-outline" />
                    Add
                </button> -->
                <!-- <button class="bg-custom-primary text-white p-2 rounded-md shadow hover:bg-red-950 flex items-center h-8 gap-x-1 w-24 justify-center" @click="downloadCSV">
                    <Icon icon="ph:export" />
                    Export
                </button> -->
                <select v-model="typeOfExport" @change="handleExportChange" class="px-2 bg-custom-primary text-white rounded h-8">
                    <option value="" disabled>Export</option>
                    <option>PDF</option>
                    <option>CSV</option>
                </select>
            </div>
        </div>
        <!-- table -->
        <div class="w-full mt-12 flex flex-col gap-y-5">
            <div class="w-full overflow-x-auto  rounded-md">
                <table class="w-[150dvw] lg:w-full border-collapse" id="userTable">
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
                        <tr v-if="paginatedUsers.length > 0" v-for="(user, index) in paginatedUsers" :key="user.id" class="border-b border-gray-500">
                            <td class="md:p-3">{{ formatNumber(users.indexOf(user) + 1) }}</td>
                            <td>{{ user.name }}</td>
                            <td>{{ user.email }}</td>
                            <td>{{ user.contactNumber }}</td>
                            <td>{{ user.address + ', ' + (user.municipality || '') }}</td>
                            <td>{{ user.gender }}</td>
                            <td>
                                <div class="flex justify-center w-full gap-x-2 relative group">
                                    <Icon icon="mdi:restore" class="text-2xl text-green-500 hover:text-green-700" @click="deleteConfirmation = true, userTobeDeleted = user._id" />
                                    <div class="absolute rounded top-[100%] right-0 w-24 bg-black/45 text-white py-1 hidden group-hover:block z-50">
                                        <p class="text-xs">Restore User</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr v-else class="border-b border-gray-500">
                            <td colspan="9" class="py-2">
                                Can't find user
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

        <!-- delete modal -->
        <div v-if="deleteConfirmation" class="absolute top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
            <div class="w-[20dvw] h-1/3 bg-white rounded-md flex flex-col items-center justify-between py-10">
                <Icon icon="uiw:warning" class="text-[6rem] text-green-500" />
                <p class="text-gray-500 font-manrope text-lg w-4/5 text-center">Do you want to restore this user?</p>
                <div class="flex items-center w-4/5 gap-x-5">
                    <button class="bg-red-500 text-white w-1/2 py-1 rounded" @click="deleteConfirmation = false">Cancel</button>
                    <button v-if="!deleting" class="bg-blue-500 text-white w-1/2 py-1 rounded" @click="deleteUser">Restore</button>
                    <button v-else class="bg-blue-500 text-white w-1/2 py-1 rounded animate-pulse" disabled>Deleting</button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import axios from 'axios'
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { useAuthStore } from '../store/index'
import moment from "moment";
const serverUrl = import.meta.env.VITE_SERVER_URL

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const formatNumber = (number) => {
    return number.toString().padStart(4, '0');
}

const users = ref(null)
const noUsers = ref(false)

const getAllUsers = async () => {
    try {
        const res = await axios.get(`${serverUrl}/get-all-deleted-users`,{
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

const searchQuery = ref('');

const filteredUsers = computed(() => {
    if (!searchQuery.value) return users.value || [];
    return users.value.filter(user => {
        const fullName = `${user.name}`.toLowerCase();
        const email = user.email.toLowerCase();
        const id = formatNumber(users.value.indexOf(user) + 1).toLowerCase();
        const address = user.address.toLowerCase();
        const gender = user.gender.toLowerCase();
        return fullName.includes(searchQuery.value.toLowerCase()) || email.includes(searchQuery.value.toLowerCase()) || address.includes(searchQuery.value.toLowerCase()) || gender === searchQuery.value.toLowerCase() || id.includes(searchQuery.value.toLowerCase())
    });
});

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = computed(() => Math.ceil(users.value?.length / itemsPerPage.value))

const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredUsers.value?.slice(start, end)
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

const deleteConfirmation = ref(false)
const userTobeDeleted = ref('')

const failedToDelete = ref(false)

const deleteUser = async () => {
    try {
        const res = await axios.patch(`${serverUrl}/restore-user/${userTobeDeleted.value}`, {},{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if(res.data === 'failed to restore user') return failedToDelete.value = true

        users.value = users.value.filter(user => user._id != userTobeDeleted.value)
        deleteConfirmation.value = false
    } catch (error) {
        console.log(error)
    }
}

// export
const typeOfExport = ref('')

const handleExportChange = () => {
    if(typeOfExport.value === 'CSV'){
        downloadCSV()
    }else{
        downloadPDF()
    }
}

// download as csv
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
    pdf.text("Deleted Users", 90, 43);

    // Combine the styles to hide both the last and second-to-last columns
    const hiddenColumnsStyle = document.createElement('style');
    hiddenColumnsStyle.innerHTML = `
        #userTable td:last-child,
        #userTable th:last-child,
        #userTable td:nth-last-child(2),
        #userTable th:nth-last-child(2) {
            display: none;
        }
    `;

    document.head.appendChild(hiddenColumnsStyle);

    html2canvas(table).then((canvas) => {

        hiddenColumnsStyle.remove();

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

    typeOfExport.value = ''
};

onMounted(() => {
    getAllUsers()
    authStore.getUser()
})
</script>

<style>

</style>