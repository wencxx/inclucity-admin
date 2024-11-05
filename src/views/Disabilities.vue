<template>
    <section class="h-[94dvh] overflow-auto font-poppins py-10 px-5 lg:px-10 bg-gray-100">
        <div class="lg:flex lg:justify-between space-y-3 lg:space-y-0">
                <div class="bg-white h-10 w-fit flex items-center px-3 rounded shadow">
                    <input type="text" v-model="searchQuery" placeholder="Search" class="bg-transparent h-8 lg:h-5 focus:outline-none">
                    <Icon icon="iconoir:search" />
                </div>
                <button class="bg-custom-primary h-10 text-white p-2 rounded-md shadow hover:bg-red-950 flex items-center gap-x-1" @click="postModal = true">
                    Add Disability
                </button>
        </div>
        <!-- table -->
        <div class="w-full mt-12 flex flex-col gap-y-5">
            <div class="w-full overflow-x-auto  rounded-md">
                <table class="w-[150dvw] lg:w-full border-collapse">
                    <thead class="bg-custom-primary text-white md:h-10 font-manrope font-extralight tracking-wide">
                        <tr class="w-full">
                            <th class="md:w-2/12">DEFAULT DISABILITIES</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white text-center">
                        <tr v-if="disabilities.length > 0" v-for="(disability, index) in disabilities" :key="index" class="border-b border-gray-500">
                            <td v-if="index < 10" class="md:py-3">{{ disability.disability }}</td>
                        </tr>
                        <tr v-else class="border-b border-gray-500">
                            <td colspan="4" class="py-3">Can't find disabilities</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="w-full mt-12 flex flex-col gap-y-5">
            <div class="w-full overflow-x-auto  rounded-md">
                <table class="w-[150dvw] lg:w-full border-collapse">
                    <thead class="bg-custom-primary text-white md:h-10 font-manrope font-extralight tracking-wide">
                        <tr class="w-full">
                            <th class="md:w-2/12">DISABILITY</th>
                            <th class="md:w-2/12">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white text-center">
                        <tr v-if="paginatedDisabilities.length > 0" v-for="disability in paginatedDisabilities" :key="disability._id" class="border-b border-gray-500">
                            <td class="md:py-3">{{ disability.disability }}</td>
                            <td>
                                <div class="flex items-center justify-center gap-x-2">
                                    <div class="relative group">
                                        <Icon icon="mage:edit" class="text-xl cursor-pointer text-green-500" @click="updateDisaiblity(disability._id)" />
                                        <div class="absolute rounded top-[100%] right-0 w-32 bg-black/45 text-white py-1 hidden group-hover:block z-50">
                                            <p class="text-xs">Edit disabilities</p>
                                        </div>
                                    </div>
                                    <div class="relative group">
                                        <Icon icon="fluent:archive-16-filled" class="text-xl cursor-pointer text-red-500" @click="showDeleteModal(disability._id)" />
                                        <div class="absolute rounded top-[100%] right-0 w-32 bg-black/45 text-white py-1 hidden group-hover:block z-50">
                                            <p class="text-xs">Delete disabilities</p>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr v-else class="border-b border-gray-500">
                            <td colspan="4" class="py-3">Can't find disabilities</td>
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

        <div @click.self="postModal = false" v-if="postModal" class="absolute top-0 left-0 h-screen w-screen bg-black/20 flex items-center justify-center">
            <div class="bg-white h-fit w-2/4 xl:w-1/4 rounded overflow-hidden">
                <div class="bg-custom-primary h-[10%]  py-1 flex items-center justify-center">
                    <h1 class="text-xl text-white font-medium tracking-wide">Add Disability</h1>
                </div>
                <form @submit.prevent="addDisability" class="p-5 flex flex-col gap-y-5">
                    <div class="flex flex-col gap-y-2">
                        <label class="text-lg">Disability</label>
                        <input type="text" v-model="disability" class="bg-gray-200 pl-2 focus:outline-none rounded h-10 capitalize">
                    </div>
                    <div class="flex items-center justify-between">
                        <button class="bg-red-500 py-1 w-1/3 rounded text-white shadow hover:bg-red-600" type="button" @click="postModal = false">Cancel</button>
                        <button v-if="!posting" class="bg-green-500 py-1 w-1/3 rounded text-white shadow hover:bg-green-600">Add</button>
                        <button v-else class="bg-green-500 py-1 w-1/3 rounded text-white shadow hover:bg-green-600 animate-pulse" disabled>Adding</button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="postConfirmation" class="absolute top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
            <div class="w-[20dvw] h-1/3 bg-white rounded-md flex flex-col items-center justify-between py-10">
                <Icon icon="lets-icons:check-fill" class="text-[6rem] text-green-500" />
                <p class="text-gray-500 font-manrope text-lg w-4/5 text-center">Disability has been successfully added</p>
                <button class="border border-green-500 text-green-500 w-1/4 py-1 rounded" @click="postConfirmation = false">Ok</button>
            </div>
        </div>

        <div v-if="deleteConfirmation" class="absolute top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
            <div class="w-[20dvw] h-1/3 bg-white rounded-md flex flex-col items-center justify-between py-10">
                <div class="flex flex-col gap-y-3 items-center w-full">
                    <Icon icon="uiw:warning" class="text-[6rem] text-gray-500" />
                    <p class="text-gray-500 font-manrope text-lg w-4/5 text-center">Do you want to delete this disability?</p>
                </div>
                <div class="flex items-center w-4/5 gap-x-5">
                    <button class="bg-red-500 text-white w-1/2 py-1 rounded" @click="deleteConfirmation = false">Cancel</button>
                    <button v-if="!deleting" class="bg-blue-500 text-white w-1/2 py-1 rounded" @click="deletePost">Delete</button>
                    <button v-else class="bg-blue-500 text-white w-1/2 py-1 rounded animate-pulse" @click="deletePost" disabled>Deleting</button>
                </div>
            </div>
        </div>

        <div v-if="deletedSuccessfully" class="absolute top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
            <div class="w-[20dvw] h-1/3 bg-white rounded-md flex flex-col items-center justify-between py-10">
                <Icon icon="lets-icons:check-fill" class="text-[6rem] text-red-500" />
                <p class="text-gray-500 font-manrope text-lg">Disability has been successfully deleted.</p>
                <button class="border border-green-500 text-green-500 w-1/4 py-1 rounded" @click="deletedSuccessfully = false">Ok</button>
            </div>
        </div>

        <!-- update post-->
        <div v-if="updatePostModal" class="absolute top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
            <div class="bg-white h-fit w-2/4 xl:w-1/4 rounded overflow-hidden">
                <div class="bg-custom-primary h-[10%]  py-1 flex items-center justify-center">
                    <h1 class="text-xl text-white font-medium tracking-wide">Update Disability</h1>
                </div>
                <form @submit.prevent="update" class="p-5 flex flex-col gap-y-5">
                    <div class="flex flex-col gap-y-2">
                        <label class="text-lg">Disaiblity</label>
                        <input type="text" v-model="disabilityToUpdate.disability" class="bg-gray-200 pl-2 focus:outline-none rounded h-10">
                    </div>
                    <div class="flex items-center justify-between">
                        <button class="bg-red-500 py-1 w-1/3 rounded text-white shadow hover:bg-red-600" type="button" @click="updatePostModal = false">Cancel</button>
                        <button v-if="!updating" class="bg-green-500 py-1 w-1/3 rounded text-white shadow hover:bg-green-600">Update</button>
                        <button v-else class="bg-green-500 py-1 w-1/3 rounded text-white shadow hover:bg-green-600 animate-pulse" disabled>Updating</button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="updatedConfirmation" class="absolute top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
            <div class="w-[20dvw] h-1/3 bg-white rounded-md flex flex-col items-center justify-between py-10">
                <Icon icon="lets-icons:check-fill" class="text-[6rem] text-green-500" />
                <p class="text-gray-500 font-manrope text-lg w-4/5 text-center">Disability has been successfully updated</p>
                <button class="border border-green-500 text-green-500 w-1/4 py-1 rounded" @click="updatedConfirmation = false">Ok</button>
            </div>
        </div>
    </section>
