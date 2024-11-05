<template>
    <section class="h-[94dvh] overflow-auto font-poppins py-10 px-5 lg:px-10 bg-gray-100">
        <div class="lg:flex lg:justify-between space-y-3 lg:space-y-0">
                <div class="bg-white h-10 w-fit flex items-center px-3 rounded shadow">
                    <input type="text" v-model="searchQuery" placeholder="Search" class="bg-transparent h-8 lg:h-5 focus:outline-none">
                    <Icon icon="iconoir:search" />
                </div>
                <button class="bg-custom-primary h-10 text-white p-2 rounded-md shadow hover:bg-red-950 flex items-center gap-x-1" @click="postModal = true">
                    Create Post
                </button>
        </div>
        <!-- table -->
        <div class="w-full mt-12 flex flex-col gap-y-5">
            <div class="w-full overflow-x-auto  rounded-md">
                <table class="w-[150dvw] lg:w-full border-collapse">
                    <thead class="bg-custom-primary text-white md:h-10 font-manrope font-extralight tracking-wide">
                        <tr class="w-full">
                            <th class="md:w-1/12">TITLE</th>
                            <th class="md:w-2/12">DATE POSTED</th>
                            <th class="md:w-2/12">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody v-if="announcements.length > 0" class="bg-white text-center">
                        <tr v-if="paginatedAnnouncements.length > 0" v-for="announcement in paginatedAnnouncements" :key="announcement._id" class="border-b border-gray-500">
                            <td class="md:py-3">{{ announcement.postTitle }}</td>
                            <td>{{ announcement.datePosted.split('T')[0] }}</td>
                            <td>
                                <div class="flex items-center justify-center gap-x-2">
                                    <div class="relative group">
                                        <Icon icon="ph:eye" class="text-xl cursor-pointer" @click="viewPost(announcement._id)" />
                                        <div class="absolute rounded top-[100%] right-0 w-32 bg-black/45 text-white py-1 hidden group-hover:block z-50">
                                            <p class="text-xs">View Announcement</p>
                                        </div>
                                    </div>
                                    <div class="relative group">
                                        <Icon icon="mage:edit" class="text-xl cursor-pointer text-green-500" @click="updatePost(announcement._id)" />
                                        <div class="absolute rounded top-[100%] right-0 w-32 bg-black/45 text-white py-1 hidden group-hover:block z-50">
                                            <p class="text-xs">Edit Announcement</p>
                                        </div>
                                    </div>
                                    <div class="relative group">
                                        <Icon icon="fluent:archive-16-filled" class="text-xl cursor-pointer text-red-500" @click="showDeleteModal(announcement._id)" />
                                        <div class="absolute rounded top-[100%] right-0 w-32 bg-black/45 text-white py-1 hidden group-hover:block z-50">
                                            <p class="text-xs">Archive Announcement</p>
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
                    <!-- <div class="flex flex-col gap-y-2">
                        <label class="text-lg">Thumbnails</label>
                        <div class="h-44 bg-gray-200 rounded flex items-center justify-center">
                            <div v-if="tempImage" class="relative group h-full">
                                <img :src="tempImage" alt="" class="h-full">
                                <div class="absolute top-2 right-2 bg-gray-500/50 cursor-pointer rounded-full p-[3px] hidden group-hover:block" @click="removeThumbnail">
                                    <Icon icon="mdi:close" />
                                </div>
                            </div>
                            <Icon v-else icon="ri:add-box-fill" class="text-5xl" @click="choosePostImage" />
                            <input type="file" class="hidden" accept=".jpg, .jpeg, .png" id="file" @change="handleImageChange">
                        </div>
                    </div> -->
                    <div class="flex flex-col gap-y-2">
                        <label class="text-lg">Media</label>
                        <div class="h-10 bg-gray-200 rounded flex items-center justify-center gap-x-2" @click.self="choosePostMedia">
                            <Icon icon="ri:add-box-fill" class="text-3xl" @click="choosePostMedia" />
                            <p>Add images</p>
                            <input type="file" class="hidden" accept=".jpg, .jpeg, .png" id="media" multiple @change="handleMediaChange">
                        </div>
                        <div class="flex gap-x-2 items-center">
                            <div v-for="(img, index) in tempMedia" :key="index" class="relative group">
                                <img :src="img" class="w-16 object-cover rounded aspect-square">
                                <div class="absolute top-1 bg-gray-500/50 p-[1px] hidden group-hover:block rounded-full cursor-pointer right-1" @click="removeMedia(index)">
                                    <Icon icon="mdi:close" class="text-sm text-white" />
                                </div>
                            </div>
                        </div>
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
                <div class="flex flex-col gap-y-3 items-center w-full">
                    <Icon icon="uiw:warning" class="text-[6rem] text-gray-500" />
                    <p class="text-gray-500 font-manrope text-lg w-4/5 text-center">Do you want to archive this post?</p>
                </div>
                <div class="flex items-center w-4/5 gap-x-5">
                    <button class="bg-red-500 text-white w-1/2 py-1 rounded" @click="deleteConfirmation = false">No</button>
                    <button v-if="!deleting" class="bg-blue-500 text-white w-1/2 py-1 rounded" @click="deletePost">Yes</button>
                    <button v-else class="bg-blue-500 text-white w-1/2 py-1 rounded animate-pulse" @click="deletePost" disabled>Deleting</button>
                </div>
            </div>
        </div>

        <div v-if="deletedSuccessfully" class="absolute top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
            <div class="w-[20dvw] h-1/3 bg-white rounded-md flex flex-col items-center justify-between py-10">
                <Icon icon="lets-icons:check-fill" class="text-[6rem] text-red-500" />
                <p class="text-gray-500 font-manrope text-lg text-center">The post has been successfully deleted.</p>
                <button class="border border-green-500 text-green-500 w-1/4 py-1 rounded" @click="deletedSuccessfully = false">Ok</button>
            </div>
        </div>

        <!-- update post-->
        <div v-if="updatePostModal" class="absolute top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
            <div class="bg-white h-fit w-2/4 xl:w-1/4 rounded overflow-hidden">
                <div class="bg-custom-primary h-[10%]  py-1 flex items-center justify-center">
                    <h1 class="text-xl text-white font-medium tracking-wide">Update Post</h1>
                </div>
                <form @submit.prevent="update" class="p-5 flex flex-col gap-y-5">
                    <div class="flex flex-col gap-y-2">
                        <label class="text-lg">Title</label>
                        <input type="text" v-model="postToUpdateDetails.postTitle" class="bg-gray-200 pl-2 focus:outline-none rounded h-10">
                    </div>
                    <div class="flex flex-col gap-y-2">
                        <label class="text-lg">Thumbnails</label>
                        <div class="h-44 bg-gray-200 rounded flex items-center justify-center">
                            <img v-if="postToUpdateDetails.imageName" :src="postToUpdateDetails.imageName" alt="" class="h-full">
                            <Icon v-else icon="ri:add-box-fill" class="text-5xl" @click="choosePostImage" />
                            <input type="file" class="hidden" id="file" @change="handleImageChange">
                        </div>
                    </div>
                    <div class="flex flex-col gap-y-2">
                        <label class="text-lg">Post Content</label>
                        <textarea class="h-24 bg-gray-200 rounded focus:outline-none p-2" v-model="postToUpdateDetails.postDescription"></textarea>
                    </div>
                    <div class="flex flex-col gap-y-2">
                        <label class="text-lg">Insert links</label>
                        <input type="text" v-model="postToUpdateDetails.postUrl" placeholder="seperated by comma" class="bg-gray-200 pl-2 focus:outline-none rounded h-10">
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
                <p class="text-gray-500 font-manrope text-lg w-4/5 text-center">The post has been successfully updated</p>
                <button class="border border-green-500 text-green-500 w-1/4 py-1 rounded" @click="updatedConfirmation = false">Ok</button>
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
                        <label class="text-lg">Post Content</label>
                        <textarea class="h-24 bg-gray-200 rounded focus:outline-none p-2" v-model="postDetails.postDescription" disabled></textarea>
                    </div>
                    <div class="flex flex-col gap-y-2">
                        <label class="text-lg">Insert links</label>
                        <input type="text" v-model="postDetails.postUrl" placeholder="seperated by comma" class="bg-gray-200 pl-2 focus:outline-none rounded h-10" disabled>
                    </div>
                    <div class="flex items-center justify-end">
                        <button class="bg-red-500 py-1 w-1/3 rounded text-white shadow hover:bg-red-600" type="button" @click="viewPostModal = false">close</button>
                    </div>
                </form>
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
    getNews()
})

