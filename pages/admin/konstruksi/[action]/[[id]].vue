<script lang="ts">
import AppBreadcrumb from "~/components/AppBreadcrumb.vue";
import type {IKonstruksi} from "~/types/IKonstruksi";
import ModalConfirmation from "../component/ModalConfirmation.vue";
import ModalUpdateStatus from "../component/ModalUpdateStatus.vue";
import FormSatuan from "~/pages/admin/satuan/component/FormSatuan.vue";
import type {ILaporanKonstruksi} from "~/types/ILaporan";
import type {ITimeline} from "~/types/ITimeline";

export default defineComponent({
  components: {ModalUpdateStatus, FormSatuan, AppBreadcrumb,ModalConfirmation,},
  computed: {
    appMixin() {
      return appMixin
    }
  },
  setup() {
    definePageMeta({
      layout: "theme-layout",
      pageMenu: "konstruksi",
      page: "Konstruksi",
      middleware: ['admin']
    })

    const uModalConfirm = ref<InstanceType <typeof ModalConfirmation>|null>(null)
    const uModalUpdateStatus = ref<InstanceType <typeof ModalUpdateStatus>|null>(null)
    const toast = useToast()
    const route = useRoute()

    return {
      toast, route, uModalConfirm,uModalUpdateStatus
    }
  },
  data() {
    return {
      breadcrumbs: [
        {
          label: "Dashboard",
          icon: 'i-material-symbols-dashboard-2-outline',
          to: '/admin/dashboard'
        },
        {
          label: 'Konstruksi',
          icon: 'i-tdesign-building-5',
          to: '/admin/konstruksi'
        },
        {
          label: 'Detail Konstruksi',
        },
      ],
      mode: 'browser' as 'browser' | 'add' | 'edit' | 'show',
      data: {} as IKonstruksi,
      dataLaporan: [] as ILaporanKonstruksi[],
      dataTimeline: [] as ITimeline[]
    }
  },
  async created() {
    await  this.getData()
    await  this.getDataLaporan()
    await  this.getDataTimeline()
  },
  methods: {
    async getData(){
      const _self = this

      await $api(`/konstruksi/${this.route.params.id}`,{
        onRequest(context:any):Promise<void>|void{
          context.options.method="GET"
          context.options.headers=context.options.headers || {}
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
    async getDataLaporan(){
      const _self = this

      await $api(`/laporan-konstruksi/${this.route.params.id}`,{
        onRequest(context:any):Promise<void>|void{
          context.options.method="GET"
          context.options.headers=context.options.headers || {}
        }
      }).then((result:any)=>{
        this.dataLaporan = result.data
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
    async getDataTimeline(){
      const _self = this

      await $api(`/timeline-konstruksi/${this.route.params.id}`,{
        onRequest(context:any):Promise<void>|void{
          context.options.method="GET"
          context.options.headers=context.options.headers || {}
        }
      }).then((result:any)=>{
        this.dataTimeline = result.data
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
    confirmation(id:any){
      this.uModalConfirm?.confirmation(id,'Confirmation')
    },
    update(id:any){
      this.uModalUpdateStatus?.update(id,'Update Status')
    },
    afterSubmit(){
      this.getData()
    }
  }
})
</script>

<template>
  <div class="w-full space-y-4">
    <AppBreadcrumb :links="breadcrumbs">
      <template v-slot:right>
<!--        <NuxtLink>-->
<!--          <UButton color="blue" class="px-2" @click="" >+Add Data</UButton>-->
<!--        </NuxtLink>-->
      </template>
    </AppBreadcrumb>

    <div class="w-full flex gap-4">
      <UCard class="w-2/3" >
        <div class="w-full flex justify-between items-center">
          <h1 class="text-2xl font-semibold text-blue-500 font-mono w-1/2">{{data.no_booking}}</h1>
          <div class="flex items-center justify-end space-x-2">
            <UButton @click="confirmation(route.params.id)" v-if="data.status == 'Booking' && route.params.action != 'detail'" color="green" label="Confirmation" />
            <UButton @click="update(route.params.id)" v-if="data.status != 'Booking' && data.status != 'Closed' && data.status != 'Canceled' && route.params.action != 'detail'" color="orange" label="Update Status" />
            <UButton v-if="data.status == 'Booking' && route.params.action != 'detail'" color="red" variant="outline" label="Cancel" />
          </div>
        </div>

        <UDivider class="h-4 mb-2"/>
        <div class="w-full flex gap-4">
          <div class="w-2/3 space-x-2 flex text-sm">
            <div class="max-w-xs w-full space-y-2 font-medium text-gray-500">
              <label class="block">Construction Type</label>
              <label class="block">Client</label>
              <label class="block">Mandor</label>
              <label class="block">Service</label>
              <label class="block">Status</label>
              <label class="block">Booking Date</label>
              <label class="block">Start Date</label>
              <label class="block">End Date</label>
              <label class="block">Image</label>
              <label class="block">Address</label>
              <label class="block">Additional Address</label>
            </div>
            <div class="w-full space-y-2 font-semibold text-gray-800">
              <label class="block">{{data.tipe_konstruksi?.name ? data?.tipe_konstruksi?.name : '-' }}</label>
              <label class="block">{{ data.client?.name }}</label>
              <label class="block">{{ data.mandor?.name ? data?.mandor?.name : '-'}}</label>
              <div id="service">
                <UBadge size="xs" color="green" v-if="data.tipe == 'Full'">Full</UBadge>
                <UBadge size="xs" color="blue" v-if="data.tipe == 'Jasa'">Jasa</UBadge>
              </div>
              <div id="status">
                <UBadge class="uppercase" color="indigo" variant="outline" v-if="data.status == 'Booking'">Booking</UBadge>
                <UBadge class="uppercase" color="green" variant="outline" v-if="data.status == 'Payment'">Payment</UBadge>
                <UBadge class="uppercase" color="orange" variant="outline" v-if="data.status == 'Proses'">Proses</UBadge>
                <UBadge class="uppercase" color="blue" variant="outline" v-if="data.status == 'Finished'">Finished</UBadge>
                <UBadge class="uppercase" color="gray" variant="outline" v-if="data.status == 'Closed'">Closed</UBadge>
                <UBadge class="uppercase" color="red" variant="outline" v-if="data.status == 'Canceled'">Canceled</UBadge>
              </div>
              <label class="block">{{ appMixin.convertDateFormat(data.created_at,'DD MMMM YYYY HH:ss') }}</label>
              <label class="block">{{ data.start_date ? appMixin.convertDateFormat(data.start_date,'DD MMMM YYYY') : '-' }}</label>
              <label class="block">{{ data.end_date ? appMixin.convertDateFormat(data.end_date,'DD MMMM YYYY') : '-' }}</label>
              <NuxtLink :to="data.tipe_konstruksi?.image" target="_blank" class="block text-blue-500 font-medium hover:underline">View</NuxtLink>
              <label class="block font-normal text-pretty">{{ data.address }}</label>
              <label class="block font-normal text-pretty">{{ data.keterangan ? data.keterangan : '-' }}</label>
            </div>
          </div>
          <div class="w-1/3 flex gap-4">
            <div class="w-full p-4 border-2 border-gray-200 rounded-lg h-fit">
              <div class="w-full space-y-2 font-semibold text-gray-500 text-sm">
                <div class="w-full flex space-x-2 justify-between items-center">
                  <label class="block">Total</label>
                  <label class="block font-normal text-gray-800 font-mono">Rp.{{appMixin.accountingToPrice(data.total)}}</label>
                </div>
                <div class="w-full flex space-x-2 justify-between items-center">
                  <label class="block">Paid</label>
                  <label class="block font-normal text-gray-800 font-mono">{{ data.paid ? 'RP.'+appMixin.accountingToPrice(data.paid) : '-' }}</label>
                </div>
                <UDivider class="h-4"/>
                <div class="w-full flex space-x-2 justify-between items-start">
                  <label class="block text-gray-800 w-1/3">Remaining Payment</label>
                  <label v-if="data.status != 'Booking' && data.status != 'Canceled'" class="block text-gray-800 font-mono w-2/3 text-end">{{ data.remaining_payment ? 'RP.'+appMixin.accountingToPrice(data.remaining_payment) : '-' }}</label>
                  <label v-else class="block text-gray-800 text-end">-</label>
                </div>
                  <UButton block color="primary" variant="outline" label="Payment History" />

              </div>
            </div>
<!--            <div class="w-1/3 space-y-2">-->
<!--              <UButton block color="primary" label="Construction Detail" />-->
<!--              <UButton block variant="outline" color="primary" label="Payment Invoice" />-->
<!--              <UButton block variant="outline" color="red" label="Cancel Booking" />-->
<!--            </div>-->
          </div>
        </div>
      </UCard>
      <UCard class="w-1/3">
        <div class="w-full flex items-center">
          <h1 class="text-lg font-semibold text-gray-800">Construction Report</h1>
        </div>

        <UDivider class="h-4 mb-2"/>
        <div class="overflow-y-scroll h-[250px] mb-4 px-2 space-y-2">
          <div class="space-y-2">
            <div v-for="laporan in dataLaporan" class="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-gray-200">
              <div class="space-y-1">
                <label class="font-medium text-sm text-gray-800">{{ laporan.title }}</label>
                <p class="font-light text-xs text-gray-800">{{appMixin.convertDateFormat(laporan.created_at,"DD MMM YYYY HH:mm")}}</p>
              </div>
              <div class="block">
                <UTooltip text="Detail" class="pe-4">
                  <UButton class="font-light" color="blue" variant="solid" icon="i-heroicons-document-text" size="xs"
                           square :trailing="false" @click="" />
                </UTooltip>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>
    <UCard>
      <div class="w-full flex items-center justify-between">
        <h1 class="text-lg font-semibold text-gray-800">Timeline Construction</h1>
      </div>

      <UDivider class="h-4 mb-2"/>

      <div class="w-full flex gap-4">
        <div v-for="timeline in dataTimeline" class="w-1/5 p-4 bg-gray-100 rounded-lg">
          <h1 class="text-gray-800 mb-1 font-semibold">{{appMixin.convertDateFormat(timeline.date,"DD MMM YYYY")}}</h1>
          <label class="text-gray-500 mb-3 font-medium text-sm block">{{timeline.name}}</label>
          <label class="text-gray-800 mb-1 font-medium text-sm">Description</label>
          <p class="text-gray-500 font-light text-sm break-words">{{timeline.description}}</p>
        </div>
      </div>
    </UCard>
  </div>

  <ModalConfirmation ref="uModalConfirm" @submit="afterSubmit" />
  <ModalUpdateStatus ref="uModalUpdateStatus" @submit="afterSubmit" />
</template>

<style scoped>

</style>