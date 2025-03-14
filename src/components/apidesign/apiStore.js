import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useApiStore = create((set) => ({
  apiInfo: { title: '', version: '1.0.0', description: '' },
  setApiInfo: (updatedInfo) => set((state) => ({ apiInfo: { ...state.apiInfo, ...updatedInfo } })),
  endpoints: [],
  addEndpoint: (endpoint) => set((state) => ({
    endpoints: [...state.endpoints, endpoint],
  })),
  policies: {
    rateLimit: { calls: 10, renewalPeriod: 60 },
    cors: { allowedOrigins: ['*'], allowedMethods: ['GET', 'POST'], allowedHeaders: ['*'] },
    authentication: { jwtEnabled: false, apiKeyRequired: false, ipWhitelist: [] }
  },
  setPolicies: (updatedPolicies) => set({ policies: updatedPolicies }),
}));


export default useApiStore;