import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface OrganizationStore {}

const useOrganizationStore = create<OrganizationStore>()(
  persist((set) => ({}), {
    name: "organization",
    storage: createJSONStorage(() => localStorage),
  })
);

export default useOrganizationStore;
