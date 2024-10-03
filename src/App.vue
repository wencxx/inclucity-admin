<template>
  <section :class="{ 'lg:flex': isAuth }">
    <Sidebar v-if="isAuth" :class="sidebarDisplay" @toggleSidebar="toggleSidebar" />
    <div class="h-screen" :class="{'lg:w-4/5': isAuth}">
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