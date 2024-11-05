<template>
    <section class="h-[94dvh] overflow-auto font-poppins py-10 px-5 lg:px-10 bg-gray-100" id="mainContent">
        <div class="lg:flex justify-between">
            <h1 class="text-xl font-manrope font-semibold">Welcome Admin!</h1>
            <div class="flex justify-between lg:justify-normal items-center gap-x-3">
                <div class="bg-white w-fit flex items-center py-2 px-3 rounded shadow">
                    <input type="text" placeholder="Search" class="bg-transparent h-5 focus:outline-none">
                    <Icon icon="iconoir:search" />
                </div>
                <!-- <select class="rounded h-8 shadow px-2">
                    <option>10-23-2023</option>
                    <option>10-23-2024</option>
                    <option>10-23-2025</option>
                    <option>10-23-2026</option>
                </select> -->
                <button class="bg-custom-primary text-white p-2 rounded-md shadow hover:bg-red-950 flex items-center gap-x-1" @click="saveDashboard">
                    <Icon icon="ph:export" />
                    Export
                </button>
            </div>
        </div>
       <div class="grid lg:grid-cols-7 place-items-center lg:place-items-start gap-5 mt-5" ref="captureDiv" id="dashboard">
            <div class="bg-white shadow font-poppins p-3 md:p-5 lg:p-5 w-full lg:w-full lg:h-[20dvh] lg:col-span-7 rounded-md cursor-pointer grid grid-cols-4 gap-x-10">
                <div class="bg-custom-primary w-full h-full rounded p-4 flex justify-between items-center text-white" @click="redirectUsers()">
                    <Icon class="text-5xl" icon="heroicons:user-group" />
                    <div class="flex flex-col gap-2 items-end">
                        <p class="text-2xl font-bold">{{ userTotal - 1 }}</p>
                        <p>Registered User</p>
                    </div>
                </div>
                <div class="bg-custom-primary w-full h-full rounded p-4 flex justify-between items-center text-white" @click="redirectExpired()">
                    <Icon class="text-5xl" icon="hugeicons:passport-expired" />
                    <div class="flex flex-col gap-2 items-end">
                        <p class="text-2xl font-bold">{{ expiredApplicantsCount }}</p>
                        <p>Expired Applicants</p>
                    </div>
                </div>
                <div class="bg-custom-primary w-full h-full rounded p-4 flex justify-between items-center text-white" @click="redirectRejected()">
                    <Icon class="text-5xl" icon="ei:close-o"  />
                    <div class="flex flex-col gap-2 items-end">
                        <p class="text-2xl font-bold">{{ rejectedApplicantsCount }}</p>
                        <p>Rejected Applicants</p>
                    </div>
                </div>
                <div class="bg-custom-primary w-full h-full rounded p-4 flex justify-between items-center text-white" @click="redirectApproved()">
                    <Icon class="text-5xl" icon="duo-icons:approved" />
                    <div class="flex flex-col gap-2 items-end">
                        <p class="text-2xl font-bold">{{ approvedApplicantsCount }}</p>
                        <p>Approved Applicants</p>
                    </div>
                </div>
            </div>
            <div v-if="barangay.length > 0" class="bg-white shadow font-poppins p-3 md:p-5 lg:p-10 w-full lg:w-full lg:h-[35dvh] lg:col-span-4 rounded cursor-pointer" @click="redirect()">
                    <h1 class="font-bold text-gray-600 text-sm lg:text-lg">Number of Persons with Impairment per Barangay</h1>
                    <Bar
                        class="!w-full block"
                        :options="chartOptionsBar"
                        :data="chartDataBar"
                    />
            </div>
            <div v-if="barangay.length > 0" class="bg-white shadow font-poppins p-3 md:p-5 xl:p-10 w-full xl:w-full xl:h-[35dvh] xl:col-span-3 flex flex-col items-center rounded cursor-pointer" @click="redirectTotal()">
                    <h1 class="font-bold text-gray-600 text-sm xl:text-lg">Total number of PWDs in Malolos</h1>
                    <Doughnut
                        class="!w-2/4 !h-2/4  xl:!w-4/5 xl:!h-full"
                        :options="chartOptionsDougnut"
                        :data="chartDataDoughnut"
                    />
            </div>
            <div v-if="barangay.length > 0" class="bg-white shadow font-poppins p-3 md:p-5 lg:p-10 w-full lg:w-full lg:h-[35dvh] lg:col-span-5 rounded cursor-pointer" @click="redirectEmploy()">
                    <h1 class="font-bold text-gray-600 text-sm lg:text-lg">Employment Rate Status</h1>
                    <Bar
                        class="!w-full block"
                        :options="chartOptionsBar2"
                        :data="chartDataBar2"
                    />
            </div>
            <div class="bg-white shadow font-poppins p-4 w-full lg:w-full lg:h-[35dvh] lg:col-span-2 rounded cursor-pointer grid grid-rows-3 gap-y-2" @click="redirectEmploy()">
                <div class="bg-custom-primary w-full h-full rounded p-4 flex justify-between items-center text-white">
                    <Icon class="text-5xl" icon="uit:bag" />
                    <div class="flex flex-col gap-2 items-end">
                        <p class="text-2xl font-bold">{{ employedCount }}</p>
                        <p>Employed</p>
                    </div>
                </div>
                <div class="bg-custom-primary w-full h-full rounded p-4 flex justify-between items-center text-white">
                    <Icon class="text-5xl" icon="streamline:office-worker" />
                    <div class="flex flex-col gap-2 items-end">
                        <p class="text-2xl font-bold">{{ selfEmployedCount }}</p>
                        <p>Self-Employed</p>
                    </div>
                </div>
                <div class="bg-custom-primary w-full h-full rounded p-4 flex justify-between items-center text-white">
                    <Icon class="text-5xl" icon="uil:bag-slash" />
                    <div class="flex flex-col gap-2 items-end">
                        <p class="text-2xl font-bold">{{ unEmployedCount }}</p>
                        <p>Unemployed</p>
                    </div>
                </div>
            </div>
            <div v-if="barangay.length > 0" class="bg-white shadow font-poppins p-3 md:p-5 lg:p-10 w-full lg:w-full lg:h-[35dvh] lg:col-span-4 rounded cursor-pointer">
                    <h1 class="font-bold text-gray-600 text-sm lg:text-lg">Top 5 Disability in Malolos</h1>
                    <Bar
                        class="!w-full block"
                        :options="chartOptionsBar3"
                        :data="chartDataBar3"
                    />
            </div>
            <div v-if="barangay.length > 0" class="bg-white shadow font-poppins p-3 md:p-5 xl:p-10 w-full xl:w-full xl:h-[35dvh] xl:col-span-3 flex flex-col items-center rounded cursor-pointer" @click="redirectTotal()">
                    <h1 class="font-bold text-gray-600 text-sm xl:text-lg">Total number of Applicants in Malolos</h1>
                    <Doughnut
                        class="!w-2/4 !h-2/4  xl:!w-4/5 xl:!h-full"
                        :options="chartOptionsDougnut"
                        :data="chartDataDoughnut2"
                    />
            </div>
       </div>
    </section>