</template>

<script setup>
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

onMounted(() => {
    getDisabilities()
})

const disabilities = ref([])

const getDisabilities = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/get-disability`)

        if(res.data === 'No disabilities available') return

        disabilities.value = res.data
    } catch (error) {
        console.log(error)
    }
}

const currentPage = ref(1)
const searchQuery = ref('')
const itemsPerPage = ref(10)
const totalPages = computed(() => Math.ceil(disabilities.value.length / itemsPerPage.value))

const filtereddisabilities = computed(() => {
    if (!searchQuery.value) {
        return disabilities.value;
    }
    return disabilities.value.filter(disability =>
        disability.disability.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const paginatedDisabilities = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filtereddisabilities.value.slice(start, end)
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

const postModal = ref(false)


const disability = ref('')

const posting = ref(false)
const postConfirmation = ref(false)

const addDisability = async () => {

    try {
        posting.value = true

        const form = {
            disability: disability.value
        }

        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/add-disability`, form, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if(res.data === 'disability added'){
            postConfirmation.value = true
            disability.value =  ''
            getDisabilities()
            return
        }

        console.log(res.data)
    } catch (error) {
        console.log(error.message)
    }finally{
        postModal.value = false
        posting.value = false
    }
}

const deleteConfirmation = ref(false)
const deletedSuccessfully = ref(false)
const postToBeDeleted = ref('')
const deleting = ref(false)

const showDeleteModal = (postId) => {
    deleteConfirmation.value = true
    postToBeDeleted.value = postId

    console.log(postId)
}

const deletePost = async () => {
    try {
        deleting.value = true
        if(postToBeDeleted.value){
            const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/delete-disability/${postToBeDeleted.value}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if(res.data == 'deleted'){
                getDisabilities()
                deletedSuccessfully.value = true
            }else{

            }
        }else{
            console.log('No post to be deleted')
        }
    } catch (error) {
        console.log(error.message)
    }finally{
        deleteConfirmation.value = false
        deleting.value = false
    }
}

// updating of post
const disabilityToUpdate = ref(null)
const updatePostModal = ref(false)
const updating = ref(false)
const updatedConfirmation = ref(false)

const updateDisaiblity = (postId) => {
    updatePostModal.value = true
    const disability = disabilities.value.find(a => a._id == postId)
    disabilityToUpdate.value = { ...disability }
}

const update = async () => {
    try {
        updating.value = true
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/update-disability/${disabilityToUpdate.value._id}`, {
            ...disabilityToUpdate.value,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if(res.data === 'failed to update posts') return

        getDisabilities()
        updatedConfirmation.value = true
    } catch (error) {
        console.log(error)
    }finally{
        updatePostModal.value = false
        updating.value = false
    }
}

</script>

<style scoped>
.overflow-x-auto::-webkit-scrollbar {
    display: none;
}
</style>