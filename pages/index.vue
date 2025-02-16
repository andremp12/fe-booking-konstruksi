<script lang="ts">
import { useModal } from 'vue-final-modal';
import AppBreadcrumb from '~/components/AppBreadcrumb.vue';
import AppModalConfirmation from '~/components/AppModalConfirmation.vue';
import type { ITipeKonstruksi } from '~/types/ITipeKonstruksi';
import { appMixin } from '~/utils/mixin';

export default defineComponent({
  components:{AppBreadcrumb},
  computed:{
    appMixin(){
      return appMixin
    }
  },
  setup(){
    definePageMeta({
      layout:"landing-page-layout",
    })

    const toast = useToast()

    return { toast }
  },
  data(){
    return{
      data : [] as ITipeKonstruksi[],
    }
  },
  async created(){
    await this.getData()
  },
  methods:{
    async getData(){
      const _self = this

      await $api('/tipe-konstruksi/landing',{
        onRequest(context:any):Promise<void>|void{
          context.options.method="GET"
          context.options.query={}
          context.options.headers={}
        }
      }).then((result:any)=>{
        this.data = result.data
        console.log(this.data)
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
  <div class="w-full">
    <div id="home" class="relative z-10 flex flex-col items-center justify-center p-8 md:pt-5 md:pb-28 w-full min-h-screen bg-cover bg-no-repeat bg-center bg-[linear-gradient(to_bottom,rgba(255,255,255,0.3),rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('/landing.jpeg')]">
      <h1 data-aos="fade-up" class="font-bold text-white text-7xl uppercase">Booking Konstruksi</h1>
      <div data-aos="fade-up" class="flex space-x-2 md:mt-4">
        <UButton color="primary" size="md" label="Get Started" />
        <UButton color="primary"  size="md" label="Contact Us" />
      </div>
    </div>

    <div id="about" class="w-full min-h-screen p-8 md:px-12 md:pt-28 -mt-5 bg-gray-100 rounded-3xl shadow-md relative z-30">
      <div class="w-full flex flex-col md:flex-row gap-4">
        <div data-aos="fade-right" class="block md:w-1/2">
          <h1 class="text-gray-800 font-semibold text-4xl mb-14">About</h1>
          <p class="text-balance break-words text-lg font-light text-gray-800 mb-10">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur exercitationem at quas eos dolore laborum 
            laudantium possimus officiis eum! Vitae ex et dolorem enim perferendis excepturi laboriosam temporibus, ullam aliquid.</p>
          <div class="w-full grid grid-cols-2 gap-4">
            <div class="bg-primary-500 text-white text-center space-y-4 font-semibold text-4xl rounded-lg p-8">
              <label for=""><span class="text-xl font-semibold">+</span> 100</label>
              <p class="text-sm font-light">Completed projects</p>
            </div>
            <div class="border-2 border-primary-500 text-primary-500 text-center space-y-4 font-semibold text-4xl rounded-lg p-8">
              <label for="">10</label>
              <p class="text-sm font-light">Cooperation</p>
            </div>
            <div class="border-2 border-primary-500 text-primary-500 text-center space-y-4 font-semibold text-4xl rounded-lg p-8">
              <label for="">12</label>
              <p class="text-sm font-light">Professional Mandors</p>
            </div>
            <div class="border-2 border-primary-500 text-primary-500 text-center space-y-4 font-semibold text-4xl rounded-lg p-8">
              <label for="">12</label>
              <p class="text-sm font-light">Mandors</p>
            </div>
          </div>
        </div>

        <div data-aos="fade-left" class="md:w-1/2 flex justify-center items-center h-auto relative">
            <div class="grid md:grid-cols-2 w-full gap-4 relative min-h-80">
              <div class="flex w-full justify-end">
                <div class="bg-gray-400 w-40 h-40">

                </div>
              </div>
              <div class="flex w-full items-end">
                <div class="bg-gray-400 w-40 h-40 ">

                </div>
              </div>
              <div class="absolute top-0 translate-x-[50%] -z-10 w-[350px] h-[350px] bg-gray-200" style="border-radius: 70% 60% 80% 40% / 90% 30% 60% 40%;"></div>
            </div>
        </div>
      </div>
    </div>

    <div id="services" class="w-full min-h-screen p-8 md:px-12 md:pt-28 -mt-5 bg-gray-200">
      <h1 data-aos="fade-down" class="text-black text-center font-semibold text-4xl mb-14">Project Konstruksi</h1>

      <div data-aos="fade-up" class="grid grid-cols-4 gap-4">
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
                </div>
              </div>
              <!-- <div class="absolute z-20 w-full h-full bg-gradient-to-t from-black/80 to-transparent"></div>
              <img src="http://localhost:3001/rumah-tipe-1.jpg" alt="" class="absolute z-10 bg-cover w-full h-full rounded-lg" /> -->
            </div>
            
          </div>
      </div>
    </div>
  </div>
</template>

<style>

</style>