</template>

<script setup>
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

const router = useRouter()

onMounted(() => {
    getGroupedBarangay()
    getTotalPwds()
    getTotalUsers()
    getGroupedEmployment()
    getApprovedApplicant()
    getRejectedApplicant()
    getExpiredApplicant()
    getTotalEmployment()
    getGroupedDisablity()
})

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, ChartDataLabels)

const barangay = ref([])
const barangayData = ref([])

const getGroupedBarangay = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/get-group-barangay`)

        if(res.data){
            res.data.forEach(bar => {
                barangay.value.push(bar._id)
                barangayData.value.push(bar.count)
            });
        }
    } catch (error) {
        console.log(error.message)
    }
}

const chartDataBar = ref({
    labels: barangay.value,
    datasets: [{ 
        data: barangayData.value,
        backgroundColor: ['#7B080E', '#0641d8']
    }],

    
})

const chartOptionsBar = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
        legend: {
            display: false,
        },
        datalabels: {
            display: false
        }
    },
    devicePixelRatio: 4
}

const disability = ref([]);
const disabilityData = ref([]);

const chartDataBar3 = computed(() => ({
    labels: disability.value,
    datasets: [{ 
        data: disabilityData.value,
        backgroundColor: ['#7B080E', '#0641d8']
    }],
}));

const getGroupedDisablity = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/get-group-disability-per-barangay`);

        if (res.data) {
            disability.value = res.data.map(dis => dis._id);
            disabilityData.value = res.data.map(dis => dis.count);
        }
    } catch (error) {
        console.log(error);
    }
}

