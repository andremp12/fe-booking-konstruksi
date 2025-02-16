import {defineStore} from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        userData: null as any | null,
        token: null as any | null,
        authState: "unAuthenticated" as string,
        role: null as any | null,
    }),
    getters: {
        getUser(state){
            return state.userData;
        },
        getRole(state){
            return state.role;
        },
        getToken(state){
            if(!state.token){
                return useCookie('token').value
            }else {
                return state.token;
            }
        },
    },
    actions: {
        login(payload:any){
            console.log(payload);
            return new Promise(async (resolve, reject) => {
                await $api('/login',{
                    method:"POST",
                    body: payload
                }).then(async (result)=>{
                    console.log(result);
                    const responData:any = result
                    const token = responData.data.token;
                    this.token = token
                    this.role = responData.data.role
                    useCookie('token').value = token;
                    this.authState = 'authenticated';

                    resolve(responData);
                }).catch((err)=>{
                    console.log(err)
                    useCookie('token').value = null;
                    this.token = null;
                    this.role = null
                    this.authState = 'unAuthenticated';

                    reject(err);
                })
            })
        },
        validateToken(token:any){
            return new Promise(async (resolve, reject) => {
                await $api('/validate-token', {
                    onRequest(context:any):Promise<void>|void{
                        context.options.headers = {Authorization: `Bearer ${token}`};
                        context.options.method="POST"
                    }
                }).then(async (result:any)=>{
                    console.log(result);

                    const responData:any = result
                    this.userData = result.data;
                    this.role = responData.data.role
                    this.authState = 'authenticated';

                    resolve(responData);
                }).catch((err)=>{
                    console.log(err);
                    this.userData = null;
                    this.role = null
                    this.authState = 'unAuthenticated';

                    reject(err);
                })
            })
        }
    },
})