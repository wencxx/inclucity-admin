<template>
    <section class="h-[94dvh] overflow-auto font-poppins py-10 px-5 lg:px-10 bg-gray-100" id="mainContent">
        <div class="lg:flex justify-between">
            <h1 class="text-xl font-manrope font-semibold">Welcome Admin!</h1>
            <div class="flex justify-between lg:justify-normal items-center gap-x-3">
                <div class="bg-white w-fit flex items-center py-2 px-3 rounded shadow">
                    <input type="text" placeholder="Search" class="bg-transparent h-5 focus:outline-none">
                    <Icon icon="iconoir:search" />
                </div>
                <select class="rounded h-8 shadow">
                    <option>10-23-2023</option>
                    <option>10-23-2024</option>
                    <option>10-23-2025</option>
                    <option>10-23-2026</option>
                </select>
                <button class="bg-custom-primary text-white p-2 rounded-md shadow hover:bg-red-950 flex items-center gap-x-1">
                    <Icon icon="ph:export" />
                    Export
                </button>
            </div>
        </div>
       <div class="grid lg:grid-cols-7 place-items-center lg:place-items-start gap-y-10 gap-x-10 mt-5">
           <div class="bg-white shadow font-poppins p-3 md:p-5 lg:p-10 w-full lg:w-full lg:h-[35dvh] lg:col-span-4 rounded cursor-pointer" @click="redirect()">
                <h1 class="font-bold text-gray-600 text-sm lg:text-lg">Number of Persons with Impairment per Barangay</h1>
                <Bar
                    class="!w-full"
                    :options="chartOptionsBar"
                    :data="chartDataBar"
                />
           </div>
           <div class="bg-white shadow font-poppins p-3 md:p-5 lg:p-10 w-full lg:w-full lg:h-[35dvh] lg:col-span-3 flex flex-col items-center rounded">
                <h1 class="font-bold text-gray-600 text-sm lg:text-lg">Number of Persons with Impairment per Barangay</h1>
                <Doughnut
                    class="!w-3/4 !h-3/4  lg:!w-4/5 lg:!h-full"
                    :options="chartOptionsDougnut"
                    :data="chartDataDoughnut"
                />
           </div>
       </div>
    </section>
</template>

<script setup>
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const chartDataBar = ref({
    labels: ['January', 'February', 'March'],
    datasets: [{ 
        data: [40, 20, 12],
        backgroundColor: ['#7B080E', '#0641d8']
    }],
    
})

const chartOptionsBar = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
        legend: {
            display: false,
        }
    }
}

const chartDataDoughnut = ref({
    labels: ['January', 'February', 'March'],
    datasets: [{ 
        data: [40, 20, 12],
        backgroundColor: ['#7B080E', '#0641d8', '#ffac39']
    }],
    
})

const chartOptionsDougnut = {
    responsive: true,
    plugins: {
        legend: {
            // position: 'right'
        }
    }
}


const redirect = () => {
    router.push('/user-accounts')
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
