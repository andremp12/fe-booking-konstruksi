<script lang="ts">
import AppBreadcrumb from '~/components/AppBreadcrumb.vue';
import type { IColumn } from '~/types/IColumn';
import type { ISatuan } from '~/types/ISatuan';
import FormSatuan from './components/FormSatuan.vue';
import { useModal} from 'vue-final-modal';
import AppModalConfirmation from '~/components/AppModalConfirmation.vue';


export default defineComponent({
  components:{AppBreadcrumb,FormSatuan},
  setup(){
    definePageMeta({
      layout:"theme-layout",
      pageMenu:"satuan",
      page:"Satuan"
    })

    const uFormSatuan = ref<InstanceType <typeof FormSatuan>|null>(null)
    const toast = useToast()

    return {
      uFormSatuan,toast
    }
  },
  data(){
    return{
      breadcrumbs: [
        {
          label: "Dashboard",
          icon: 'i-material-symbols-dashboard-2-outline',
          to: '/dashboard'
        },
        {
          label: 'Satuan',
        },
      ],
      mode: 'browser' as 'browser'|'add'|'edit'|'show',
      data: [] as ISatuan[],
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
          key:'name',
          label:'NAME'
        },
        {
          key:'keterangan',
          label:'KETERANGAN'
        },
        {
          key:'actions',
        },
      ]
    },
    async getData(){
      await $api('/satuan',{
        onRequest(context:any):Promise<void>|void{
          context.options.method="GET"
          context.options.headers={
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
    deleteData(data: ISatuan){
      const _self = this
      const {open,close} = useModal({
        component:AppModalConfirmation,
        attrs:{
          async onConfirm(){
            await $api(`/satuan/${data.id}`,{
              onRequest(context:any):Promise<void>|void{
                context.options.method = "DELETE"
                context.options.headers = context.options.headers || {}
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
    addData(){
      this.mode = "add"
      this.uFormSatuan?.addData('Add New Data')
    },
    editData(data:ISatuan){
      this.mode= "edit"
      this.uFormSatuan?.editData('Edit Data',data)
    },
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
      <template v-slot:right>
        <NuxtLink>
          <UButton color="blue" class="px-2" @click="addData" >+Add Data</UButton>
        </NuxtLink>
      </template>
    </AppBreadcrumb>

    <UCard class="mt-4" :ui="{background:'bg-gray-50'}">
      <div class="w-full flex-1">
        <UTable
        :columns="columns" :rows="data">
            <template #id-data="{row}">
              {{ data.findIndex((item) => item.id===row.id)+1 }}
            </template>
            <template #name-data="{row}">
                <div class="font-medium text-gray-800">{{ row.name }}</div>
            </template>
            <template #keterangan-data="{row}">
                <div>
                  {{ row.keterangan ? row.keterangan : '-' }}
                </div>
            </template>
            <template #actions-data="{ row }">
              <div class="flex item-right justify-end gap-x-2">
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
    </UCard>
  </div>

  <FormSatuan ref="uFormSatuan" :mode="mode" @close="onCancel" @submit="afterSubmit" />
</template>

<style>

</style>