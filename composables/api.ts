import {useAuthStore} from "~/stores/authStore";

export function $api<T>(
  request: Parameters<typeof $fetch<T>>[0],
  opts?: Parameters<typeof $fetch<T>>[1],
){
  const authState = useAuthStore().authState
  const config = useRuntimeConfig()
  return $fetch<T>(request,{baseURL:config.public.apiUrl,
    ...opts,
    headers:{
    Authorization: authState=='authenticated' ? `Bearer ${useCookie('token').value}` : '',
    ...opts?.headers
    }
  })
}
