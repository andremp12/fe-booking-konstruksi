<template>
  <div class="w-full flex flex-row items-center justify-between">
    <UBreadcrumb :links="links" :ui="{active:'text-blue-500 dark:text-blue-400',}"/>
    <slot name="right" />
  </div>
</template>

<script lang="ts" setup>
import { UBreadcrumb } from '#components';

const props = defineProps({
  links:{
    type:UBreadcrumb.links,
    default:()=>[]
  }
})
</script>

<style>

</style>