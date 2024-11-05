<template>
  <header class="h-[6dvh] bg-gray-400 flex items-center gap-x-3 px-5 md:px-10">
    <Icon icon="quill:hamburger" class="text-3xl mt-1 text-custom-primary cursor-pointer lg:hidden" @click="toggleSidebar" />
    <h1 class="text-white font-semibold tracking-wide text-xl capitalize">{{ props.pageName }}</h1>
    <div class="text-white flex flex-col text-sm font-light ml-auto">
      <p>{{ formatedDate }}</p>
      <p>{{ currentTime }}</p>
    </div>
  </header>
</template>

<script setup>
import moment from "moment"
import { ref, onMounted, onUnmounted } from "vue"
import { defineProps, defineEmits } from 'vue'

const props = defineProps(['pageName'])
const emit = defineEmits(['toggleSidebar'])

const toggleSidebar = () => {
    emit('toggleSidebar')
}

// Date and time variables
const formatedDate = moment().format('ll')
const currentTime = ref(moment().format('LTS'))

// Update time every second
onMounted(() => {
  const interval = setInterval(() => {
    currentTime.value = moment().format('LTS')
  }, 1000)

  // Clear interval on unmount
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<style>
</style>