const chartOptionsBar3 = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        datalabels: {
            display: false
        }
    },
    scales: {
        x: {
            ticks: {
                font: {
                    size: 10,
                }
            }
        },
    },
    devicePixelRatio: 4
};

const maleCount = ref(0)
const femaleCount = ref(0)
const total = computed(() => maleCount.value + femaleCount.value)

const getTotalPwds = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/get-total-pwds`)
        if (res.data) {
            res.data.forEach(gen => {
                if (gen._id === 'Male') {
                    maleCount.value = gen.count
                } else {
                    femaleCount.value = gen.count
                }
            });
        }
    } catch (error) {
        console.log(error.message)
    }
}

const userMaleCount = ref(0)
const userFemaleCount = ref(0)
const userTotal = computed(() => userMaleCount.value + userFemaleCount.value)

const getTotalUsers = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/get-total-users`)
        if (res.data) {
            res.data.forEach(gen => {
                if (gen._id === 'Male') {
                    userMaleCount.value = gen.count
                } else {
                    userFemaleCount.value = gen.count
                }
            });
        }
    } catch (error) {
        console.log(error.message)
    }
}

const approvedApplicantsCount = ref(0)

const getApprovedApplicant = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/get-approved-applicants`)
        if (res.data) {
            approvedApplicantsCount.value = res.data.count
        }
    } catch (error) {
        console.log(error.message)
    }
}

const rejectedApplicantsCount = ref(0)

const getRejectedApplicant = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/get-rejected-applicants`)
        if (res.data) {
            rejectedApplicantsCount.value = res.data.count
        }
    } catch (error) {
        console.log(error.message)
    }
}

const expiredApplicantsCount = ref(0)

const getExpiredApplicant = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/get-expired-applicants`)
        if (res.data) {
            expiredApplicantsCount.value = res.data.count
        }
    } catch (error) {
        console.log(error.message)
    }
}

const chartDataDoughnut = computed(() => ({
    labels: ['Male', 'Female', 'Total'],
    datasets: [{
        data: [maleCount.value, femaleCount.value, total.value], 
        backgroundColor: ['#7B080E', '#0641d8', '#ffac39']
    }]
}))

const chartDataDoughnut2 = computed(() => ({
    labels: ['Aprroved', 'Rejected', 'Total'],
    datasets: [{
        data: [approvedApplicantsCount.value, rejectedApplicantsCount.value, total.value], 
        backgroundColor: ['#7B080E', '#0641d8', '#ffac39']
    }]
}))

const month = ref([]);
const employed = ref([]);
const unemployed = ref([]);
const selfemployed = ref([]);
const noEmployment = ref(false);

const getTotalEmployment = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/get-total-employment-chart`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (res.data === 'no data') {
            noEmployment.value = true;
            month.value = [];
            employed.value = [];
            unemployed.value = [];
            selfemployed.value = [];
            return;
        }

        month.value = [];
        employed.value = [];
        unemployed.value = [];
        selfemployed.value = [];

        res.data.forEach(d => {
            const convertedMonth = convertMonth(parseInt(d.month))
            month.value.push(convertedMonth);
            employed.value.push(d.employed);
            unemployed.value.push(d.unemployed);
            selfemployed.value.push(d.selfemployed);
        });
    } catch (error) {
        console.log(error.message);
    }
};

