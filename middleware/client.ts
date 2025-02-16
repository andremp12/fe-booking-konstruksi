import {storeToRefs} from "pinia";
import {useAuthStore} from "~/stores/authStore";
import router from "#app/plugins/router";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const {authState,getToken} = storeToRefs(useAuthStore())

    if(getToken.value) {
        if(authState.value !== 'authenticated') {
            await useAuthStore().validateToken(getToken.value).then(() => {
                authState.value = 'authenticated';
            }).catch(async (err) => {
                console.log(err);

                authState.value = 'unAuthenticated';
            })
        }

        if(authState.value == 'authenticated') {
            const arrayToken = getToken.value.split('.');
            const tokenPayload = JSON.parse(atob(arrayToken[1]));
        }
    }

    if(authState.value === 'authenticated' ) {
        if(to.path === '/login'){
            return navigateTo('/client')
        }
    }

    if(authState.value !== 'authenticated' ) {
        if (to.path !== '/login'){
            abortNavigation()
            return navigateTo('/login')
        }
    }
})