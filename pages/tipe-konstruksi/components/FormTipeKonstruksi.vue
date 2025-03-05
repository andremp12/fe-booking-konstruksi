<script lang="ts">
import { UCard, UModal } from '#components';
import type { ISatuan } from '~/types/ISatuan';
import type { ITipeKonstruksi } from '~/types/ITipeKonstruksi';

export default defineComponent({
  computed:{
    appMixin(){
      return appMixin
    }
  },
  props: ['mode', 'type'],
  emits: ['submit', 'close'],
  setup() {
    const toast = useToast()
    const fileInput = ref<InstanceType<typeof HTMLInputElement>|null>(null)

    return {
      toast, fileInput
    }
  },
  data() {
    return {
      image: null as any|Blob,
      isOpen: false,
      title: 'title' as string,
      state: reactive({}) as ITipeKonstruksi,
    }
  },
  methods: {
    resetForm() {
      this.state.id = null
      this.state.name = ""
      this.state.harga_full = 0
      this.state.harga_jasa = 0
      this.state.image = null
      this.image = null
    },
    addData(title: string) {
      this.title = title
      this.isOpen = true
      this.resetForm()
    },
    editData(title: string, data: ITipeKonstruksi) {
      this.title = title
      this.isOpen = true
      this.state.id = data.id
      this.state.name = data.name
      this.state.harga_full = this.appMixin.accountingToPrice(data.harga_full)  
      this.state.harga_jasa = this.appMixin.accountingToPrice(data.harga_jasa) 
      this.state.image = data.image
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
    validateHargaFull(){
      if ( this.state.harga_full < 0){
        this.toast.add({
          icon: "i-heroicons-exclamation-triangle",
          color: "red",
          title: "Upss!",
          timeout: 3000,
          description: "The value cannot be negative.",
          "ui": constantData.errorNotificationStyle()
        })

        this.state.harga_full = 0
      }

      this.state.harga_full = this.appMixin.accountingToPrice(this.state.harga_full)
    },
    validateHargaJasa(){
      if ( this.state.harga_jasa < 0){
        this.toast.add({
          icon: "i-heroicons-exclamation-triangle",
          color: "red",
          title: "Upss!",
          timeout: 3000,
          description: "The value cannot be negative.",
          "ui": constantData.errorNotificationStyle()
        })

        this.state.harga_jasa = 0
      }

      this.state.harga_jasa = this.appMixin.accountingToPrice(this.state.harga_jasa)
    },
    async onSubmit() {
      const _self = this
      this.state.harga_full = this.appMixin.accountingToNumber(this.state.harga_full)
      this.state.harga_jasa = this.appMixin.accountingToNumber(this.state.harga_jasa)

      const sUrl = this.state.id ? `/tipe-konstruksi/${this.state.id}` : '/tipe-konstruksi'

      const formData = new FormData()
      formData.append('name',this.state.name)
      formData.append('harga_full',this.state.harga_full ?? 0)
      formData.append('harga_jasa',this.state.harga_jasa ?? 0)
      if(this.image != null){
        formData.append('file_image',this.image)
      }

      await $api(sUrl, {
        onRequest(context: any): Promise<void> | void {
          context.options.method = _self.mode == "edit" ? "PUT" : "POST"
          context.options.body = formData
          context.options.headers = context.options.headers || {}
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

        this.isOpen = false
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
    onCancel() {
      this.isOpen = false
      this.$emit('close')
    }
  }
})
</script>

<template>
  <div>
    <UModal v-model="isOpen" :ui="{width:'sm:max-w-xl',height:'h-auto'}" prevent-close>
      <UForm :state="state" class="space-y-4 w-full flex" @submit="onSubmit" @error="">
        <UCard class="w-full" :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800'}">

          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                {{ title }}
              </h3>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                @click="isOpen = false" />
            </div>
          </template>

          <div class="flex flex-row gap-4 w-full">
            <div class="flex flex-col space-y-4 w-1/2">
              <UFormGroup label="Name" name="name">
                <UInput  v-model="state.name" placeholder="Input Unit Name" />
              </UFormGroup>
              <UFormGroup label="Harga Full" name="harga_full">
                <UInput v-model="state.harga_full" v-on:blur="validateHargaFull" @focus="state.harga_full = appMixin.accountingToNumber(state.harga_full)" placeholder="0" />
              </UFormGroup>
              <UFormGroup label="Harga Jasa" name="harga_full">
                <UInput v-model="state.harga_jasa" v-on:blur="validateHargaJasa" @focus="state.harga_jasa = appMixin.accountingToNumber(state.harga_jasa)" placeholder="0" />
              </UFormGroup>
            </div>
            <div class="flex flex-col space-y-4 w-1/2">
              <img v-if="state.image" :src="state.image" class="w-full rounded-lg" width="100%" alt="">
              <img v-else src="/assets/images/add-photo.svg" @click="onPickFile" class="w-full cursor-pointer rounded-lg" width="100%" alt="">

              <input type="file" @change="onPickedFile" ref="fileInput" class="cursor-pointer" />
            </div>
          </div>

          <template #footer>
            <div class="w-full flex items-center justify-end space-x-2">
              <UButton type="submit" color="blue" @click="isOpen = false">Save</UButton>
              <UButton type="button" color="gray" @click="onCancel">Cancel</UButton>
            </div>
          </template>
        </UCard>
      </UForm>
    </UModal>
  </div>
</template>

<style></style>