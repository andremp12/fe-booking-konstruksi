<script lang="ts">
import AppBreadcrumb from '~/components/AppBreadcrumb.vue';
import type { IColumn } from '~/types/IColumn';
import type { ISatuan } from '~/types/ISatuan';
import { useModal} from 'vue-final-modal';
import AppModalConfirmation from '~/components/AppModalConfirmation.vue';
import type {IKonstruksi} from "~/types/IKonstruksi";
import ModalPayment from "./component/ModalPayment.vue";


export default defineComponent({
  components:{ModalPayment, AppBreadcrumb,ModalPayment},
  computed:{
    appMixin(){
      return appMixin
    }
  },
  setup(){
    definePageMeta({
      layout:"theme-layout",
      pageMenu:"konstruksi",
      page:"Konstruksi",
      middleware: ['admin']
    })

    // const uFormSatuan = ref<InstanceType <typeof FormSatuan>|null>(null)
    const uModalPayment = ref<InstanceType <typeof ModalPayment>|null>(null)
    const toast = useToast()

    return {
      toast, uModalPayment,
    }
  },
  data(){
    return{
      breadcrumbs: [
        {
          label: "Dashboard",
          icon: 'i-material-symbols-dashboard-2-outline',
          to: '/admin/dashboard'
        },
        {
          label: 'Konstruksi',
        },
      ],
      mode: 'browser' as 'browser'|'add'|'edit'|'show',
      data: [] as IKonstruksi[],
      columns:[] as IColumn[]
    }
  },
  async created() {
    await this.getData()
    this.mapColumn()
  },
  methods:{
    mapColumn(){
      this.columns=[
        {
          key:'id',
          label:'NO'
        },
        {
          key:'no_booking',
          label:'NO BOOKING'
        },
        {
          key:'tipe_konstruksi',
          label:'TIPE KONSTRUKSI'
        },
        {
          key:'client',
          label:'CLIENT'
        },
        {
          key:'mandor',
          label:'MANDOR'
        },
        {
          key:'status',
          label:'STATUS'
        },
        {
          key:'total',
          label:'TOTAL'
        },
        {
          key:'start_date',
          label:'START DATE'
        },
        {
          key:'end_date',
          label:'END DATE'
        },
        {
          key:'actions',
        },
      ]
    },
    async getData(){
      await $api('/konstruksi',{
        onRequest(context:any):Promise<void>|void{
          context.options.method="GET"
          context.options.headers=context.options.headers || {
            "Content-Type":'application/json',
            "Accept":'application/json'
          }
        }
      }).then((result:any)=>{
        this.data = result.data
        console.log(this.data)
      }).catch((err:any)=>{
        console.log(err)
      })
    },
    payment(data:IKonstruksi) {
      this.uModalPayment?.modalPayment(data,`Payment ${data.no_booking}`)
    },
    deleteData(data: ISatuan){
      const _self = this
      const {open,close} = useModal({
        component:AppModalConfirmation,
        attrs:{
          async onConfirm(){
            await $api(`/konstruksi`,{
              onRequest(context:any):Promise<void>|void{
                context.options.method = "DELETE"
              }
            }).then((respon:any)=>{
              _self.toast.add({
                icon: "i-heroicons-check-badge",
                color: "green",
                title: "Sukses!",
                timeout: 3000,
                description: respon.message,
                "ui": constantData.successNotificationStyle()
              })
            }).catch((err:any)=>{
              _self.toast.add({
                icon: "i-heroicons-exclamation-triangle",
                color: "red",
                title: "Gagal!",
                timeout: 3000,
                description: "Failed to delete data.",
                "ui": constantData.errorNotificationStyle()
              })
            })
            await _self.getData()
            await close()
          }
        },
        slots:{
          default: `Yakin ingin menghapus <strong>"${data.name}"</strong>`
        }
      })
      open()
    },
    // addData(){
    //   this.mode = "add"
    //   this.uFormSatuan?.addData('Add New Data')
    // },
    // editData(data:ISatuan){
    //   this.mode= "edit"
    //   this.uFormSatuan?.editData('Edit Data',data)
    // },
    afterSubmit(){
      this.mode = 'browser'
      this.getData()
    },
    onCancel(){
      this.mode = 'browser'
    }
  }
})
</script>

<template>
  <div class="w-full gap-4">
    <AppBreadcrumb :links="breadcrumbs">
