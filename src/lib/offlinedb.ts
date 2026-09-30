// src/lib/offline-db.ts

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
  description?: string;
  provider?: string;
  type?: string;
  officialUrl?: string;
  downloadUrl?: string;
  boards?: string[];
  classes?: string[];
  subjects?: string[];
  subject?: string;
  fileUrl?: string;
  blob?: Blob;
  downloadedAt?: string;
};

export type OfflineNote = {
  id?: string;
  resourceId?: string;
  text: string;
  selectedText?: string;
  createdAt?: string;
};

export type OfflineListItem = {
  id?: string;
  resourceId?: string;
  text: string;
  title?: string;
  createdAt?: string;
};

export type OfflineVoiceNote = {
  id?: string;
  resourceId?: string;
  text?: string;
  audioBlob?: Blob;
  createdAt?: string;
};

function isBrowser() {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      reject(new Error("IndexedDB is only available in the browser."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORES.resources)) {
        const store = db.createObjectStore(STORES.resources, {
          keyPath: "id",
        });

        store.createIndex("title", "title", { unique: false });
        store.createIndex("resourceId", "id", { unique: true });
      }

      if (!db.objectStoreNames.contains(STORES.notes)) {
        const store = db.createObjectStore(STORES.notes, {
          keyPath: "id",
        });

        store.createIndex("resourceId", "resourceId", {
          unique: false,
        });
      }

      if (!db.objectStoreNames.contains(STORES.listItems)) {
        const store = db.createObjectStore(STORES.listItems, {
          keyPath: "id",
        });

        store.createIndex("resourceId", "resourceId", {
          unique: false,
        });
      }

      if (!db.objectStoreNames.contains(STORES.voiceNotes)) {
        const store = db.createObjectStore(STORES.voiceNotes, {
          keyPath: "id",
        });

        store.createIndex("resourceId", "resourceId", {
          unique: false,
        });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(
        request.error ??
          new Error("Could not open offline database."),
      );
    };
  });
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/* =========================================================
   OFFLINE RESOURCES
   ========================================================= */

export async function saveOfflineResource(
  resource: OfflineResource,
): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORES.resources,
      "readwrite",
    );

    const store = transaction.objectStore(STORES.resources);

    store.put({
      ...resource,
      downloadedAt:
        resource.downloadedAt ?? new Date().toISOString(),
    });

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(
        transaction.error ??
          new Error("Could not save offline resource."),
      );
    };
  });
}

export async function getOfflineResource(
  resourceId: string,
): Promise<OfflineResource | undefined> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORES.resources,
      "readonly",
    );

    const request = transaction
      .objectStore(STORES.resources)
      .get(resourceId);

    request.onsuccess = () => {
      db.close();
      resolve(request.result as OfflineResource | undefined);
    };

    request.onerror = () => {
      db.close();
      reject(
        request.error ??
          new Error("Could not read offline resource."),
      );
    };
  });
}

export async function getAllOfflineResources(): Promise<
  OfflineResource[]
> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORES.resources,
      "readonly",
    );

    const request = transaction
      .objectStore(STORES.resources)
      .getAll();

    request.onsuccess = () => {
      db.close();
      resolve((request.result ?? []) as OfflineResource[]);
    };

    request.onerror = () => {
      db.close();
      reject(
        request.error ??
          new Error("Could not read offline resources."),
      );
    };
  });
}

export async function deleteOfflineResource(
  resourceId: string,
): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORES.resources,
      "readwrite",
    );

    transaction.objectStore(STORES.resources).delete(resourceId);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(
        transaction.error ??
          new Error("Could not delete offline resource."),
      );
    };
  });
}

/* =========================================================
   NOTES
   ========================================================= */