const announcements = ref([])

const getNews = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/get-news`)

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
        announcement.postTitle.toLowerCase().includes(searchQuery.value.toLowerCase())
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

const postModal = ref(false)

const choosePostImage = () => {
    const imageInput = document.getElementById('file')

    imageInput.click()
}

const postData = ref({
    postTitle: '',
    postDescription: '',
    postUrl: [],
    image: [],
    media: []
})


const tempUrl = ref('')
const tempImage = ref(null)

const handleImageChange = () => {
    const uploadedImage = event.target.files[0]

    postData.value.image = uploadedImage
    tempImage.value = URL.createObjectURL(uploadedImage)
}

const removeThumbnail = () => {
    tempImage.value = null
    postData.value.image = []
}

const choosePostMedia = () => {
    const imageInput = document.getElementById('media')

    imageInput.click()
}

const tempMedia = ref([])

const handleMediaChange = () => {
    const files = event.target.files

    for(const file of files){
        postData.value.media.push(file)
        const url = URL.createObjectURL(file)
        tempMedia.value.push(url)
    }
}

const removeMedia = (index) => {
    tempMedia.value.splice(index, 1)
    postData.value.media.splice(index, 1)
}

const posting = ref(false)
const postConfirmation = ref(false)

const addPost = async () => {
    postData.value.postUrl = tempUrl.value.split(',');

    const formData = new FormData();
    formData.append('postTitle', postData.value.postTitle);
    formData.append('postDescription', postData.value.postDescription);
    formData.append('postUrl', JSON.stringify(postData.value.postUrl));

    if (postData.value.image) {
        formData.append('image', postData.value.image);
    }

    postData.value.media.forEach(file => {
        formData.append('media', file); 
    });

    try {
        posting.value = true;
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/add-announcement`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (res.data == 'News added') {
            postConfirmation.value = true;
            postData.value = {
                postTitle: '',
                postDescription: '',
                postUrl: [],
                image: null, 
                media: [],   
            };
            tempUrl.value = '';
            tempImage.value = null;
            tempMedia.value = [];
            getNews();
        }

        console.log(res.data);
    } catch (error) {
        console.log(error.message);
    } finally {
        postModal.value = false;
        posting.value = false;
    }
};


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
            const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/delete-post/${postToBeDeleted.value}`, {}, {
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

// updating of post
const postToUpdateDetails = ref(null)
const updatePostModal = ref(false)
const updating = ref(false)
const updatedConfirmation = ref(false)

const updatePost = (postId) => {
    updatePostModal.value = true
    const ngi = announcements.value.find(a => a._id == postId)
    postToUpdateDetails.value = { ...ngi }
}

const update = async () => {
    const postUrl = postToUpdateDetails.value.postUrl
    try {
        updating.value = true
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/update-announcement/${postToUpdateDetails.value._id}`, {
            ...postToUpdateDetails.value,
            postUrl: JSON.stringify(postUrl.toString().split(','))
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if(res.data === 'failed to update posts') return

        updatedConfirmation.value = true

        console.log(res.data)
    } catch (error) {
        console.log(error)
    }finally{
        updatePostModal.value = false
        updating.value = false
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