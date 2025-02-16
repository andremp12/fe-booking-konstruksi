<template>
  <div class="leading-normal min-h-screen tracking-normal" id="main-body">
    <section class="py-0 z-20">
      <div class="flex flex-wrap">

        <ClientSidebar/>

        <div class="w-full bg-gray-100 pl-0 lg:pl-64 min-h-screen overlay" id="main-content">

          <AppHeader/>

          <div class="p-6 bg-gray-100 mb-20">
            <slot />
          </div>

          <AppFooter />

        </div>
      </div>
    </section>
    <modals-container></modals-container>
  </div>
</template>

<script lang="ts">
import { ModalsContainer } from 'vue-final-modal';
export default {
  components: {ModalsContainer},

}
</script>

<style>

</style>