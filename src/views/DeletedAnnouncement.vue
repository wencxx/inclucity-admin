<template>
    <section class="h-[94dvh] overflow-auto font-poppins py-10 px-5 lg:px-10 bg-gray-100">
        <div class="lg:flex lg:justify-between space-y-3 lg:space-y-0">
                <div class="bg-white h-10 w-fit flex items-center px-3 rounded shadow">
                    <input type="text" v-model="searchQuery" placeholder="Search" class="bg-transparent h-8 lg:h-5 focus:outline-none">
                    <Icon icon="iconoir:search" />
                </div>
                <!-- <button class="bg-custom-primary h-10 text-white p-2 rounded-md shadow hover:bg-red-950 flex items-center gap-x-1" @click="postModal = true">
                    Create Post
                </button> -->
        </div>
        <!-- table -->
        <div class="w-full mt-12 flex flex-col gap-y-5">
            <div class="w-full overflow-x-auto  rounded-md">
                <table class="w-[150dvw] lg:w-full border-collapse">
                    <thead class="bg-custom-primary text-white md:h-10 font-manrope font-extralight tracking-wide">
                        <tr class="w-full">
                            <th class="md:w-1/3">TITLE</th>
                            <th class="md:w-1/3">DATE POSTED</th>
                            <th class="md:w-1/3">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody v-if="announcements.length > 0" class="bg-white text-center">
                        <tr v-if="paginatedAnnouncements.length > 0" v-for="announcement in paginatedAnnouncements" :key="announcement.id" class="border-b border-gray-500">
                            <td class="md:py-3">{{ announcement.postTitle }}</td>
                            <td>{{ announcement.datePosted.split('T')[0] }}</td>
                            <td>
                                <div class="flex items-center justify-center gap-x-2">
                                    <div class="relative group">
                                        <Icon icon="ph:eye" class="text-xl cursor-pointer" @click="viewPost(announcement._id)"/>
                                        <div class="absolute rounded top-[100%] right-0 w-32 bg-black/45 text-white py-1 hidden group-hover:block z-50">
                                            <p class="text-xs">View Announcement</p>
                                        </div>
                                    </div>
                                    <div class="relative group">
                                        <Icon icon="mdi:restore" class="text-xl cursor-pointer text-green-500" @click="showDeleteModal(announcement._id)" />
                                        <div class="absolute rounded top-[100%] right-0 w-32 bg-black/45 text-white py-1 hidden group-hover:block z-50">
                                            <p class="text-xs">Restore Announcement</p>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr v-else class="border-b border-gray-500">
                            <td colspan="4" class="py-3">Can't find post</td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="5" class=" text-center py-1 border-b border-gray-500">No post to show</td>
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
                    <h1 class="text-xl text-white font-medium tracking-wide">Create Post</h1>
                </div>
                <form @submit.prevent="addPost" class="p-5 flex flex-col gap-y-5">
                    <div class="flex flex-col gap-y-2">
                        <label class="text-lg">Title</label>
                        <input type="text" v-model="postData.postTitle" class="bg-gray-200 pl-2 focus:outline-none rounded h-10">
                    </div>
                    <div class="flex flex-col gap-y-2">
                        <label class="text-lg">Post Content</label>
                        <textarea class="h-24 bg-gray-200 rounded focus:outline-none p-2" v-model="postData.postDescription"></textarea>
                    </div>
                    <div class="flex flex-col gap-y-2">
                        <label class="text-lg">Insert links</label>
                        <input type="text" v-model="tempUrl" placeholder="seperated by comma" class="bg-gray-200 pl-2 focus:outline-none rounded h-10">
                    </div>
                    <div class="flex items-center justify-between">
                        <button class="bg-red-500 py-1 w-1/3 rounded text-white shadow hover:bg-red-600" type="button" @click="postModal = false">Cancel</button>
                        <button v-if="!posting" class="bg-green-500 py-1 w-1/3 rounded text-white shadow hover:bg-green-600">Post</button>
                        <button v-else class="bg-green-500 py-1 w-1/3 rounded text-white shadow hover:bg-green-600 animate-pulse" disabled>Posting</button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="postConfirmation" class="absolute top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
            <div class="w-[20dvw] h-1/3 bg-white rounded-md flex flex-col items-center justify-between py-10">
                <Icon icon="lets-icons:check-fill" class="text-[6rem] text-green-500" />
                <p class="text-gray-500 font-manrope text-lg w-4/5 text-center">The post has been successfully posted</p>
                <button class="border border-green-500 text-green-500 w-1/4 py-1 rounded" @click="postConfirmation = false">Ok</button>
            </div>
        </div>

        <div v-if="deleteConfirmation" class="absolute top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
            <div class="w-[20dvw] h-1/3 bg-white rounded-md flex flex-col items-center justify-between py-10">
                <Icon icon="uiw:warning" class="text-[6rem] text-green-500" />
                <p class="text-gray-500 font-manrope text-lg w-4/5 text-center">Do you want to restore this announcement?</p>
                <div class="flex items-center w-4/5 gap-x-5">
                    <button class="bg-red-500 text-white w-1/2 py-1 rounded" @click="deleteConfirmation = false">Cancel</button>
                    <button v-if="!deleting" class="bg-blue-500 text-white w-1/2 py-1 rounded" @click="deletePost">Restore</button>
                    <button v-else class="bg-blue-500 text-white w-1/2 py-1 rounded animate-pulse" @click="deletePost" disabled>Restoring</button>
                </div>
            </div>
        </div>

        <div v-if="deletedSuccessfully" class="absolute top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
            <div class="w-[20dvw] h-1/3 bg-white rounded-md flex flex-col items-center justify-between py-10">
                <Icon icon="lets-icons:check-fill" class="text-[6rem] text-green-500" />
                <p class="text-gray-500 font-manrope text-lg text-center">The announcement has been successfully restored.</p>
                <button class="border border-green-500 text-green-500 w-1/4 py-1 rounded" @click="deletedSuccessfully = false">Ok</button>
            </div>
        </div>

         <!-- view post-->
        <div v-if="viewPostModal" class="absolute top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
            <div class="bg-white h-fit w-2/4 xl:w-1/4 rounded overflow-hidden">
                <div class="bg-custom-primary h-[10%]  py-1 flex items-center justify-center">
                    <h1 class="text-xl text-white font-medium tracking-wide">Posts details</h1>
                </div>
                <form @submit.prevent="update" class="p-5 flex flex-col gap-y-5">
                    <div class="flex flex-col gap-y-2">
                        <label class="text-lg">Title</label>
                        <input type="text" v-model="postDetails.postTitle" class="bg-gray-200 pl-2 focus:outline-none rounded h-10" disabled>
                    </div>
                    <div class="flex flex-col gap-y-2">
                        <label class="text-lg">Thumbnails</label>
                        <div class="h-44 bg-gray-200 rounded flex items-center justify-center">
                            <img v-if="postDetails.imageName" :src="postDetails.imageName" alt="" class="h-full">
                            <Icon v-else icon="ri:add-box-fill" class="text-5xl" @click="choosePostImage" />
                            <input type="file" class="hidden" id="file" @change="handleImageChange" disabled>
                        </div>
                    </div>
                    <div class="flex flex-col gap-y-2">
                        <label class="text-lg">Post Content</label>
                        <textarea class="h-24 bg-gray-200 rounded focus:outline-none p-2" v-model="postDetails.postDescription" disabled></textarea>
                    </div>
                    <div class="flex flex-col gap-y-2">
                        <label class="text-lg">Insert links</label>
                        <input type="text" v-model="postDetails.postUrl" placeholder="seperated by comma" class="bg-gray-200 pl-2 focus:outline-none rounded h-10" disabled>
                    </div>
                    <div class="grid grid-cols-3 gap-2">
                        <img v-for="(img, index) in postDetails.mediaUrls" :key="img" :src="img" class="w-full aspect-square rounded" @click="viewImage(postDetails.mediaUrls, index)">
                    </div>
                    <div class="flex items-center justify-end">
                        <button class="bg-red-500 py-1 w-1/3 rounded text-white shadow hover:bg-red-600" type="button" @click="viewPostModal = false">close</button>
                    </div>
                </form>
            </div>
        </div>
        <!-- view images -->
        <div v-if="imagesToView.length" class="absolute top-0 left-0 w-screen h-screen bg-white/25 flex items-center justify-center">
            <Icon icon="mdi:close" class="absolute top-5 right-5 text-3xl cursor-pointer" @click="imagesToView = []" />
            <img :src="imagesToView[currentViewing]" alt="" class="max-w-7xl h-[80dvh] rounded-md">
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
    getNews()
})

