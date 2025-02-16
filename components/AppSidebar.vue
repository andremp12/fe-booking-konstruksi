<template>
  <div class="w-1/2 md:w-1/3 lg:w-64 fixed md:top-0 md:left-0 h-screen lg:block bg-gray-100 border-r z-30"
     id="main-nav">

    <div class="w-full h-20 border-b flex px-4 items-center mb-8">
      <p class="font-semibold text-3xl text-blue-400 pl-4">LOGO</p>
    </div>

    <div v-for="(group,index) in groups" :key="index" class="mb-4 px-4">
      <p class="pl-4 text-sm font-semibold mb-1">{{group.label}}</p>
      <NuxtLink v-for="menu in group.menus" :key="menu.id" :to="menu.routeAction" :class="{'bg-gray-200':$route.meta.pageMenu === menu.page}"
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
              label:"Dashboard",
              page:"dashboard",
              routeName:"Dashboard",
              routeAction:"/admin/dashboard",
              icon:"i-material-symbols-dashboard-2-outline",
              scope:"view_dashboard",
              child:[]
            },
            {
              parent:null,
              id:2,
              label:"Konstruksi",
              page:"konstruksi",
              routeName:"konstruksi",
              routeAction:"/admin/konstruksi",
              icon:"i-tdesign-building-5",
              scope:"view_konstruksi",
              child:[]
            }
          ]
        },
        {
          label:"Users",
          menus:[
            {
              parent:null,
              id:1,
              label:"Client",
              page:"pelanggan",
              routeName:"Pelanggan",
              routeAction:"/admin/client",
              icon:"i-material-symbols-groups-3-outline-rounded",
              scope:"view_pelanggan",
              child:[]
            },
            {
              parent:null,
              id:2,
              label:"Mandor",
              page:"mandor",
              routeName:"Mandor",
              routeAction:"/admin/mandor",
              icon:"i-material-symbols-person-apron-outline",
              scope:"view_mandor",
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
              label:"Tipe Konstruksi",
              page:"tipe_konstruksi",
              routeName:"Tipe Konstruksi",
              routeAction:"/admin/tipe-konstruksi",
              icon:"i-material-symbols-garage-door-outline",
              scope:"view_tipe_konstruksi",
              child:[]
            },
            {
              parent:null,
              id:2,
              label:"Satuan",
              page:"satuan",
              routeName:"Satuan",
              routeAction:"/admin/satuan",
              icon:"i-material-symbols-mitre-outline",
              scope:"view_satuan",
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