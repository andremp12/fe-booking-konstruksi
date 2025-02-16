<template>
  <div class="w-1/2 md:w-1/3 lg:w-64 fixed md:top-0 md:left-0 h-screen lg:block bg-gray-100 border-r z-30"
       id="main-nav">

    <div class="w-full h-20 border-b flex px-4 items-center mb-8">
      <p class="font-semibold text-3xl text-blue-400 pl-4">LOGO</p>
    </div>

    <div v-for="(group,index) in groups" :key="index" class="mb-4 px-4">
      <p class="pl-4 text-sm font-semibold mb-1">{{group.label}}</p>
      <NuxtLink v-for="menu in group.menus" :key="menu.id" :to="menu.routeAction" :class="{'bg-gray-200': $route.meta.pageMenu === menu.page }"
                class="w-full flex items-center text-blue-400 h-10 pl-4 hover:bg-gray-200 rounded-lg cursor-pointer">
        <UIcon :name="menu.icon" class="h-6 w-6 me-2" />
        <span class="text-gray-700">{{ menu.label }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
import type { IGroupSidebar } from '~/types/ISidebar';


export default{
  data(){
    return{
      groups:[
        {
          label:"Main",
          menus:[
            {
              parent:null,
              id:1,
              label:"Home",
              page:"home",
              routeName:"home",
              routeAction:"/mandor",
              icon:"i-material-symbols-dashboard-2-outline",
              scope:"view_home",
              child:[]
            },
            {
              parent:null,
              id:3,
              label:"Konstruksi",
              page:"konstruksi",
              routeName:"konstruksi",
              routeAction:"/mandor/konstruksi",
              icon:"i-tdesign-building-5",
              scope:"view_konstruksi",
              child:[]
            }
          ]
        },
        {
          label:"Riwayat",
          menus:[
            {
              parent:null,
              id:1,
              label:"Riwayat Konstruksi",
              page:"riwayat_konstruksi",
              routeName:"Riwayat Konstruksi",
              routeAction:"/mandor/konstruksi/riwayat",
              icon:"i-material-symbols-groups-3-outline-rounded",
              scope:"view_riwayat_konstruksi",
              child:[]
            },
          ]
        },
        {
          label:"Setting",
          menus:[
            {
              parent:null,
              id:1,
              label:"Profile",
              page:"profile",
              routeName:"Profile",
              routeAction:"/mandor/profile",
              icon:"i-material-symbols-garage-door-outline",
              scope:"view_profile",
              child:[]
            },
          ]
        }
      ] as IGroupSidebar[]
    }
  },
}
</script>

<style></style>