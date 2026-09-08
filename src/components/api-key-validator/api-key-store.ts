import { create } from 'zustand'

// 1. Create the store hook
export const useAPIKey = create((set: any) => ({
  apiKey: "",
}))

export default useAPIKey;