import { jsonStore } from "./json-store";
import { pgStore } from "./pg-store";
import type { Store } from "./types";

let store: Store | null = null;

export function getStore(): Store {
  if (!store) {
    store = process.env.DATABASE_URL ? pgStore : jsonStore;
  }
  return store;
}

export const storeDriver = () => (process.env.DATABASE_URL ? "postgresql" : "local-file");