export async function saveNote(
  note: OfflineNote | string,
  ...legacyArgs: unknown[]
): Promise<OfflineNote> {
  const normalized: OfflineNote =
    typeof note === "string"
      ? {
          id: createId(),
          text: note,
          createdAt: new Date().toISOString(),
          ...(typeof legacyArgs[0] === "string"
            ? { resourceId: legacyArgs[0] }
            : {}),
        }
      : {
          ...note,
          id: note.id ?? createId(),
          createdAt:
            note.createdAt ?? new Date().toISOString(),
        };

  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORES.notes,
      "readwrite",
    );

    transaction.objectStore(STORES.notes).put(normalized);

    transaction.oncomplete = () => {
      db.close();
      resolve(normalized);
    };

    transaction.onerror = () => {
      db.close();
      reject(
        transaction.error ??
          new Error("Could not save note."),
      );
    };
  });
}

export async function getNotes(
  resourceId?: string,
): Promise<OfflineNote[]> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORES.notes,
      "readonly",
    );

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
      reject(
        request.error ??
          new Error("Could not load notes."),
      );
    };
  });
}

/* =========================================================
   LIST ITEMS
   ========================================================= */

export async function saveListItem(
  item: OfflineListItem | string,
  ...legacyArgs: unknown[]
): Promise<OfflineListItem> {
  const normalized: OfflineListItem =
    typeof item === "string"
      ? {
          id: createId(),
          text: item,
          createdAt: new Date().toISOString(),
          ...(typeof legacyArgs[0] === "string"
            ? { resourceId: legacyArgs[0] }
            : {}),
        }
      : {
          ...item,
          id: item.id ?? createId(),
          createdAt:
            item.createdAt ?? new Date().toISOString(),
        };

  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORES.listItems,
      "readwrite",
    );

    transaction
      .objectStore(STORES.listItems)
      .put(normalized);

    transaction.oncomplete = () => {
      db.close();
      resolve(normalized);
    };

    transaction.onerror = () => {
      db.close();
      reject(
        transaction.error ??
          new Error("Could not save list item."),
      );
    };
  });
}

export async function getListItems(
  resourceId?: string,
): Promise<OfflineListItem[]> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORES.listItems,
      "readonly",
    );

    const store = transaction.objectStore(
      STORES.listItems,
    );

    const request = resourceId
      ? store.index("resourceId").getAll(resourceId)
      : store.getAll();

    request.onsuccess = () => {
      db.close();
      resolve(
        (request.result ?? []) as OfflineListItem[],
      );
    };

    request.onerror = () => {
      db.close();
      reject(
        request.error ??
          new Error("Could not load list items."),
      );
    };
  });
}

/* =========================================================
   VOICE NOTES
   ========================================================= */

export async function saveVoiceNote(
  note: OfflineVoiceNote | Blob,
  ...legacyArgs: unknown[]
): Promise<OfflineVoiceNote> {
  const normalized: OfflineVoiceNote =
    note instanceof Blob
      ? {
          id: createId(),
          audioBlob: note,
          createdAt: new Date().toISOString(),
          ...(typeof legacyArgs[0] === "string"
            ? { resourceId: legacyArgs[0] }
            : {}),
        }
      : {
          ...note,
          id: note.id ?? createId(),
          createdAt:
            note.createdAt ?? new Date().toISOString(),
        };

  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORES.voiceNotes,
      "readwrite",
    );

    transaction
      .objectStore(STORES.voiceNotes)
      .put(normalized);

    transaction.oncomplete = () => {
      db.close();
      resolve(normalized);
    };

    transaction.onerror = () => {
      db.close();
      reject(
        transaction.error ??
          new Error("Could not save voice note."),
      );
    };
  });
}

export async function getVoiceNotes(
  resourceId?: string,
): Promise<OfflineVoiceNote[]> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORES.voiceNotes,
      "readonly",
    );

    const store = transaction.objectStore(
      STORES.voiceNotes,
    );

    const request = resourceId
      ? store.index("resourceId").getAll(resourceId)
      : store.getAll();

    request.onsuccess = () => {
      db.close();
      resolve(
        (request.result ?? []) as OfflineVoiceNote[],
      );
    };

    request.onerror = () => {
      db.close();
      reject(
        request.error ??
          new Error("Could not load voice notes."),
      );
    };
  });
}