<script lang="ts">

import type {IKonstruksi, IKonstruksiConfirmation} from "~/types/IKonstruksi";
import AppDatePicker from "~/components/AppDatePicker.vue";
import type {IMandor} from "~/types/IMandor";
import {sub} from "date-fns";



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
      dataMandor: [] as IMandor[],
      isOpen: false,
      title: '',
      // start_date:new Date(),
      // end_date: sub(new Date(),{days:1}),
    }
  },
  async created(){
    this.getMandor()
  },
  methods: {
    async getMandor(){
      await $api('/mandor',{
        onRequest(context:any):Promise<void>|void{
          context.options.method="GET"
          context.options.headers=context.options.headers || {
            "Content-Type":'application/json',
            "Accept":'application/json'
          }
        }
      }).then((result:any)=>{
        this.dataMandor = result.data
        console.log(this.dataMandor)
      }).catch((err:any)=>{
        console.log(err)
      })
    },
    confirmation(id:any,title:string){
      this.title = title
      this.isOpen = true

      this.state.id = id
      this.state.mandor_id = ''
      this.state.start_date = new Date();
      this.state.end_date = new Date()
    },
    async onSubmit(){
      const _self = this

      this.state.start_date = this.appMixin.convertDateFormat(this.state.start_date,"YYYY-MM-DD")
      this.state.end_date = this.appMixin.convertDateFormat(this.state.end_date,"YYYY-MM-DD")

      console.log(this.state)
      await $api(`/konstruksi/confirmation/${_self.state.id}`,{
        onRequest(context:any):Promise<void>|void{
          context.options.method = "PUT"
          context.options.body = _self.state
        }
      }).then((result:any)=>{
        _self.toast.add({
          icon: "i-heroicons-check-badge",
          color: "green",
          title: "Success",
          timeout: 3000,
          description: "Success confirmation.",
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
          description: "Failed confirmation.",
          "ui": constantData.errorNotificationStyle()
        })
      })
    },
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
            <UFormGroup label="Choose Mandor" required>
            <USelectMenu
                required
                clear-search-on-close
                class="w-full"
                placeholder="Choose a mandor"
                searchable
                searchable-placeholder="Search a Mandor..."
                value-attribute="id"
                option-attribute="name"
                :options="dataMandor"
                v-model="state.mandor_id"
            />
            </UFormGroup>

            <div class="w-full flex items-center space-x-4">
              <UFormGroup label="Start Date" required>
              <UPopover :popper="{ placement: 'bottom-start' }">
                <UButton icon="i-heroicons-calendar-days-20-solid" :label="appMixin.convertDateFormat(state.start_date, 'DD, MMM YYYY')" />

                <template #panel="{ close }">
                  <AppDatePicker v-model="state.start_date" is-required @close="close" />
                </template>
              </UPopover>
              </UFormGroup>


              <UFormGroup label="End Date" required>
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="appMixin.convertDateFormat(state.end_date, 'DD, MMM YYYY')" />

                  <template #panel="{ close }">
                    <AppDatePicker v-model="state.end_date" is-required @close="close" />
                  </template>
                </UPopover>
              </UFormGroup>
            </div>
          </div>

          <template #footer>
            <div class="w-full flex items-center justify-end space-x-2">
              <UButton type="submit" color="blue">Save</UButton>
              <UButton type="button" color="gray" @click="isOpen=false">Cancel</UButton>
            </div>
          </template>
        </UCard>
      </UForm>
    </UModal>
  </div>
</template>

<style scoped>

</style>