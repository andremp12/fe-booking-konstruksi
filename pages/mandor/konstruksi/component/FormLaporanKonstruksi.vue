<script lang="ts">
import type {ITipeKonstruksi} from "~/types/ITipeKonstruksi";
import type {IBooking} from "~/types/IBooking";
import {appMixin} from "~/utils/mixin";
import type {IBahanKonstruksi, ILaporanKonstruksi} from "~/types/ILaporan";
import type {IKonstruksi} from "~/types/IKonstruksi";
import type {IColumn} from "~/types/IColumn";
import type {ISatuan} from "~/types/ISatuan";

export default defineComponent({
  props:["mode"],
  emits:["back","submit"],
  computed:{
    appMixin(){
      return appMixin
    }
  },
  setup() {

    const user = useAuthStore().userData
    const toast = useToast()
    const route = useRoute()
    const fileInput = ref<InstanceType<typeof HTMLInputElement>|null>(null)
    const focusInput = ref([]) as any
    const activeIndex = ref(null) as any

    return {
      user,toast,route,fileInput,focusInput,activeIndex
    }
  },
  data(){
    return {
      state:reactive({}) as ILaporanKonstruksi,
      optionsStatus: [
        {
          label:'Proses',
          value:'Proses'
        },
        {
          label:'Finished',
          value:'Finished'
        },
      ],
      breadcrumbs: [
        {
          label: "Home",
          icon: 'i-material-symbols-dashboard-2-outline',
          to: '/mandor/home'
        },
        {
          label: 'Konstruksi',
          icon: 'i-material-symbols-checkbook-outline-rounded',
          to: this.route,
        },
        {
          label: 'Laporan Konstruksi',
        },
      ],
      image:null as any|Blob,
      dataBahan:[] as IBahanKonstruksi[],
      dataSatuan:[] as ISatuan[],
      columnBahan:[
        {
          key:'id',
          class:'hidden',
          rowClass:'hidden'
        },
        {
          key:'name',
          label:'NAME',
        },
        {
          key:'price',
          label:'PRICE',
        },
        {
          key:'unit',
          label:'UNIT',
        },
        {
          key:'qty',
          label:'QTY',
        },
        {
          key:'total',
          label:'TOTAL',
        },
        {
          key:'actions',
        },
      ] as IColumn[]
    }
  },
  async created(){
    this.setForm()
    this.getDataUnit()
  },
  methods: {
    setForm(){
      this.state.title = '';
      this.state.bahan_konstruksi=null
      this.state.deskripsi = ''
      this.state.image = null
      this.state.bahan_konstruksi=[] as IBahanKonstruksi[]
    },
    addLaporan(data:IKonstruksi){
      this.state.konstruksi_id=data.id
      this.state.mandor_id=data.mandor?.id
      this.state.tipe = data.tipe_konstruksi?.name;
      this.state.mandor_name = data.mandor?.name
      this.state.client=data.client?.name
      this.setForm()
    },
    onPickFile(){
      this.fileInput?.click()
    },
    onPickedFile(event:any){
      const files = event.target.files

      const fileReader = new FileReader()
      fileReader.addEventListener("load",()=>{
        this.state.image = fileReader.result
      })

      fileReader.readAsDataURL(files[0])
      this.image = files[0]
    },
    addBahan(){
      const newDataBahan = {} as IBahanKonstruksi
      newDataBahan.id = Date.now()
      newDataBahan.name = null
      newDataBahan.price = 0
      newDataBahan.unit = null
      newDataBahan.qty = 0
      newDataBahan.total=0
      this.state.bahan_konstruksi.push(newDataBahan)

      console.log(this.state.bahan_konstruksi)
    },
    deleteBahan(data:any){
      this.dataBahan.splice(this.dataBahan.indexOf(data),1)
    },
    async getDataUnit(){
      const _self = this

      await $api(`/satuan`,{
        onRequest(context:any):Promise<void>|void{
          context.options.method="GET"
          context.options.headers=context.options.headers || {}
        }
      }).then((result:any)=>{
        this.dataBahan = result.data
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
    async submit(){
      const _self = this

      const formData = new FormData()
      formData.append('title',this.state.title)
      formData.append('konstruksi_id',this.state.konstruksi_id)
      formData.append('mandor_id',this.state.mandor_id)
      formData.append('mandor_name',this.state.mandor_name)
      formData.append('client',this.state.client)
      formData.append('tipe',this.state.tipe)
      formData.append('deskripsi',this.state.deskripsi ?? null)
      formData.append('status',this.state.status)
      formData.append('bahan_kosntruksi',JSON.stringify(this.state.bahan_konstruksi))
      if(this.image != null){
        formData.append('file_image',this.image)
      }

      await $api("/laporan-konstruksi", {
        onRequest(context: any): Promise<void> | void {
          context.options.method = "POST"
          context.options.body = formData
          context.options.headers =  context.options.headers || {
            "Content-Type":"multipart/form-data",
          }
        }
      }).then((result: any) => {
        console.log(result)
        _self.toast.add({
          icon: "i-heroicons-check-badge",
          color: "green",
          title: "Success",
          timeout: 3000,
          description: "Success saved data.",
          "ui": constantData.successNotificationStyle()
        })

        this.$emit('submit')
        console.log('hii')
      }).catch((err: any) => {
        console.log(err)
        _self.toast.add({
          icon: "i-heroicons-exclamation-triangle",
          color: "red",
          title: "Failed",
          timeout: 3000,
          description: "Failed saved data.",
          "ui": constantData.errorNotificationStyle()
        })
      })
    },
    handleTotal(data:IBahanKonstruksi){
      data.total = data.price * data.qty;
    },
    onBack(){
      this.$emit("back")
    }
  }
})
</script>

<template>
  <div v-if="mode=='laporan'" class="w-full">
    <UForm class="space-y-4" ref="form" :state="state" @submit="submit">
      <UButton @click="onBack" color="gray" variant="outline" label="Back" icon="i-heroicons-arrow-left" />
      <div class="w-full flex justify-between items-center gap-4">
        <h1>Create Laporan Konstruksi</h1>
        <UButton type="submit" color="primary" label="Submit" />
      </div>

      <div class="w-full flex gap-4">
        <div class="p-4 bg-white rounded-lg w-2/3">
              <UFormGroup class="mb-4" label="Title" required name="title">
                <UInput  v-model="state.title" placeholder="Input Title" />
              </UFormGroup>
              <UFormGroup class="mb-4" label="Status Konstruksi" required>
                <USelectMenu
                    required
                    class="w-full"
                    placeholder="Choose a Status"
                    value-attribute="value"
                    option-attribute="label"
                    :options="optionsStatus"
                    v-model="state.status"
                />
              </UFormGroup>
              <UFormGroup class="mb-4" label="Description" name="deksripsi">
                <UTextarea color="white" v-model="state.deskripsi" variant="outline" placeholder="Description" />
              </UFormGroup>
              <div>
                <label class="mb-2 font-semibold text-gray-800 text-sm">Bahan Konstruksi</label>
                <UTable class=""
                    :columns="columnBahan"  :rows="state.bahan_konstruksi">
                  <template #actions-header>
                    <div class="w-full flex justify-end">
                      <UButton @click="addBahan" color="primary" label="+Add Item" />
                    </div>
                  </template>
                  <template #name-data="{row,index}">
                    <UFormGroup v-if="dataBahan.length > 0" label="Name" required name="name">
                      <UInput class="mb-4" v-model="row.name" @change="console.log(index)" placeholder="Input Title" />
                    </UFormGroup>
                  </template>
                  <template #price-data="{row}">
                    <UFormGroup class="mb-4" label="Price" required >
                      <UInput  v-model="row.price" @change="handleTotal(row)" placeholder="Input Title" />
                    </UFormGroup>
                  </template>
                  <template #unit-data="{row}">
                    <UFormGroup class="mb-4" label="Unit" required >
                      <USelectMenu
                          required
                          class="w-full"
                          placeholder="Choose a Status"
                          value-attribute="name"
                          option-attribute="name"
                          :options="dataBahan"
                          v-model="row.unit"
                      />
                    </UFormGroup>
                  </template>
                  <template #qty-data="{row}">
                    <UFormGroup class="mb-4" @change="handleTotal(row)" label="Qty" required >
                      <UInput  v-model="row.qty" placeholder="Input Title" />
                    </UFormGroup>
                  </template>
                  <template #total-data="{row}">
                    <UFormGroup class="mb-4" label="Total" required >
                      <UInput  v-model="row.total" placeholder="Input Title" />
                    </UFormGroup>
                  </template>
                  <template #actions-data="{ row }">
                    <div class="flex item-right justify-end gap-x-2">
                      <UTooltip text="Delete">
                        <UButton class="font-light" color="red" variant="soft" icon="i-heroicons-trash" size="2xs" square
                                 :trailing="false" @click="deleteBahan(row)" />
                      </UTooltip>
                    </div>
                  </template>
                </UTable>
              </div>
        </div>
        <div class="p-4 bg-white rounded-lg  w-1/3">
              <img v-if="state.image" :src="state.image" class="w-full rounded-lg mb-2" width="100%" alt="">
              <img v-else src="/assets/images/add-photo.svg" @click="onPickFile" class="w-full mb-4 cursor-pointer rounded-lg" width="100%" alt="">

              <input type="file" @change="onPickedFile" ref="fileInput" class="cursor-pointer" />
        </div>
      </div>
    </UForm>
  </div>
</template>

<style scoped>

</style>