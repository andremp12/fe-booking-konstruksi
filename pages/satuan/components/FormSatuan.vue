<script lang="ts">
import { UCard, UModal } from '#components';
import type { ISatuan } from '~/types/ISatuan';

export default defineComponent({
  props:['mode','type'],
  emits:['submit','close'],
  setup(){
    const toast = useToast()

    return {
      toast
    }
  },
  data(){
    return {
      isOpen:false,
      title:'title' as string,
      state:reactive({}) as ISatuan,
    }
  },
  methods:{
    resetForm(){
      this.state.name=""
    },
    addData(title:string){
      this.title = title
      this.isOpen = true
      this.resetForm()
    },
    editData(title:string,data:ISatuan){
      this.title = title
      this.isOpen = true
      this.state.id = data.id
      this.state.name = data.name
      this.state.keterangan = data.keterangan
      console.log(this.state)
    },
    async onSubmit(){
      const _self = this
      const sUrl = this.state.id ? `/satuan/${this.state.id}` : '/satuan'

      await $api(sUrl,{
        onRequest(context:any):Promise<void>|void{
          context.options.method = _self.mode == "edit" ? "PUT" : "POST"
          context.options.body = _self.state
        }
      }).then((result:any)=>{
        console.log(result)
        _self.toast.add({
          icon: "i-heroicons-check-badge",
          color: "green",
          title: "Success",
          timeout: 3000,
          description: "Success saved data.",
          "ui": constantData.successNotificationStyle()
        })
        
        this.isOpen=false
        this.$emit('submit')
      }).catch((err:any)=>{
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
    onCancel(){
      this.isOpen=false
      this.$emit('close')
    }
  }
})
</script>

<template>
  <div>
    <UModal v-model="isOpen" prevent-close>
      <UForm :state="state" class="space-y-4" @submit="onSubmit" @error="">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ title }}
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
          </div>
        </template>

        <div class="flex flex-col space-y-3">
            <UFormGroup label="Unit Name" name="name">
              <UInput v-model="state.name" placeholder="Input Unit Name" />
            </UFormGroup>

            <UFormGroup label="Keterangan" name="keterangan">
              <UInput v-model="state.keterangan" type="keterangan" placeholder="Input Keterangan"/>
            </UFormGroup>
        </div>

        <template #footer>
          <div class="w-full flex items-center justify-end space-x-2">
            <UButton type="submit" color="blue" @click="isOpen=false">Save</UButton>
            <UButton type="button" color="gray" @click="onCancel">Cancel</UButton>
          </div>
        </template>
      </UCard>
    </UForm>
    </UModal>
  </div>
</template>

<style>

</style>