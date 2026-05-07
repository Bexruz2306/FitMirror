import { create } from "zustand";
import Cookies from "js-cookie";


export const useStore=create((set)=>({
    theme: 'dark',
    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    resultImg:null,
    originalImg:null,
    clotehsImg:null,
    imageId:null,
    setImges:(res,org,cloth,imageId)=>set({
       
        resultImg:res,
        originalImg:org,
        clotehsImg:cloth, 
        imageId:imageId,

    }),
    resetImg:()=>set({
         resultImg:null,
    originalImg:null,
    clotehsImg:null ,
    imageId:null,


    }),
    token: Cookies.get("fitmirror_token") || null,
setToken: (t) => set({ token: t }),
    user:{
            email: null,
            fullName: null      
    },
    setUser:(Email,fullname)=>{
      const userObject = { email: Email, fullName: fullname };
      localStorage.setItem('fitmirror_user', JSON.stringify(userObject));
      return set({
        user: userObject
      });
    },
    clearUser:()=>{
      localStorage.removeItem('fitmirror_user');
      return set({
        user:{
          email: null,
          fullName: null      
        }
      });
    },
    loadUserFromStorage: () => {
      const stored = localStorage.getItem('fitmirror_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.email) {
            set({
              user: {
                email: parsed.email,
                fullName: parsed.fullName,
              }
            });
          }
        } catch (error) {
          console.error('Failed to parse stored user', error);
          localStorage.removeItem('fitmirror_user');
        }
      }
    },
    userme:null,
    setUserMe:(UserData)=>set({
      userme:UserData
    }),
     userimg:[],
    setUserimg:(UserData)=>set({
      userimg:[...UserData ]
    }),
    clearUserMe:()=>set({
      userme:null
    }),
    UpdateLimit:(newLimits)=>(set((state)=>({
      userme:state.userme?{...state.userme,...newLimits}:newLimits 
    })))

}))  