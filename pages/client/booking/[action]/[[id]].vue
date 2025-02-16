<script lang="ts">
import type {ITipeKonstruksi} from "~/types/ITipeKonstruksi";
import type {IBooking} from "~/types/IBooking";
import {appMixin} from "~/utils/mixin";

export default defineComponent({
  computed:{
    appMixin(){
      return appMixin
    }
  },
  setup() {
    definePageMeta({
      layout: 'client-layout',
      pageMenu:"booking",
      middleware: ['client'],
    })

    const route = useRoute();
    const user = useAuthStore().userData
    const toast = useToast()

    return {
      route,user,toast
    }
  },
  data(){
    return {
      state:reactive({}) as IBooking,
      dataTipe: {} as ITipeKonstruksi,
      optionsTipe: [
        {
          label:'Harga Full',
          value:'Full'
        },
        {
          label:'Harga Jasa',
          value:'Jasa'
        },
      ],
      breadcrumbs: [
        {
          label: "Home",
          icon: 'i-material-symbols-dashboard-2-outline',
          to: '/client/home'
        },
        {
          label: 'Booking Konstruksi',
          icon: 'i-material-symbols-checkbook-outline-rounded',
          to: '/client/booking'
        },
        {
          label: 'Form Booking',
        },
      ],
    }
  },
  async created(){
    if(this.route.params.id && this.route.params.action == 'booking'){
      await this.getTipeKonstruksi(this.route.params.id);
    }
    this.setForm()
    console.log(this.user.user_id)
  },
  methods: {
    setForm(){
      this.state.tipe = '';
      this.state.total = 0;
      this.state.address = ''
      this.state.keterangan = ''
      this.state.start_date = null
      this.state.end_date = null
    },
    async getTipeKonstruksi(id:any){
      await $api(`/tipe-konstruksi/${id}`,{
        onRequest(context:any):Promise<void>|void{
          context.options.headers = context.options.headers || {}
          context.options.method = 'GET'
          context.options.params = {}
        }
      }).then(async (result:any)=>{
        this.dataTipe = result.data;
      }).catch(async (error:any)=>{
        console.log(error)
      });
    },
    async submit(){
      const _self = this;

      if(this.state.tipe == 'Full'){
        this.state.total = this.appMixin.accountingToNumber(this.dataTipe.harga_full);
      }

      if(this.state.tipe == 'Jasa'){
        this.state.total = this.appMixin.accountingToNumber(this.dataTipe.harga_jasa);
      }

      await $api(`konstruksi/${this.route.params.id}`,{
        onRequest(context:any):Promise<void>|void{
          context.options.headers = context.options.headers || {}
          context.options.method = 'POST'
          context.options.body = _self.state;
          context.options.query = {
            client_id: _self.user.user_id,
          }
        }
      }).then(async (result:any)=>{
        navigateTo("/client/konstruksi");

        _self.toast.add({
          icon: "i-heroicons-check-badge",
          color: "green",
          title: "Success",
          timeout: 3000,
          description: "Success booking.",
          "ui": constantData.successNotificationStyle()
        })
      }).catch(async (error:any)=>{
        console.log(error)
        _self.toast.add({
          icon: "i-heroicons-exclamation-triangle",
          color: "red",
          title: "Failed",
          timeout: 3000,
          description: "Failed booking.",
          "ui": constantData.errorNotificationStyle()
        })
      });
    }
  }
})
</script>

<template>
  <div class="w-full">
    <UForm class="space-y-4" :state="state" @submit="submit">
    <AppBreadcrumb :links="breadcrumbs">
      <template v-slot:right>

      </template>
    </AppBreadcrumb>

    <UCard>
      <div class="flex w-full justify-between items-center">
        <h1 class="font-semibold text-2xl text-gray-600">{{ dataTipe.name }}</h1>
        <UButton type="submit" color="blue" block class="px-2 w-32 text-center">Submit</UButton>
      </div>
      <UDivider class="h-8 mb-2" />
      <div class="w-full gap-8 flex">
        <div class="w-1/2 space-y-4">
          <UFormGroup label="Pilih Jenis" required help="Please Choose One">
            <div class="flex space-x-4">
              <URadio v-for="item of optionsTipe" :key="item.value" v-model="state.tipe" v-bind="item" />
            </div>
          </UFormGroup>
          <UFormGroup label="Address" required name="address">
            <UTextarea color="white" v-model="state.address" variant="outline" placeholder="Address" />
          </UFormGroup>
          <UFormGroup label="Additional Address" name="keterangan">
            <UInput  v-model="state.keterangan" placeholder="Ex : Persimpangan 4" />
          </UFormGroup>

          <div data-aos="zoom-in" v-if="state.tipe" class="w-full p-4 flex justify-between gap-x-4 bg-gray-200 rounded-lg">
            <h1 class="font-semibold text-lg text-gray-800">Total</h1>
            <h1 data-aos="zoom-in" v-if="state.tipe == 'Full'" class="font-semibold text-lg text-gray-800 font-mono">Rp.{{ appMixin.accountingToPrice(dataTipe.harga_full) }}</h1>
            <h1 data-aos="zoom-in" v-if="state.tipe == 'Jasa'" class="font-semibold text-lg text-gray-800 font-mono">Rp.{{ appMixin.accountingToPrice(dataTipe.harga_jasa) }}</h1>
          </div>
        </div>
        <div class="w-1/2 space-y-2">
          <div data-aos="fade-down" v-if="route.params.action == 'booking' && route.params.id" class="w-full">
            <img :src="dataTipe.image" class="object-cover object-center h-96 w-full rounded-lg" >
          </div>
        </div>
      </div>
    </UCard>

    </UForm>
  </div>
</template>

<style scoped>

</style>