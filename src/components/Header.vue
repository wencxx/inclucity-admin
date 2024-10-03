<template>
  <header class="h-[6dvh] bg-gray-400 flex items-center gap-x-3 px-5 md:px-10">
            <Icon icon="quill:hamburger" class="text-3xl mt-1 text-custom-primary cursor-pointer lg:hidden" @click="toggleSidebar" />
            <h1 class="text-white font-semibold tracking-wide text-xl capitalize">{{ props.pageName }}</h1>
            <div class="text-white flex flex-col text-sm font-light ml-auto">
                <p>{{ month }}-{{ day }}-{{ year }}</p>
                <p>{{ hour }}:{{ minute }} {{ dayPeriod }}</p>
            </div>
    </header>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { defineProps, defineEmits } from 'vue'

const props = defineProps(['pageName'])
const emit = defineEmits(['toggleSidebar'])

const toggleSidebar = () => {
    emit('toggleSidebar')
}


const month = ref('')
const day = ref('')
const year = ref('')
const minute = ref('')
const hour = ref('')
const dayPeriod = ref('')
const rawHour = ref('')

const checkTime = () => {
    const newDate = new Date()
    month.value = newDate.getMonth() + 1
    day.value = newDate.getDate()   
    year.value = newDate.getFullYear()
    minute.value = newDate.getMinutes()
    rawHour.value = newDate.getHours()
    hour.value = rawHour.value % 12 || 12 
}

const checkDayPeriod = () => {
    dayPeriod.value = (rawHour.value >= 12) ? 'pm' : 'am' 
}

onMounted(() => {
    checkTime()
    checkDayPeriod()
    setInterval(() => {
        checkTime()
        checkDayPeriod()
    }, 30000)
})
</script>


<style>

</style>