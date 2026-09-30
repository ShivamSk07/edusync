import { openDB } from "idb";

export type OfflineResource = {
  id: string;
  title: string;
  url: string;
  blob: Blob;
  downloadedAt: number;
};

const dbPromise = openDB("edsync-offline", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("resources")) {
      db.createObjectStore("resources", {
        keyPath: "id",
      });
    }
  },
});

export async function saveOfflineResource(
  resource: OfflineResource,
) {
  const db = await dbPromise;

  await db.put("resources", resource);
}

export async function getOfflineResource(
  id: string,
) {
  const db = await dbPromise;

  return db.get("resources", id);
}

export async function getAllOfflineResources() {
  const db = await dbPromise;

  return db.getAll("resources");
}

export async function deleteOfflineResource(
  id: string,
) {
  const db = await dbPromise;

  await db.delete("resources", id);
}