// EdSync Offline Database (IndexedDB)
// Full offline-first storage for Resources, Notes, Study Items, and Voice Notes

const DB_NAME = "edsync-offline";
const DB_VERSION = 1;

const STORES = {
  resources: "resources",
  notes: "notes",
  listItems: "listItems",
  voiceNotes: "voiceNotes",
} as const;

export type OfflineResource = {
  id: string;
  title: string;
  description?: string | undefined;
  provider?: string | undefined;
  type?: string | undefined;
  officialUrl?: string | undefined;
  downloadUrl?: string | undefined;
  boards?: string[] | undefined;
  classes?: string[] | undefined;
  subjects?: string[] | undefined;
  subject?: string | undefined;
  fileUrl?: string | undefined;
  blob?: Blob | undefined;
  downloadedAt?: string | number | undefined;
};

export type OfflineNote = {
  id?: string | undefined;
  resourceId?: string | undefined;
  text: string;
  selectedText?: string | undefined;
  createdAt?: string | undefined;
};

export type OfflineListItem = {
  id?: string | undefined;
  resourceId?: string | undefined;
  text: string;
  title?: string | undefined;
  createdAt?: string | undefined;
};

export type OfflineVoiceNote = {
  id?: string | undefined;
  resourceId?: string | undefined;
  text?: string | undefined;
  audioBlob?: Blob | undefined;
  createdAt?: string | undefined;
};

function isBrowser() {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      reject(new Error("IndexedDB is only available in browser environments."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORES.resources)) {
        const store = db.createObjectStore(STORES.resources, { keyPath: "id" });
        store.createIndex("title", "title", { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.notes)) {
        const store = db.createObjectStore(STORES.notes, { keyPath: "id" });
        store.createIndex("resourceId", "resourceId", { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.listItems)) {
        const store = db.createObjectStore(STORES.listItems, { keyPath: "id" });
        store.createIndex("resourceId", "resourceId", { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.voiceNotes)) {
        const store = db.createObjectStore(STORES.voiceNotes, { keyPath: "id" });
        store.createIndex("resourceId", "resourceId", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Could not open offline database."));
  });
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/* =========================================================
   OFFLINE RESOURCES
   ========================================================= */

export async function saveOfflineResource(resource: OfflineResource): Promise<void> {
  if (!isBrowser()) return;
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.resources, "readwrite");
    const store = transaction.objectStore(STORES.resources);

    store.put({
      ...resource,
      downloadedAt: resource.downloadedAt ?? new Date().toISOString(),
    });

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? new Error("Could not save offline resource."));
    };
  });
}

export async function getOfflineResource(
  resourceId: string,
): Promise<OfflineResource | undefined> {
  if (!isBrowser()) return undefined;
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.resources, "readonly");
    const request = transaction.objectStore(STORES.resources).get(resourceId);

    request.onsuccess = () => {
      db.close();
      resolve(request.result as OfflineResource | undefined);
    };

    request.onerror = () => {
      db.close();
      reject(request.error ?? new Error("Could not read offline resource."));
    };
  });
}

export async function getAllOfflineResources(): Promise<OfflineResource[]> {
  if (!isBrowser()) return [];
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.resources, "readonly");
    const request = transaction.objectStore(STORES.resources).getAll();

    request.onsuccess = () => {
      db.close();
      resolve((request.result ?? []) as OfflineResource[]);
    };

    request.onerror = () => {
      db.close();
      reject(request.error ?? new Error("Could not read offline resources."));
    };
  });
}

export async function deleteOfflineResource(resourceId: string): Promise<void> {
  if (!isBrowser()) return;
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.resources, "readwrite");
    transaction.objectStore(STORES.resources).delete(resourceId);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? new Error("Could not delete offline resource."));
    };
  });
}

/* =========================================================
   NOTES
   ========================================================= */

