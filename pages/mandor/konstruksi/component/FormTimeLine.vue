<script lang="ts">

import AppDatePicker from "~/components/AppDatePicker.vue";
import type {ITimeline} from "~/types/ITimeline";



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
      state: reactive({}) as ITimeline,
      isOpen: false,
      title: '',
      // start_date:new Date(),
      // end_date: sub(new Date(),{days:1}),
    }
  },
  async created(){
    // await this.setForm
  },
  methods: {
    add(konstruksi_id:any,title:string){
      this.title = title
      this.isOpen = true

      this.state.id =
      this.state.name = ''
      this.state.konstruksi_id = konstruksi_id;
      this.state.description = ''
      this.state.date = new Date()
    },
    async onSubmit(){
      const _self = this

      this.state.date = this.appMixin.convertDateFormat(this.state.date,"YYYY-MM-DD")

      console.log(this.state)
      await $api(`/timeline`,{
        onRequest(context:any):Promise<void>|void{
          context.options.method = "POST"
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
            <UFormGroup label="Title" required>
              <UInput  v-model="state.name" placeholder="Input Title" />
            </UFormGroup>
              <UFormGroup label="Date" required>
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-calendar-days-20-solid" :label="appMixin.convertDateFormat(state.date, 'DD, MMM YYYY')" />

                  <template #panel="{ close }">
                    <AppDatePicker v-model="state.date" is-required @close="close" />
                  </template>
                </UPopover>
              </UFormGroup>
            <UFormGroup class="mb-4" label="Description" name="deksripsi">
              <UTextarea color="white" v-model="state.description" variant="outline" placeholder="Description" />
            </UFormGroup>
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