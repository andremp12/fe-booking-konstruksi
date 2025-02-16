<script lang="ts">
import type {ILaporanKonstruksi} from "~/types/ILaporan";

export default defineComponent ({
  computed: {
    appMixin() {
      return appMixin
    }
  },
  setup() {
    definePageMeta({
      layout:'mandor-layout',
      pageMenu:"home",
      middleware: ['mandor'],
    })

    const user = useAuthStore().userData
    const toast = useToast()

    return {
      user,toast
    }
  },
  data(){
    return {
      breadcrumbs: [
        {
          label: "Home",
          icon: 'i-material-symbols-dashboard-2-outline',
        }
      ],
      dataLaporan: [] as ILaporanKonstruksi[]
    }
  },
  methods: {
    async getDataLaporan(){
      const _self = this

      await $api(`/laporan-konstruksi/19`,{
        onRequest(context:any):Promise<void>|void{
          context.options.method="GET"
          context.options.headers=context.options.headers || {}
        }
      }).then((result:any)=>{
        this.dataLaporan = result.data
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
  }
})
</script>

<template>
  <div class="w-full space-y-4">
    <AppBreadcrumb :links="breadcrumbs">
    </AppBreadcrumb>

    <div class="w-full flex gap-4">
      <UCard class="w-1/3" >
        <div class="w-full flex gap-4">
          <img class="w-1/2" src="/assets/images/add-photo.svg" alt=""  />
          <div class="w-1/2">
            <div class="mb-2">
              <label for="name" class="text-gray-800 font-semibold text-sm">Name</label>
              <p class="text-gray-500 font-light text-sm">{{user.user?.name}}</p>
            </div>
            <div class="mb-2">
              <label for="name" class="text-gray-800 font-semibold text-sm">Name</label>
              <p class="text-gray-500 font-light text-sm">{{user.user?.email}}</p>
            </div>
            <div class="mb-2">
              <label for="name" class="text-gray-800 font-semibold text-sm">Name</label>
              <p class="text-gray-500 font-light text-sm">{{user.user?.no_wa}}</p>
            </div>
          </div>
        </div>
      </UCard>
      <UCard class="w-2/3 h-auto">
        <div class="w-full flex items-center">
          <h1 class="text-lg font-semibold text-gray-800">Activity Report</h1>
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
<!--                <UTooltip text="Detail" class="pe-4">-->
<!--                  <UButton class="font-light" color="blue" variant="solid" icon="i-heroicons-document-text" size="xs"-->
<!--                           square :trailing="false" @click="" />-->
<!--                </UTooltip>-->
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<style scoped>

</style>