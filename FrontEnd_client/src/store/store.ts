import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import createSelectors from "./selector";
import { create, StateCreator } from "zustand";

type AuthState = {
    accessToken: string | null;
    user: null,
    setAccessToken: (token: string)=> void;
    clearAccessToeken: () =>void;
}

const createAuthSlice: StateCreator<AuthState> = (set) => ({
    accessToken:null,
    user:null,

    setAccessToken: (token) => set({accessToken: token}),
    clearAccessToeken: () => set({accessToken: null}),

});

type StoreType = AuthState;


export const useStoreBase = create<StoreType>()(
    devtools(
      persist(
        subscribeWithSelector(
          immer((...a) => ({
            ...createAuthSlice(...a),
          }))
        ),
        {
          name: "session-storage", // Name of the item in localStorage (or sessionStorage)
          storage: {
            getItem: (name) => {
              const str = sessionStorage.getItem(name);
              return str ? JSON.parse(str) : null;
            },
            setItem: (name, value) => {
              sessionStorage.setItem(name, JSON.stringify(value));
            },
            removeItem: (name) => {
              sessionStorage.removeItem(name);
            },
          },
        }
      )
    )
  );