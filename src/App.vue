<template>
  <section :class="{ 'lg:flex': isAuth }">
    <Sidebar v-if="isAuth" :class="sidebarDisplay" @toggleSidebar="toggleSidebar" class="w-3/5 md:w-2/5 lg:w-1/6" />
    <div class="h-screen" :class="{'lg:w-5/6': isAuth}">
      <Header v-if="isAuth" :pageName="$route.name" @toggleSidebar="toggleSidebar" />
      <router-view />
    </div
    >  
  </section>  
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../src/store'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'


const sidebarDisplay = ref('hidden')

const toggleSidebar = () => {
  if(sidebarDisplay.value) return sidebarDisplay.value = '' 
  sidebarDisplay.value = 'hidden'
}


const authStore = useAuthStore()

const isAuth = computed(() => authStore.isAuthenticated)
</script>

<style>

</style>