// images to view
const imagesToView = ref([])
const currentViewing = ref(0)

const viewImage = (images, index) => {
    imagesToView.value = images
    currentViewing.value = index
}

const announcements = ref([])

const getNews = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/get-deleted-news`)

        if(res.data === 'No news available') return
        
        announcements.value = res.data
    } catch (error) {
        console.log(error)
    }
}

const currentPage = ref(1)
const searchQuery = ref('')
const itemsPerPage = ref(10)
const totalPages = computed(() => Math.ceil(announcements.value.length / itemsPerPage.value))

const filteredAnnouncements = computed(() => {
    if (!searchQuery.value) {
        return announcements.value;
    }
    return announcements.value.filter(announcement =>
        announcement.postTitle.toLowerCase().includes(searchQuery.value.toLowerCase()) || announcement.datePosted.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const paginatedAnnouncements = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredAnnouncements.value.slice(start, end)
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
            const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/restore-post/${postToBeDeleted.value}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if(res.data == 'deleted'){
                getNews()
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

// viewing of post
const postDetails = ref(null)
const viewPostModal = ref(false)

const viewPost = (postId) => {
    viewPostModal.value = true
    const post = announcements.value.find(a => a._id == postId)
    postDetails.value = { ...post }
}

</script>

<style scoped>
.overflow-x-auto::-webkit-scrollbar {
    display: none;
}
</style>