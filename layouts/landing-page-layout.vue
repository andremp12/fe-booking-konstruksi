<template>
  <div class="w-full overflow-hidden bg-white min-h-screen">

    <LandingPHeader/>

    <div class="w-full">
      <slot />
    </div>

  </div>
</template>

<script lang="ts" setup>
import { UButton } from '#components';


</script>

<style>

</style>