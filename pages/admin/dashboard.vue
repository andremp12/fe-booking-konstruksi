<script lang="ts">
  import {useAuthStore} from "~/stores/authStore";

  export default defineComponent({
    setup(){
      console.log(useAuthStore().getToken)

      definePageMeta({
        layout: 'theme-layout',
        middleware: ['admin'],
        name: "Dashboard",
      })
    },
    data(){

    },
    actions:{

    }
  })
</script>

<template>
  <div class="container">
    <h1>Dashboard</h1>
  </div>
</template>

<style scoped>

</style>