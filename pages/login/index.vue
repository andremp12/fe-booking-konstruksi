<script setup lang="ts">
  import {useAuthStore} from "~/stores/authStore";

  definePageMeta({
    name: "Login",
  })

  const show = ref(true)
  const toast = useToast()
  const isLogin = ref(false)
  const isLoader = ref(false)
  const email = ref('')
  const password = ref('')
  const authStore = useAuthStore()
  const token = ref(null)

  const login = async () => {
    isLoader.value = true
    const payload = {
      'email': email.value,
      'password': password.value,
    }

    await authStore.login(payload).then(async (result:any) => {
      isLogin.value = true
      token.value = result.data.token
    }).catch(async (error:any) => {
      isLoader.value = false
      isLogin.value = false

      toast.add({
        icon: "i-heroicons-exclamation-triangle",
        color: "red",
        title: "Gagal!",
        timeout: 3000,
        description: error.data.message,
        "ui": constantData.errorNotificationStyle()
      })
    })

      if(isLogin.value){
        await authStore.validateToken(token.value).then(async (result:any) => {
          // authStore.userData = result.data

          const role = result.data.role
          console.log(authStore.authState)

          if (role === 'admin'){
            setTimeout(()=>{
              navigateTo('/admin/dashboard')
            },2000)
          }
          if (role === 'mandor'){
            setTimeout(()=>{
              navigateTo('/mandor')
            },2000)
          }
          if (role === 'client'){
            setTimeout(()=>{
              navigateTo('/client')
            },2000)
          }
        }).catch(async (error:any) => {
          isLogin.value = false

          toast.add({
            icon: "i-heroicons-exclamation-triangle",
            color: "red",
            title: "Gagal!",
            timeout: 3000,
            description: error.data.message,
            "ui": constantData.errorNotificationStyle()
          })
        })
      }
  }
</script>

<template>
  <div class="w-full flex md:min-h-screen p-8 justify-center items-center">
    <div class="p-4 shadow-md border border-gray-200 rounded-lg">
      <div class="w-full pt-5">
        <h1 class="font-semibold text-xl text-gray-800 mb-4">Sistem Booking Konstruksi</h1>
        <p class="font-normal text-sm text-gray-500 mb-4">Login Sebagai</p>
      </div>
      <form @submit.prevent="login" class="max-w-sm mx-auto">
        <div class="mb-5">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
          <input type="email" v-model="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
        </div>
        <div class="mb-5">
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
          <input type="password" v-model="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>

        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>