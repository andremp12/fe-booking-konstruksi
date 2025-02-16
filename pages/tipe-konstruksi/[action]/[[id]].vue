<script lang="ts">
import type { ITipeKonstruksi } from '~/types/ITipeKonstruksi';

    export default defineComponent({
        computed:{
            appMixin(){
                return appMixin
            }
        },
        setup(){
            definePageMeta({
                layout:'theme-layout',
                pageMenu:'tipe_konstruksi'
            })

            return{}
        },
        data(){
            return{
                breadcrumbs:[
                {
                    label: "Dashboard",
                    icon: 'i-material-symbols-dashboard-2-outline',
                    to: '/dashboard'
                },
                {
                    label: 'Tipe Konstruksi',
                    icon: 'i-material-symbols-garage-door-outline',
                    to: '/tipe-konstruksi'
                },
                {
                    label:'Add Data'
                }
                ],
                state:reactive({}) as ITipeKonstruksi
            }
        }
    })
</script>

<template>
    <div class="w-full gap-4">
        <AppBreadcrumb :links="breadcrumbs"></AppBreadcrumb>

        <UCard class="mt-4" :ui="{background:'bg-gray-50'}">
            <div class="w-full flex-1 px-2">
                <UForm :state="state">
                    <div class="flex w-full items-center justify-between">
                        <h1 class="text-gray-800 font-semibold text-xl">New Tipe Konstruksi</h1>
                        <UButton type="submit" label="Save" />
                    </div>
                    <UDivider class="h-4"/>
                    <div class="flex flex-row w-full gap-8 mt-4">
                        <div class="flex flex-col space-y-4 w-1/2">
                            <UFormGroup label="Name" name="name">
                                <UInput size="lg" v-model="state.name" placeholder="Input Unit Name" />
                            </UFormGroup>
                            <UFormGroup label="Harga Full" name="harga_full">
                                <UInput v-model="state.harga_full" placeholder="0"/>
                            </UFormGroup>
                            <UFormGroup label="Harga Jasa" name="harga_full">
                                    <UInput v-model="state.harga_full" placeholder="0"/>
                            </UFormGroup>
                        </div>
                        <div class="flex flex-col space-y-2 w-1/2">
                           <img src="/default.jpg"  alt="">
                        </div>
                    </div>
                </UForm>
            </div>
        </UCard>
    </div>
</template>