const convertMonth = (month) => {
    switch (month) {
        case 1:
            return 'January';
        case 2:
            return 'February';
        case 3:
            return 'March';
        case 4:
            return 'April';
        case 5:
            return 'May';
        case 6:
            return 'June';
        case 7:
            return 'July';
        case 8:
            return 'August';
        case 9:
            return 'September';
        case 10:
            return 'October';
        case 11:
            return 'November';
        case 12:
            return 'December';
        default:
            return 'Invalid month'; 
    }
};


const chartOptionsDougnut = {
    responsive: true,
    plugins: {
        datalabels: {
            color: '#fff',
            anchor: 'end',
            align: 'start',
            formatter: (value) => value,
            font: {
                size: 14
            }
        }
    },
    devicePixelRatio: 4
}


const chartDataBar2 = computed(() => {
    return {
        labels: month.value,
        datasets: [
            {
                label: 'Employed',
                data: employed.value,
                backgroundColor: '#0641d8',
            },
            {
                label: 'Self-Employed',
                data: selfemployed.value,
                backgroundColor: '#ffac39',
            },
            {
                label: 'Unemployed',
                data: unemployed.value,
                backgroundColor: '#7B080E'
            }
        ]
    };
});


const chartOptionsBar2 = {
    responsive: true,
    plugins: {
        legend: {
            display: true,
            position: 'top',
            labels: {
                color: 'black',
                font: {
                    size: 10
                },
                usePointStyle: true,
                pointStyle: 'circle',
                Align: 'end'
            }
        },
        datalabels: {
            display: false
        }
    },
    devicePixelRatio: 4
}

const employedCount = ref(0)
const selfEmployedCount = ref(0)
const unEmployedCount = ref(0)

const getGroupedEmployment = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/get-group-employment`)

        if(res.data){
            res.data.forEach(data => {
                if(data._id === 'self-employed'){
                    selfEmployedCount.value = data.count
                }else if(data._id === 'employed'){
                    employedCount.value = data.count
                }else{
                    unEmployedCount.value = data.count
                }
            })
        }
    } catch (error) {
        console.log(error.message)
    }
}

const captureDiv = ref(null);
const saved = ref(false)

// const saveDashboard = async () => {
//   if (captureDiv.value) {
//     const canvas = await html2canvas(captureDiv.value);

//     const image = canvas.toDataURL('image/png');

//     const link = document.createElement('a');
//     link.href = image;
//     link.download = 'dashboard.png';
//     link.click();
//     saved.value = true
//   }
// };

const saveDashboard = () => {
    if(captureDiv.value){
        const pdf = new jsPDF();
        const table = document.getElementById("dashboard");
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

            pdf.save("Dashboard.pdf");
        });
    }
}

const redirectUsers = () => {
    router.push('/user-accounts')
}

const redirectApproved = () => {
    router.push('/registered-pwd')
}

const redirectExpired = () => {
    router.push({
        path: '/registered-pwd',
        query: {
            page: 'expired'
        }
    })
}

const redirectRejected = () => {
    router.push('/rejected')
}

const redirect = () => {
    router.push('/pwd-per-barangay')
}

const redirectTotal = () => {
    router.push('/total-pwd')
}

const redirectEmploy = () => {
    router.push('/total-employment')
}
</script>


<style scoped>
#mainContent::-webkit-scrollbar {
    background-color: transparent;
    width: 5px;
}
#mainContent::-webkit-scrollbar-thumb {
    background-color: #7B080E;
    border-radius: 50px;
}
</style>
