<template>
    <section class="h-[94dvh] overflow-auto font-poppins py-10 px-5 lg:px-10 bg-gray-100">
        <div class="lg:flex lg:justify-between space-y-3 lg:space-y-0">
                <div class="bg-white h-10 w-fit flex items-center px-3 rounded shadow">
                    <input type="text" placeholder="Search" class="bg-transparent h-8 lg:h-5 focus:outline-none">
                    <Icon icon="iconoir:search" />
                </div>
                <button class="bg-custom-primary h-10 text-white p-2 rounded-md shadow hover:bg-red-950 flex items-center gap-x-1">
                    <Icon icon="ph:export" />
                    Export
                </button>
        </div>
        <!-- table -->
        <div class="w-full mt-12 flex flex-col gap-y-5">
            <div class="w-full overflow-x-auto  rounded-md">
                <table class="w-[150dvw] lg:w-full border-collapse">
                    <thead class="bg-custom-primary text-white md:h-10 font-manrope font-extralight tracking-wide">
                        <tr class="w-full">
                            <th class="md:w-1/12">TITLE</th>
                            <th class="md:w-2/12">FILE ATTACH</th>
                            <th class="md:w-2/12">DATE POSTED</th>
                            <th class="md:w-2/12">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white text-center">
                        <tr v-for="announcement in paginatedAnnouncements" :key="announcement.id" class="border-b border-gray-500">
                            <td class="md:py-3">{{ announcement.title }}</td>
                            <td>{{ announcement.fileAttach }}</td>
                            <td>{{ announcement.datePosted }}</td>
                            <td>
                                <div>
                                    <button>edit</button>
                                    <button>delete</button>
                                </div>
                            </td>
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
    </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const announcements = ref([
    {
        id: 1,
        title: 'dr. quack quack',
        fileAttach: 'fileeattach.jpg',
        datePosted: '10/23/02',
    }
])

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = computed(() => Math.ceil(announcements.value.length / itemsPerPage.value))

const paginatedAnnouncements = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return announcements.value.slice(start, end)
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

</script>

<style>

</style>