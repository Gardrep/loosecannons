import { create } from 'zustand'

// 1. Create the store hook
export const useAPIKey: any = create((set: any, get: any): any => ({
  apiKey: "",
  setApiKey: (apiKey: string) => {
    set({ apiKey: apiKey })
    localStorage.setItem("apiKey", apiKey)
  },
  getApiKey: () => {
    const apiKey = get().apiKey;
    if(!!apiKey){
      return apiKey;
    }

    const localStorageApiKey =  localStorage.getItem("apiKey");
    if(!!localStorageApiKey){
      return localStorageApiKey;
    }

    return null;
  },
}))

export default useAPIKey;