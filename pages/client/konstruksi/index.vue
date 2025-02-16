<script lang="ts">

import type {IKonstruksi} from "~/types/IKonstruksi";
import type {IColumn} from "~/types/IColumn";
import {appMixin} from "~/utils/mixin";
import ModalPayment from "./component/ModalPayment.vue"

export default defineComponent({
  components: {ModalPayment},
  computed:{
    appMixin(){
      return appMixin
    }
  },
  setup() {
    definePageMeta({
      layout:"client-layout",
      pageMenu:"konstruksi",
      middleware: ['client']
    })

    const user = useAuthStore().userData
    const toast = useToast()
    const uModalPayment = ref<InstanceType <typeof ModalPayment>|null>(null)

    return {
      user,toast,uModalPayment
    }
  },
  data(){
    return {
      data: [] as IKonstruksi[],
      breadcrumbs:[
        {
          label: "Home",
          icon: 'i-material-symbols-dashboard-2-outline',
          to: '/client'
        },
        {
          label: 'Konstruksi',
        },
      ],
    }
  },
  async created() {
    await this.getData()
  },
  methods: {
    async getData(){
      const _self = this

      await $api('/client/konstruksi',{
        onRequest(context:any):Promise<void>|void{
          context.options.method="GET"
          context.options.headers=context.options.headers || {}
          context.options.query={
            client_id : _self.user?.user_id
          }
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
    payment(data:IKonstruksi) {
      this.uModalPayment?.modalPayment(data,`Payment ${data.no_booking}`)
    },
    afterPayment(){
      this.getData()
    },
  }
})

</script>

<template>
  <div class="w-full space-y-4">
    <AppBreadcrumb :links="breadcrumbs">
    </AppBreadcrumb>

    <div class="w-full flex flex-wrap gap-3">
      <UCard v-for="konstruksi of data" :key="konstruksi.id" class="w-full">
        <div class="w-full flex justify-between items-center">
          <h1 class="text-2xl font-semibold text-blue-500 font-mono w-1/2">{{konstruksi.no_booking}}</h1>
          <div class="text-xs flex items-center space-x-1 p-2 rounded-lg bg-gray-200 text-gray-600">
            <UIcon name="i-heroicons-information-circle-16-solid" />
            <label>Noted : Proses konfirmasi 1-2 hari setelah booking</label>
          </div>
        </div>

        <UDivider class="h-4 mb-2"/>
        <div class="w-full flex gap-4">
          <div class="w-1/2 space-x-2 flex text-sm">
            <div class="max-w-xs w-full space-y-2 font-medium text-gray-500">
              <label class="block">Construction Type</label>
              <label class="block">Client</label>
              <label class="block">Mandor</label>
              <label class="block">Service</label>
              <label class="block">Status</label>
              <label class="block">Booking Date</label>
              <label class="block">Start Date</label>
              <label class="block">End Date</label>
            </div>
            <div class="w-full space-y-2 font-semibold text-gray-800">
              <label class="block">{{konstruksi?.tipe_konstruksi?.name ? konstruksi?.tipe_konstruksi?.name : '-' }}</label>
              <label class="block">{{ konstruksi?.client.name }}</label>
              <label class="block">{{ konstruksi?.mandor?.name ? konstruksi?.mandor?.name : '-'}}</label>
              <div id="service">
                <UBadge size="xs" color="green" v-if="konstruksi.tipe == 'Full'">Full</UBadge>
                <UBadge size="xs" color="blue" v-if="konstruksi.tipe == 'Jasa'">Jasa</UBadge>
              </div>
              <div id="status">
                <UBadge class="uppercase" color="indigo" variant="outline" v-if="konstruksi.status == 'Booking'">Booking</UBadge>
                <UBadge class="uppercase" color="green" variant="outline" v-if="konstruksi.status == 'Payment'">Payment</UBadge>
                <UBadge class="uppercase" color="orange" variant="outline" v-if="konstruksi.status == 'Proses'">Proses</UBadge>
                <UBadge class="uppercase" color="blue" variant="outline" v-if="konstruksi.status == 'Finished'">Finished</UBadge>
                <UBadge class="uppercase" color="gray" variant="outline" v-if="konstruksi.status == 'Closed'">Closed</UBadge>
                <UBadge class="uppercase" color="red" variant="outline" v-if="konstruksi.status == 'Canceled'">Canceled</UBadge>
              </div>
              <label class="block">{{ appMixin.convertDateFormat(konstruksi.created_at,'DD MMMM YYYY HH:ss') }}</label>
              <label class="block">{{ konstruksi.start_date ? appMixin.convertDateFormat(konstruksi.start_date,'DD MMMM YYYY') : '-' }}</label>
              <label class="block">{{ konstruksi.end_date ? appMixin.convertDateFormat(konstruksi.end_date,'DD MMMM YYYY') : '-' }}</label>
            </div>
          </div>
          <div class="w-1/2 flex gap-4">
            <div class="w-2/3 p-4 border-2 border-gray-200 rounded-lg h-fit">
              <div class="w-full space-y-2 font-semibold text-gray-500 text-sm">
                <div class="w-full flex space-x-2 justify-between items-center">
                  <label class="block">Total</label>
                  <label class="block font-normal text-gray-800 font-mono">Rp.{{appMixin.accountingToPrice(konstruksi.total)}}</label>
                </div>
                <div class="w-full flex space-x-2 justify-between items-center">
                  <label class="block">Paid</label>
                  <label class="block font-normal text-gray-800 font-mono">{{ konstruksi.paid ? 'RP.'+appMixin.accountingToPrice(konstruksi.paid) : '-' }}</label>
                </div>
                <UDivider class="h-4"/>
                <div class="w-full flex space-x-2 justify-between items-center">
                  <label class="block text-gray-800">Remaining Payment</label>
                  <label v-if="konstruksi.status != 'Booking' && konstruksi.status != 'Canceled'" class="block text-gray-800 font-mono">{{ konstruksi.remaining_payment ? 'RP.'+appMixin.accountingToPrice(konstruksi.remaining_payment) : '-' }}</label>
                  <label v-else class="block text-gray-800 text-end">-</label>
                </div>

              </div>
            </div>
            <div class="w-1/3">
              <UButton class="mb-4" v-if="konstruksi.status != 'Booking' && konstruksi.status != 'Canceled' && konstruksi.status != 'Closed'" @click="payment(konstruksi)" block color="green" label="Payment" />
              <NuxtLink :to="(`/client/konstruksi/detail/${konstruksi.id}`)">
                <UButton class="mb-1" block color="primary" label="Construction Detail" />
              </NuxtLink>
              <UButton class="mb-1" block variant="outline" color="primary" label="Payment Invoice" />
              <UButton class="mb-1" v-if="konstruksi.status == 'Booking'" block variant="outline" color="red" label="Cancel Booking" />
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>

  <ModalPayment ref="uModalPayment" @payment="afterPayment" />
</template>

<style scoped>

</style>