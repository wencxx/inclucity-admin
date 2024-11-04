<template>
    <section class="font-poppins">
        <div class="flex flex-col gap-y-10 lg:items-center h-fit p-10 overflow-auto bg-white rounded-xl shadow relative"  id="container">
            <Icon icon="mdi:close" class="absolute top-3 right-3 cursor-pointer" @click="closeModal" />
            <h1 class="text-lg capitalize font-medium">Add new user</h1>
            <!-- form -->
            <p v-if="existingEmail" class="text-start bg-red-500 pl-3 text-white py-1 rounded lg:w-96 flex items-center gap-x-2">
                <Icon icon="material-symbols-light:warning-outline" class="text-2xl" />
                <span class="mt-1">Email already taken</span>
            </p>
            <p v-if="invalidNumber" class="text-start bg-red-500 pl-3 text-white py-1 rounded lg:w-96 flex items-center gap-x-2">
                <Icon icon="material-symbols-light:warning-outline" class="text-2xl" />
                <span class="mt-1">Invalid Contact Number</span>
            </p>
            <p v-if="errorRegistering" class="text-start bg-red-500 pl-3 text-white py-1 rounded lg:w-96 flex items-center gap-x-2">
                <Icon icon="material-symbols-light:warning-outline" class="text-2xl" />
                <span class="mt-1">Something went wrong</span>
            </p>
            <form @submit.prevent="register()" class="flex flex-col lg:grid lg:place-content-center lg:grid-cols-2 lg:w-96 items-center gap-x-5 gap-y-5">
                <div class="flex flex-col gap-y-1 w-3/4 md:w-2/5 lg:w-full">
                    <label class="font-semibold text-lg">First Name</label>
                    <input type="text" placeholder="Firstname" class="pl-3 border border-gray-500 h-10 rounded-md capitalize" v-model="firstName" required>
                </div>
                <div class="flex flex-col gap-y-1 w-3/4 md:w-2/5 lg:w-full">
                    <label class="font-semibold text-lg">Middle Name</label>
                    <input type="text" placeholder="Middlename" class="pl-3 border border-gray-500 h-10 rounded-md capitalize" v-model="middleName">
                </div>
                <div class="flex flex-col gap-y-1 w-3/4 md:w-2/5 lg:w-full">
                    <label class="font-semibold text-lg">Last Name</label>
                    <input type="text" placeholder="Lastname" class="pl-3 border border-gray-500 h-10 rounded-md capitalize" v-model="lastName" required>
                </div>
                <div class="flex flex-col gap-y-1 w-3/4 md:w-2/5 lg:w-full">
                    <label class="font-semibold text-lg">Email</label>
                    <input type="text" placeholder="Email" class="pl-3 border border-gray-500 h-10 rounded-md" v-model="email" required>
                </div>
                <div class="flex flex-col gap-y-1 w-3/4 md:w-2/5 lg:w-full">
                    <label class="font-semibold text-lg">Password</label>
                    <div class="w-full border border-gray-500 flex items-center rounded-md overflow-hidden group focus-within:outline outline-black outline-1">
                        <input :type="passwordType" placeholder="Password" class="pl-3 w-full h-10 focus:outline-none" v-model="password" required>
                        <Icon :icon="passwordIconType" class="text-2xl mr-2 bg-white" @click="toggleShowPassword()" />
                    </div>
                </div>
                <div class="flex flex-col gap-y-1 w-3/4 md:w-2/5 lg:w-full">
                    <label class="font-semibold text-lg">Contact Number</label>
                    <input type="number" placeholder="639XXXXXXXXX" class="pl-3 border border-gray-500 h-10 rounded-md" v-model="contactNumber" required>
                </div>
                <div class="flex flex-col gap-y-1 w-3/4 md:w-2/5 lg:w-full">
                    <label class="font-semibold text-lg">Address</label>
                    <input type="text" placeholder="Address" class="pl-3 border border-gray-500 h-10 rounded-md" v-model="address" required>
                        
                </div>
                <div class="flex flex-col gap-y-1 w-3/4 md:w-2/5 lg:w-full">
                    <label class="font-semibold text-lg">Birthdate</label>
                    <input type="date" placeholder="Age" class="pl-3 border border-gray-500 h-10 rounded-md" v-model="age" required>
                </div>
                <div class="flex flex-col gap-y-1 w-3/4 md:w-2/5 lg:w-full">
                    <label class="font-semibold text-lg">Gender</label>
                    <select class="pl-3 border border-gray-500 h-10 rounded-md" v-model="gender" required>
                        <option disabled>Select Gender</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>
                <button v-if="registering" class="bg-custom-primary w-3/4 lg:w-2/5 text-white py-2 rounded-xl uppercase mt-5 hover:bg-red-900 lg:col-span-2 place-self-center animate-pulse" disabled>Adding...</button>
                <button v-else class="bg-custom-primary w-3/4 lg:w-2/5 text-white py-2 rounded-xl uppercase mt-5 hover:bg-red-900 lg:col-span-2 place-self-center">Add</button>
            </form>
        </div>
    </section>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import emailjs from 'emailjs-com';
const serverUrl = import.meta.env.VITE_SERVER_URL

const emit = defineEmits(['closeModal', 'addedNewUser'])

const closeModal = () => {
    emit('closeModal')
}

const route = useRoute()
const router = useRouter()

const passwordType= ref('password')
const passwordIconType = ref('mdi:eye-off-outline')

const toggleShowPassword = () => {
    if(passwordType.value === 'password'){
        passwordType.value = 'text'
        passwordIconType.value = 'mdi:eye-outline'
        return
    }
    passwordType.value = 'password'
    passwordIconType.value = 'mdi:eye-off-outline'
}

const firstName = ref('')
const middleName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const contactNumber = ref('')
const address = ref('')
const age = ref('')
const gender = ref('Select Gender')

const existingEmail = ref(false)
const invalidNumber = ref(false)

const registering = ref(false)
const errorRegistering = ref(false)

const register = async () => {
    invalidNumber.value = false
    existingEmail.value = false
    if(!String(contactNumber.value).startsWith('639')){
        return invalidNumber.value = true
    }

    const userData = {
        name: `${firstName.value} ${middleName.value} ${lastName.value}`,
        email: email.value,
        password: password.value,
        contactNumber: contactNumber.value,
        address: address.value,
        age: age.value,
        gender: gender.value,
    }
    
    try {
        registering.value = true
        const res = await axios.post(`${serverUrl}/register`, userData)

        if(res.status == 201){
            emit('addedNewUser', userData)
        }
    } catch (error) {
        errorRegistering.value = false
        console.log(error)
    }finally{
        registering.value = false
    }
}
</script>

<style scoped>
#container::-webkit-scrollbar {
    background-color: transparent;
    width: 3px;
}
#container::-webkit-scrollbar-thumb {
    background-color: #7B080E;
}
</style>