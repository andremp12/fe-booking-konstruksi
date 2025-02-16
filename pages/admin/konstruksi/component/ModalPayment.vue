<script lang="ts">

import type {IKonstruksi, IKonstruksiConfirmation} from "~/types/IKonstruksi";
import AppDatePicker from "~/components/AppDatePicker.vue";
import type {IMandor} from "~/types/IMandor";
import {sub} from "date-fns";
import type {IColumn} from "~/types/IColumn";
import type {IPayment} from "~/types/IPayment";
import type {ISatuan} from "~/types/ISatuan";
import {useModal} from "vue-final-modal";
import AppModalConfirmation from "~/components/AppModalConfirmation.vue";



export default defineComponent({
  emits:['submit'],
  components: {AppDatePicker},
  computed: {
    appMixin() {
      return appMixin
    }
  },
  setup(){
    const toast = useToast()
    const route = useRoute()

    return {
      toast,route
    }
  },
  data(){
    return{
      state: reactive({}) as IKonstruksiConfirmation,
      dataKonstruksi: {} as IKonstruksi,
      dataPembayaran: [] as IPayment[],
      state : reactive({}) as IPayment,
      columnPembayaran: [] as IColumn[],
      isOpen: false,
      title: '',
      // start_date:new Date(),
      // end_date: sub(new Date(),{days:1}),
    }
  },
  async created(){
    this.mapColumn()
  },
  methods: {
    mapColumn(){
      this.columnPembayaran = [
        {
          "key": "kode",
          "label": "PAYMENT NUMBER"
        },
        {
          "key": "name",
          "label": "STAGE NAME"
        },
        // {
        //   "key": "metode",
        //   "label": "METODE"
        // },
        {
          "key": "status",
          "label": "STATUS"
        },
        {
          "key": "total",
          "label": "TOTAL"
        },
        {
          "key": "due_date",
          "label": "DUE DATE"
        },
        {
          "key": "payment_date",
          "label": "PAYMENT DATE"
        },
        {
          "key": "actions"
        }
      ]
    },
    async getPembayaranClient(){
      await $api(`/pembayaran/${this.dataKonstruksi.id}`,{
        onRequest(context:any):Promise<void>|void{
          context.options.method="GET"
          context.options.headers=context.options.headers || {
            "Content-Type":'application/json',
            "Accept":'application/json'
          }
        }
      }).then((result:any)=>{
        this.dataPembayaran = result.data.records
        console.log(this.dataPembayaran)
      }).catch((err:any)=>{
        console.log(err)
      })
    },
    resetForm(){
      this.state.id=null
      this.state.name = ''
      this.state.total = 0
      this.state.due_date = new Date()
    },
    modalPayment(data:IKonstruksi,title:string){
      this.title = title
      this.isOpen = true

      this.dataKonstruksi.id = data.id
      this.dataKonstruksi.tipe_konstruksi_id = data.tipe_konstruksi_id
      this.dataKonstruksi.client_id = data.client_id
      this.dataKonstruksi.total = data.total
      this.dataKonstruksi.paid =data.paid

      this.state.name = ''
      this.state.total = 0
      this.state.due_date = new Date()

      this.getPembayaranClient()
    },
    editData(data:IPayment){
      this.state.id = data.id
      this.state.kode = data.kode
      this.state.name = data.name
      this.state.total = this.appMixin.accountingToPrice(data.total)
      this.state.due_date = data.due_date
    },
    async onSubmit(){
      const _self = this
      const sUrl = this.state.id ? `/pembayaran/${this.state.id}` : `/pembayaran/${this.dataKonstruksi.id}`

      this.state.due_date = this.appMixin.convertDateFormat(this.state.due_date,"YYYY-MM-DD")
      this.state.total = this.appMixin.accountingToNumber(this.state.total)

      console.log(this.state)
      await $api(sUrl,{
        onRequest(context:any):Promise<void>|void{
          context.options.method = _self.state.id ? 'PUT' : 'POST'
          context.options.body = _self.state
          context.options.headers=context.options.headers || {}
          context.options.query = {
            client_id: _self.dataKonstruksi.client_id,
          }
        }
      }).then((result:any)=>{
        _self.toast.add({
          icon: "i-heroicons-check-badge",
          color: "green",
          title: "Success",
          timeout: 3000,
          description: "Success save data.",
          "ui": constantData.successNotificationStyle()
        })

        this.resetForm()
        this.getPembayaranClient()
      }).catch((err:any)=>{
        console.log(err)
        _self.toast.add({
          icon: "i-heroicons-exclamation-triangle",
          color: "red",
          title: "Failed",
          timeout: 3000,
          description: "Failed save data.",
          "ui": constantData.errorNotificationStyle()
        })
      })
    },
    deleteData(data: IPayment){
      const _self = this
      const {open,close} = useModal({
        component:AppModalConfirmation,
        attrs:{
          async onConfirm(){
            await $api(`/pembayaran/${data.id}`,{
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
            await _self.getPembayaranClient()
            await close()
          }
        },
        slots:{
          default: `Yakin ingin menghapus <strong>"${data.name}"</strong>`
        }
      })
      open()
    },
    validateTotalInput(){
      if ( this.state.total < 0){
        this.toast.add({
          icon: "i-heroicons-exclamation-triangle",
          color: "red",
          title: "Upss!",
          timeout: 3000,
          description: "The amount cannot be negative.",
          "ui": constantData.errorNotificationStyle()
        })

        this.state.total = 0
      }

      if ( this.state.total > this.dataKonstruksi.total ){
        this.toast.add({
          icon: "i-heroicons-exclamation-triangle",
          color: "red",
          title: "Upss!",
          timeout: 3000,
          description: "The amount cannot be more than Total Construction.",
          "ui": constantData.errorNotificationStyle()
        })

        this.state.total = 0
      }

      this.state.total = this.appMixin.accountingToPrice(this.state.total)
    },
  }
})
</script>

<template>
  <div>
    <UModal v-model="isOpen" prevent-close :ui="{width:'sm:max-w-[1500px]'}">
      <UForm :state="state" class="space-y-4" @submit="onSubmit" @error="">
        <UCard class="min-h-[500px]" :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800'}">

          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                {{ title }}
              </h3>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
            </div>
          </template>

          <div class="w-full flex space-x-4">
            <div class="w-3/4 px-2 border-e-2 border-gray-200 min-h-[400px] ">
              <UTable
                  :columns="columnPembayaran" :rows="dataPembayaran">
                <template #kode-data="{row}">
                  <div class="font-bold text-gray-800 font-mono">{{ row.kode }}</div>
                </template>
                <template #name-data="{row}">
                  <div class="font-medium text-gray-800" >{{ row.name }}</div>
                </template>
<!--                <template #metode-data="{row}">-->
<!--                  <div class="font-normal text-gray-800" >{{ row.metode ? row.metode : '-' }}</div>-->
<!--                </template>-->
                <template #status-data="{row}">
                  <div id="status">
                    <UBadge class="uppercase" color="indigo" variant="outline" v-if="row.status == 'Paid'">Paid</UBadge>
                    <UBadge class="uppercase" color="orange" variant="outline" v-if="row.status == 'Unpaid'">Unpaid</UBadge>
                    <UBadge class="uppercase" color="purple" variant="outline" v-if="row.status == 'Pending'">Pending</UBadge>
                    <UBadge class="uppercase" color="red" variant="outline" v-if="row.status == 'Canceled'">Canceled</UBadge>
                  </div>
                </template>
                <template #total-data="{row}">
                  <div class="font-medium text-gray-800 font-mono">Rp.{{ appMixin.accountingToPrice(row.total) }}</div>
                </template>
                <template #due_date-data="{row}">
                  <div class="font-normal text-gray-600 ">{{ row.due_date ?  appMixin.convertDateFormat(row.due_date,"DD MMMM YYYY") : "-" }}</div>
                </template>
                <template #payment_date-data="{row}">
                  <div class="font-normal text-gray-600 ">{{ row.payment_date ?  appMixin.convertDateFormat(row.payment_date,"DD MMMM YYYY") : "-" }}</div>
                </template>
                <template #actions-data="{ row }">
                  <div v-if="row.status == 'Unpaid'" class="flex item-right justify-end gap-x-2">
                    <UTooltip text="Confirmation" class="me-2">
                      <UButton class="font-light" color="green" variant="soft" icon="i-heroicons-check-circle" size="2xs"
                               square :trailing="false" @click="editData(row)" />
                    </UTooltip>
                    <UTooltip text="Edit">
                      <UButton class="font-light" color="yellow" variant="soft" icon="i-heroicons-pencil-square" size="2xs"
                               square :trailing="false" @click="editData(row)" />
                    </UTooltip>
                    <UTooltip text="Delete">
                      <UButton class="font-light" color="red" variant="soft" icon="i-heroicons-trash" size="2xs" square
                               :trailing="false" @click="deleteData(row)" />
                    </UTooltip>
                  </div>
                </template>
              </UTable>
            </div>
            <div class="w-1/4 space-y-3">
              <h1 class="font-semibold text-gray-800 text-sm">Total Construction : <span class="font-medium ms-4">Rp.{{appMixin.accountingToPrice(dataKonstruksi.total)}}</span> </h1>
              <div class="w-full p-4 rounded-lg bg-gray-100 h-fit space-y-2">
                <UFormGroup v-if="state.id" label="Transaction Number">
                  <UInput v-model="state.kode" disabled />
                </UFormGroup>
              <UFormGroup label="Stage Name" name="name">
                <UInput v-model="state.name" placeholder="Input Stage" />
              </UFormGroup>
              <UFormGroup label="Amount" name="amount">
                <UInput v-model="state.total" v-on:blur="validateTotalInput" @focus="state.total = appMixin.accountingToNumber(state.total)" placeholder="0" />
              </UFormGroup>
              <UFormGroup label="Due Date" required>
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="appMixin.convertDateFormat(state.due_date, 'DD, MMM YYYY')" />

                  <template #panel="{ close }">
                    <AppDatePicker v-model="state.due_date" is-required @close="close" />
                  </template>
                </UPopover>
              </UFormGroup>

              <div class="w-full flex items-center justify-end space-x-2 pt-2">
                <UButton type="submit" color="blue">Save</UButton>
                <UButton type="button" color="gray" @click="resetForm">Cancel</UButton>
              </div>
              </div>
            </div>
          </div>

<!--          <template #footer>-->
<!--            <div class="w-full flex items-center justify-end space-x-2">-->
<!--              <UButton type="submit" color="blue">Save</UButton>-->
<!--              <UButton type="button" color="gray" @click="isOpen=false">Cancel</UButton>-->
<!--            </div>-->
<!--          </template>-->
        </UCard>
      </UForm>
    </UModal>
  </div>
</template>

<style scoped>

</style>