<!--      <template v-slot:right>-->
<!--        <NuxtLink>-->
<!--          <UButton color="blue" class="px-2" @click="" >+Add Data</UButton>-->
<!--        </NuxtLink>-->
<!--      </template>-->
    </AppBreadcrumb>

    <UCard class="mt-4" :ui="{background:'bg-gray-50'}">
      <div class="w-full flex-1">
        <UTable
            :columns="columns" :rows="data">
          <template #id-data="{row}">
            {{ data.findIndex((item) => item.id===row.id)+1 }}
          </template>
          <template #no_booking-data="{row}">
            <div class="font-bold text-gray-800 font-mono">{{ row.no_booking }}</div>
          </template>
          <template #tipe_konstruksi-data="{row}">
            <div class="font-medium text-gray-800">{{ row.tipe_konstruksi.name }}</div>
            <UBadge size="xs" color="green" v-if="row.tipe == 'Full'">Full</UBadge>
            <UBadge size="xs" color="blue" v-if="row.tipe == 'Jasa'">Jasa</UBadge>
          </template>
          <template #client-data="{row}">
            <div class="font-medium text-gray-600 ">{{ row.client.name }}</div>
            <div class="font-normal text-xs text-gray-600 ">{{ row.client.email }}</div>
          </template>
          <template #mandor-data="{row}">
            <div v-if="row.mandor_id">
              <div class="font-medium text-gray-600 ">{{ row.mandor.name }}</div>
              <div class="font-normal text-xs text-gray-600 ">{{ row.mandor.email }}</div>
            </div>
            <div v-else class="font-medium text-gray-600">-</div>
          </template>
          <template #status-data="{row}">
            <div id="status">
              <UBadge class="uppercase" color="indigo" variant="outline" v-if="row.status == 'Booking'">Booking</UBadge>
              <UBadge class="uppercase" color="green" variant="outline" v-if="row.status == 'Payment'">Payment</UBadge>
              <UBadge class="uppercase" color="orange" variant="outline" v-if="row.status == 'Proses'">Proses</UBadge>
              <UBadge class="uppercase" color="blue" variant="outline" v-if="row.status == 'Finished'">Finished</UBadge>
              <UBadge class="uppercase" color="gray" variant="outline" v-if="row.status == 'Closed'">Closed</UBadge>
              <UBadge class="uppercase" color="red" variant="outline" v-if="row.status == 'Canceled'">Canceled</UBadge>
            </div>
          </template>
          <template #total-data="{row}">
            <div class="font-medium text-gray-800 font-mono">Rp.{{ appMixin.accountingToPrice(row.total) }}</div>
          </template>
          <template #start_date-data="{row}">
            <div class="font-normal text-gray-600 ">{{ row.start_date ?  appMixin.convertDateFormat(row.start_date,"DD MMMM YYYY") : "-" }}</div>
          </template>
          <template #end_date-data="{row}">
            <div class="font-normal text-gray-600 ">{{ row.end_date ? appMixin.convertDateFormat(row.end_date,"DD MMMM YYYY") : "-" }}</div>
          </template>
          <template #actions-data="{ row }">
            <div class="flex item-right justify-end gap-x-2">
              <UTooltip v-if="row.status != 'Booking'" text="Payment" class="pe-4">
                <UButton class="font-light" color="green" variant="soft" icon="i-heroicons-banknotes" size="xs"
                         square :trailing="false" @click="payment(row)" />
              </UTooltip>
              <UTooltip text="Detail">
                <NuxtLink :to="(`/admin/konstruksi/detail/${row.id}`)">
                <UButton class="font-light" color="blue" variant="soft" icon="i-heroicons-eye" size="xs"
                         square :trailing="false" @click="" />
                </NuxtLink>
              </UTooltip>
              <UTooltip v-if="row.status != 'Canceled' && row.status != 'Closed'" text="Edit">
                <NuxtLink :to="(`/admin/konstruksi/edit/${row.id}`)">
                <UButton class="font-light" color="yellow" variant="soft" icon="i-heroicons-pencil-square" size="xs"
                         square :trailing="false" @click="" />
                </NuxtLink>
              </UTooltip>
              <UTooltip v-if="row.status == 'Booking'" text="Cancel">
                <UButton class="font-light" color="red" variant="soft" icon="i-heroicons-x-circle" size="xs" square
                         :trailing="false" @click="deleteData(row)" />
              </UTooltip>
            </div>
          </template>
        </UTable>
      </div>
    </UCard>
  </div>

  <ModalPayment ref="uModalPayment" />
<!--  <FormSatuan ref="uFormSatuan" :mode="mode" @close="onCancel" @submit="afterSubmit" />-->
</template>

<style>

</style>