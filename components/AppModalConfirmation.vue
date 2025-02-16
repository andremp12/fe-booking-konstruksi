<script lang="ts" setup>
import { VueFinalModal } from 'vue-final-modal';

  defineProps<{
    title?:string,
    labelOk?:string,
    labelCancel?:string,
    titleColor?:string,
    buttonColor?:string
  }>()

  const emit=defineEmits<{
    (e:'confirm'):void
    (e:'update:modelValue',modelValue:Boolean):void
  }>()
</script>

<template>
  <VueFinalModal class="flex justify-center items-center fixed inset-0 z-50 bg-gray-100 bg-opacity-70"
      content-class="relative sm:max-w-lg sm:w-full flex flex-col max-h-full mx-4 centered-modal"
      content-transition="vfm-fade"
      overlay-transition="vfm-fade"
      @update:model-value="val => emit('update:modelValue',val)">

      <UCard>
        <template #header>
          <div>
            <label class="font-medium" :class="titleColor ? titleColor : 'text-gray-700' ">{{ title ? title : 'Konfirmasi' }}</label>
          </div>
        </template>

        <div class="px-4 py-3 sm:p-4">
          <div class="relative overflow-hidden px-4 flex items-center justify-center text-sm">
            <slot/>
          </div>
        </div>

        <template #footer>
          <div class="w-full space-x-2 flex justify-end items-center">
            <UButton padded class="w-20 justify-center" @click="emit('confirm')">{{ labelOk ? labelOk : 'Yes' }}</UButton>
            <UButton padded class="w-16 justify-center" color="gray" @click="emit('update:modelValue',false)">{{ labelCancel ? labelCancel : 'No' }}</UButton>
          </div>
        </template>
      </UCard>

  </VueFinalModal>
</template>

<style>

</style>