import { create } from 'zustand'

// 1. Create the store hook
export const useAPIKey = create(() => ({
  apiKey: "",
}))

export default useAPIKey;