
<script lang="ts">
import { useModal } from 'vue-final-modal';
import AppBreadcrumb from '~/components/AppBreadcrumb.vue';
import AppModalConfirmation from '~/components/AppModalConfirmation.vue';
import type { ITipeKonstruksi } from '~/types/ITipeKonstruksi';
import { appMixin } from '~/utils/mixin';
import FormTipeKonstruksi from './components/FormTipeKonstruksi.vue';

export default defineComponent({
  components:{AppBreadcrumb,FormTipeKonstruksi},
  computed:{
    appMixin(){
      return appMixin
    }
  },
  setup(){
    definePageMeta({
      layout:"theme-layout",
      pageMenu:"tipe_konstruksi"
    })

    const toast = useToast()
    const uFormTipeKonstruksi = ref<InstanceType <typeof FormTipeKonstruksi>|null>(null)

    return { toast, uFormTipeKonstruksi }
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
          label: 'Tipe Konstruksi',
        },
      ],
      actions : [
        [{
            label: 'Edit',
            slot: 'edit',
          }, {
            label: 'Delete',
            slot:'delete',
          }]
      ] as any,
      data : [] as ITipeKonstruksi[],
      mode : 'browser' as 'browser'|'add'|'edit'|'show'
    }
  },
  async created(){
    await this.getData()
  },
  methods:{
    async getData(){
      const _self = this

      await $api('/tipe-konstruksi',{
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
    addData(){
      this.mode = 'add'
      this.uFormTipeKonstruksi?.addData('Add New Data')
    },
    editData(data:ITipeKonstruksi){
      this.mode = 'edit'
      this.uFormTipeKonstruksi?.editData('Edit Data',data)
    },
    deleteData(data: ITipeKonstruksi){
      const _self = this
      const {open,close} = useModal({
        component:AppModalConfirmation,
        attrs:{
          async onConfirm(){
            await $api(`/tipe-konstruksi/${data.id}`,{
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
    afterSubmit(){
      this.mode = 'browser'
      console.log('h')
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
          <UButton @click="addData" color="blue" class="px-2">+Add Data</UButton>
      </template>
    </AppBreadcrumb>

    <UCard class="mt-4">
      <div class="w-full flex-1">
        <div class="grid grid-cols-4 gap-x-4 gap-y-6">
          <div v-for="tipe_konstruksi in data" :key="tipe_konstruksi.id" class="flex flex-col bg-gray-200 rounded-3xl  h-full w-full min-h-[400px] shadow-md shadow-gray-500">  
            <div class="relative w-full h-full rounded-3xl bg-cover bg-center" 
            :style="{backgroundImage:`url(${tipe_konstruksi.image ? tipe_konstruksi.image : '/default.jpg' })`}"> <!-- membuat background image menjadi dinamis -->
              <div class="relative w-full h-full rounded-3xl bg-gradient-to-t from-black/80 from-20% to-80% to-black/20 px-4 py-6">
                <div class="w-full h-full flex flex-col justify-between">
                  <div class="flex w-full justify-end">
                    <UDropdown :items="actions"  :popper="{ placement: 'bottom-end' }" >
                      <UButton color="gray" variant="solid" class="text-gray-800 hover:bg-gray-200 rounded-full" trailing-icon="i-ic-baseline-more-vert" />

                      <template #edit="{item}">
                          <UButton variant="ghost" @click="editData(tipe_konstruksi)" class="truncate font-medium text-gray-900 dark:text-white flex items-center justify-start w-full py-1">
                            <UIcon name="i-heroicons-pencil-square-20-solid" class="h-4 w-4 me-2" />
                            {{ item.label }}
                          </UButton>
                      </template>

                      <template #delete="{item}">
                        <UButton variant="ghost" @click="deleteData(tipe_konstruksi)" class="truncate font-medium text-gray-900 dark:text-white w-full py-1 text-start flex items-center justify-start">
                          <UIcon name="i-heroicons-trash-20-solid" class="h-4 w-4 me-2" />
                          {{ item.label }}
                        </UButton>
                      </template>
                    </UDropdown>
                  </div>
                  <div class="text-white">
                    <h1 class="text-3xl font-medium mb-4">{{ tipe_konstruksi.name }}</h1>
                    <div class="w-full flex font-light mb-2">
                      <p class="w-1/3 ">Harga Full</p> <p class="w-2/3 fontm">: Rp. {{ appMixin.accountingToPrice(tipe_konstruksi.harga_full) }}</p>
                    </div>
                    <div class="w-full flex font-light mb-4">
                      <p class="w-1/3">Harga Jasa</p> <p class="w-2/3">: Rp. {{ appMixin.accountingToPrice(tipe_konstruksi.harga_jasa) }}</p>
                    </div>
                    <nuxt-link :to="(`/tipe-konstruksi/show/${tipe_konstruksi.id}`)"
                      class="flex bg-primary hover:bg-primary-600 cursor-pointer justify-center w-full rounded-3xl py-2 px-2">Detail</nuxt-link>
                  </div>
                </div>
                
              </div>
              <!-- <div class="absolute z-20 w-full h-full bg-gradient-to-t from-black/80 to-transparent"></div>
              <img src="http://localhost:3001/rumah-tipe-1.jpg" alt="" class="absolute z-10 bg-cover w-full h-full rounded-lg" /> -->
            </div>
            
          </div>
        </div>
      </div>
    </UCard>

    <FormTipeKonstruksi ref="uFormTipeKonstruksi" :mode="mode" @close="onCancel" @submit="afterSubmit" />
  </div>
</template>


<style>

</style>