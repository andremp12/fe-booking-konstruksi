<script lang="ts">
export default defineComponent ({
  setup() {
    definePageMeta({
      layout:'client-layout',
      pageMenu:"home",
      middleware: ['client'],
    })
  },
  data(){
    return {
      breadcrumbs: [
        {
          label: "Home",
          icon: 'i-material-symbols-dashboard-2-outline',
        }
      ],
    }
  }
})
</script>

<template>
  <div class="w-full">
    <AppBreadcrumb :links="breadcrumbs">
    </AppBreadcrumb>
  </div>
</template>

<style scoped>

</style>