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
                <button @click="addNewUser = true" class="bg-custom-primary text-white p-2 rounded-md shadow hover:bg-red-950 flex items-center h-8 gap-x-1 w-24 justify-center">
                    <Icon icon="typcn:user-add-outline" />
                    Add
                </button>
                <!-- <button class="bg-custom-primary text-white p-2 rounded-md shadow hover:bg-red-950 flex items-center h-8 gap-x-1 w-24 justify-center" @click="downloadCSV">
                    <Icon icon="ph:export" />
                    Export
                </button> -->
                <select v-model="typeOfExport" @change="handleExportChange" class="px-2 bg-custom-primary text-white rounded h-8">
                    <option value="" disabled>Export</option>
                    <option>PDf</option>
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
                            <th class="md:w-1/12">Birthdate</th>
                            <th class="md:w-1/12">Action</th>
                        </tr>
                    </thead>
                    <tbody  v-if="!noUsers" class="bg-white text-center">
                        <tr v-if="paginatedUsers.length > 0" v-for="(user, index) in paginatedUsers" :key="index" class="border-b border-gray-500">
                            <td class="md:p-3">{{ formatNumber(users.indexOf(user) + 1) }}</td>
                            <td>{{ user.name }}</td>
                            <td>{{ user.email }}</td>
                            <td>{{ user.contactNumber }}</td>
                            <td>{{ user.address + ', ' +  (user.municipality || ' ')}}</td>
                            <td>{{ user.gender }}</td>
                            <td>{{ formatBday(user.age) }}</td>
                            <td>
                                <div class="flex justify-center w-full gap-x-2">
                                    <div class="relative group">
                                        <Icon icon="iconamoon:edit-fill" class="text-2xl text-gray-900 hover:text-gray-700" @click="updateUser(user._id)" />
                                        <div class="absolute rounded top-[100%] right-0 w-32 bg-black/45 text-white py-1 hidden group-hover:block z-50">
                                            <p class="text-xs">Edit user</p>
                                        </div>
                                    </div>
                                    <div class="relative group">
                                        <Icon icon="fluent:archive-16-filled" class="text-2xl text-red-500 hover:text-red-700" @click="deleteConfirmation = true, userTobeDeleted = user._id" />
                                        <div class="absolute rounded top-[100%] right-0 w-32 bg-black/45 text-white py-1 hidden group-hover:block z-50">
                                            <p class="text-xs">Archive user</p>
                                        </div>
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
                <div class="flex flex-col gap-y-3 items-center w-full">
                    <Icon icon="uiw:warning" class="text-[6rem] text-gray-500" />
                    <p class="text-gray-500 font-manrope text-lg w-4/5 text-center">Do you want to archive this user?</p>
                </div>
                <div class="flex items-center w-4/5 gap-x-5">
                    <button class="bg-red-500 text-white w-1/2 py-1 rounded" @click="deleteConfirmation = false">No</button>
                    <button v-if="!deleting" class="bg-blue-500 text-white w-1/2 py-1 rounded" @click="deleteUser">Yes</button>
                    <button v-else class="bg-blue-500 text-white w-1/2 py-1 rounded animate-pulse" disabled>Deleting</button>
                </div>
            </div>
        </div>
        <!-- update modal -->
        <div v-if="updateConfirmation" class="absolute top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
            <div class="w-[20dvw] h-fit bg-white rounded-md flex flex-col gap-y-5 items-center justify-between py-10">
                <h1 class="font-medium text-lg">Update User</h1>
                <div class="flex flex-col gap-y-2 w-4/5">
                    <label>Full name</label>
                    <input type="text" class="border h-8 rounded pl-2" v-model="userDetails.name">
                </div>
                <div class="flex flex-col gap-y-2 w-4/5">
                    <label>Email</label>
                    <input type="email" class="border h-8 rounded pl-2" v-model="userDetails.email">
                </div>
                <div class="flex flex-col gap-y-2 w-4/5">
                    <label>Phone Number</label>
                    <input type="number" class="border h-8 rounded pl-2" v-model="userDetails.contactNumber" />
                </div>
                <div class="flex flex-col gap-y-2 w-4/5">
                    <label>Address</label>
                    <input type="text" class="border h-8 rounded pl-2" v-model="userDetails.address">
                </div>
                <div class="flex flex-col gap-y-2 w-4/5">
                    <label>Gender</label>
                    <input type="text" class="border h-8 rounded pl-2" v-model="userDetails.gender">
                </div>
                <div class="flex items-center w-4/5 gap-x-5">
                    <button class="bg-red-500 text-white w-1/2 py-1 rounded" @click="updateConfirmation = false">Cancel</button>
                    <button v-if="!updating" class="bg-blue-500 text-white w-1/2 py-1 rounded" @click="update">Update</button>
                    <button v-else class="bg-blue-500 text-white w-1/2 py-1 rounded animate-pulse" disabled>Updating</button>
                </div>
            </div>
        </div>
        <!-- add new user -->
        <addNewUserCom @addedNewUser="addedNewUser" @closeModal="addNewUser = false" v-if="addNewUser" class="absolute top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center"  />
    </section>