export async function saveNote(
  note: OfflineNote | string,
  resourceId?: string,
): Promise<OfflineNote> {
  if (!isBrowser()) {
    return typeof note === "string" ? { text: note } : note;
  }

  const normalized: OfflineNote =
    typeof note === "string"
      ? {
          id: createId(),
          text: note,
          resourceId: resourceId ?? undefined,
          createdAt: new Date().toISOString(),
        }
      : {
          ...note,
          id: note.id ?? createId(),
          createdAt: note.createdAt ?? new Date().toISOString(),
        };

  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.notes, "readwrite");
    transaction.objectStore(STORES.notes).put(normalized);

    transaction.oncomplete = () => {
      db.close();
      resolve(normalized);
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? new Error("Could not save note."));
    };
  });
}

export async function getNotes(resourceId?: string): Promise<OfflineNote[]> {
  if (!isBrowser()) return [];
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.notes, "readonly");
    const store = transaction.objectStore(STORES.notes);
    const request = resourceId
      ? store.index("resourceId").getAll(resourceId)
      : store.getAll();

    request.onsuccess = () => {
      db.close();
      resolve((request.result ?? []) as OfflineNote[]);
    };

    request.onerror = () => {
      db.close();
      reject(request.error ?? new Error("Could not load notes."));
    };
  });
}

/* =========================================================
   LIST ITEMS
   ========================================================= */

export async function saveListItem(
  item: OfflineListItem | string,
  resourceId?: string,
): Promise<OfflineListItem> {
  if (!isBrowser()) {
    return typeof item === "string" ? { text: item } : item;
  }

  const normalized: OfflineListItem =
    typeof item === "string"
      ? {
          id: createId(),
          text: item,
          resourceId: resourceId ?? undefined,
          createdAt: new Date().toISOString(),
        }
      : {
          ...item,
          id: item.id ?? createId(),
          createdAt: item.createdAt ?? new Date().toISOString(),
        };

  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.listItems, "readwrite");
    transaction.objectStore(STORES.listItems).put(normalized);

    transaction.oncomplete = () => {
      db.close();
      resolve(normalized);
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? new Error("Could not save list item."));
    };
  });
}

export async function getListItems(resourceId?: string): Promise<OfflineListItem[]> {
  if (!isBrowser()) return [];
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.listItems, "readonly");
    const store = transaction.objectStore(STORES.listItems);
    const request = resourceId
      ? store.index("resourceId").getAll(resourceId)
      : store.getAll();

    request.onsuccess = () => {
      db.close();
      resolve((request.result ?? []) as OfflineListItem[]);
    };

    request.onerror = () => {
      db.close();
      reject(request.error ?? new Error("Could not load list items."));
    };
  });
}

/* =========================================================
   VOICE NOTES
   ========================================================= */

export async function saveVoiceNote(
  note: OfflineVoiceNote | Blob,
  resourceId?: string,
): Promise<OfflineVoiceNote> {
  if (!isBrowser()) {
    return note instanceof Blob ? { audioBlob: note } : note;
  }

  const normalized: OfflineVoiceNote =
    note instanceof Blob
      ? {
          id: createId(),
          audioBlob: note,
          resourceId: resourceId ?? undefined,
          createdAt: new Date().toISOString(),
        }
      : {
          ...note,
          id: note.id ?? createId(),
          createdAt: note.createdAt ?? new Date().toISOString(),
        };

  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.voiceNotes, "readwrite");
    transaction.objectStore(STORES.voiceNotes).put(normalized);

    transaction.oncomplete = () => {
      db.close();
      resolve(normalized);
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? new Error("Could not save voice note."));
    };
  });
}

export async function getVoiceNotes(resourceId?: string): Promise<OfflineVoiceNote[]> {
  if (!isBrowser()) return [];
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.voiceNotes, "readonly");
    const store = transaction.objectStore(STORES.voiceNotes);
    const request = resourceId
      ? store.index("resourceId").getAll(resourceId)
      : store.getAll();

    request.onsuccess = () => {
      db.close();
      resolve((request.result ?? []) as OfflineVoiceNote[]);
    };

    request.onerror = () => {
      db.close();
      reject(request.error ?? new Error("Could not load voice notes."));
    };
  });
}