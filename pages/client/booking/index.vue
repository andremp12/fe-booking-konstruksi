<script lang="ts">
import type {IBooking} from "~/types/IBooking";
import {appMixin} from "~/utils/mixin";
import type {ITipeKonstruksi} from "~/types/ITipeKonstruksi";

export default defineComponent({
  computed:{
    appMixin(){
      return appMixin
    }
  },
  setup() {
    definePageMeta({
      layout:'client-layout',
      pageMenu:"booking",
      middleware: ['client'],
    })

    const toast =useToast()

    return {
      toast,
    }
  },
  data(){
    return {
      data:[] as ITipeKonstruksi[],
      isLoading:false,
      breadcrumbs: [
        {
          label: "Home",
          icon: 'i-material-symbols-dashboard-2-outline',
          to: '/client'
        },
        {
          label: 'Booking Konstruksi',
        },
      ],
    }
  },
  async created() {
    await this.getData()
  },
  methods:{
    async getData(){
      const _self = this

      await $api('/tipe-konstruksi',{
        onRequest(context:any):Promise<void>|void{
          context.options.method="GET"
          context.options.query={}
          context.options.headers=context.options.headers || {}
        }
      }).then((result:any)=>{
        this.data = result.data
        // console.log(this.data)
      }).catch((err:any)=>{
        _self.toast.add({
          icon: "i-heroicons-exclamation-triangle",
          color: "red",
          title: "Gagal!",
          timeout: 3000,
          description: err.message,
          "ui": constantData.successNotificationStyle()
        })
      })
    },
  }
})
</script>

<template>
  <div class="w-full space-y-4">
    <AppBreadcrumb :links="breadcrumbs">
      <template v-slot:right>
        <NuxtLink to="/client/booking/request">
          <UButton @click="" color="blue" class="px-2">+Request Konstruksi</UButton>
        </NuxtLink>
      </template>
    </AppBreadcrumb>

    <div class="grid grid-cols-4 gap-4 pt-5">
      <div v-for="tipe_konstruksi in data" :key="tipe_konstruksi.id" class="flex flex-col bg-transparent rounded-3xl shadow-xl h-full w-full min-h-[500px]">
        <div class="relative w-full h-full rounded-3xl bg-cover bg-center"
             :style="{backgroundImage:`url(${tipe_konstruksi.image ? tipe_konstruksi.image : '/default.jpg' })`}"> <!-- membuat background image menjadi dinamis -->
          <div class="relative w-full h-full rounded-3xl bg-gradient-to-t from-black/50 from-20% to-80% to-black/20 px-4 py-6">
            <div class="w-full h-full flex flex-col justify-end">
              <div class="text-white">
                <h1 class="text-3xl font-medium mb-4">{{ tipe_konstruksi.name }}</h1>
                <div class="w-full flex font-light mb-2">
                  <p class="w-1/3 ">Harga Full</p> <p class="w-2/3 fontm">: Rp. {{ appMixin.accountingToPrice(tipe_konstruksi.harga_full) }}</p>
                </div>
                <div class="w-full flex font-light mb-4">
                  <p class="w-1/3">Harga Jasa</p> <p class="w-2/3">: Rp. {{ appMixin.accountingToPrice(tipe_konstruksi.harga_jasa) }}</p>
                </div>
              </div>

              <NuxtLink :to="(`/client/booking/booking/${tipe_konstruksi.id}`)">
                <UButton @click="" :ui="{ rounded: 'rounded-full' }" size="lg" color="blue" block class="px-2">Booking</UButton>
              </NuxtLink>
            </div>
          </div>
          <!-- <div class="absolute z-20 w-full h-full bg-gradient-to-t from-black/80 to-transparent"></div>
          <img src="http://localhost:3001/rumah-tipe-1.jpg" alt="" class="absolute z-10 bg-cover w-full h-full rounded-lg" /> -->
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>

</style>