</template>

<script setup>
import addNewUserCom from '../components/AddNewUser.vue'
import { computed, onMounted, ref } from "vue";
import axios from 'axios'
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import dobToAge from 'dob-to-age'
import moment from 'moment'
import { useAuthStore } from '../store/index'
const serverUrl = import.meta.env.VITE_SERVER_URL

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const addNewUser = ref(false)

const addedNewUser = (data) => {
    addNewUser.value = false
    users.value.push(data)
}

const users = ref([])
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
        // console.log(res.data)
    } catch (error) {
        console.log(error)
    }
}

const formatBday = (date) => {
    return moment(date).format('ll')
}

const formatNumber = (number) => {
    return number.toString().padStart(4, '0');
}

const searchQuery = ref('');

const filteredUsers = computed(() => {
    if (!searchQuery.value) return users.value || [];
    return users.value.filter(user => {
        const fullName = `${user.name}`.toLowerCase();
        const email = user.email.toLowerCase();
        const address = user.address.toLowerCase();
        const gender = user.gender.toLowerCase();
        return fullName.includes(searchQuery.value.toLowerCase()) || email.includes(searchQuery.value.toLowerCase()) || address.includes(searchQuery.value.toLowerCase()) || gender.includes(searchQuery.value.toLowerCase());
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
        const res = await axios.patch(`${serverUrl}/delete-user/${userTobeDeleted.value}`, {},{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if(res.data === 'failed to delete user') return failedToDelete.value = true

        users.value = users.value.filter(user => user._id != userTobeDeleted.value)
        deleteConfirmation.value = false
    } catch (error) {
        console.log(error)
    }
}

// update user
const userDetails = ref({})

const updateConfirmation = ref(false)
const updating = ref(false)

const updateUser = (userId) => {
    updateConfirmation.value = true

    const user = users.value.find(u => u._id === userId)

    userDetails.value = { ...user }
}

const update = async () => {
    try {
        updating.value = true
        const res = await axios.patch(`${serverUrl}/update-user/${userDetails.value._id}` , userDetails.value,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        )

        if(res.data === 'failed to update user') return

        userDetails.value = {}
        getAllUsers()
        
        console.log(res.data)
    } catch (error) {
        console.log(error)
    }finally{
        updating.value = false
        updateConfirmation.value = false
    }
}

const typeOfExport = ref('')

const handleExportChange = () => {
    if (typeOfExport.value === "CSV") {
        downloadCSV();
    } else if (typeOfExport.value === "PDf") {
        downloadPDF();
    }
    typeOfExport.value = ""
};


// download as csv
const downloadCSV = () => {
    const allUsers = filteredUsers.value;
    if (!allUsers.length) return alert("No users to export!");

    const csvContent = [
        ["ID", "Full Name", "Email", "Phone Number", "Address", "Gender", "Birthdate"],
        ...allUsers.map((user, index) => [
            formatNumber(index + 1),
            user.name,
            user.email,
            user.contactNumber,
            `${user.address}, ${user.municipality || ''}`,
            user.gender,
            formatBday(user.age),
        ]),
    ]
        .map(row => row.join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "users.csv";
    link.click();
};


const downloadPDF = () => {
    const pdf = new jsPDF();
    const table = document.getElementById("userTable");
    const headerImage = "../../header.png"; 
    const today = new Date();

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

    pdf.setFontSize(12);
    pdf.text("Registered Users", 90, 43);
    pdf.setFontSize(10);
    pdf.text("This table provides a detailed list of user accounts registered within the system. It includes essential information such as user identification, contact details, and demographic data. Below is a summary of the current records:", 10, 122, { maxWidth: 190 });

    // Hide the last column
    const lastColumnStyle = document.createElement('style');
    lastColumnStyle.innerHTML = `
        #userTable td:last-child,
        #userTable th:last-child {
            display: none;
        }
    `;

    document.head.appendChild(lastColumnStyle);

    html2canvas(table).then((canvas) => {
        // Remove the style after screenshot
        lastColumnStyle.remove();

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

        pdf.save("Users.pdf");
    });

    typeOfExport.value = ''
};



onMounted(() => {
    getAllUsers()
    authStore.getUser()
})
</script>

<style scoped>
.overflow-x-auto::-webkit-scrollbar {
    display: none;
}
</style>