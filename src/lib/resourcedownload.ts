import {
  saveOfflineResource,
  getOfflineResource,
  deleteOfflineResource,
} from "./offline-db";

export async function downloadResource(resource: {
  id: string;
  title: string;
  subject?: string;
  classLevel?: string;
  board?: string;
  provider?: string;
  officialUrl: string;
}): Promise<void> {
  if (!navigator.onLine) {
    throw new Error("You are offline. Connect to the internet to download this resource.");
  }

  const response = await fetch(resource.officialUrl);

  if (!response.ok) {
    throw new Error("Unable to download this resource.");
  }

  const blob = await response.blob();

  await saveOfflineResource({
    id: resource.id,
    title: resource.title,
    subject: resource.subject,
    classLevel: resource.classLevel,
    board: resource.board,
    provider: resource.provider,
    url: resource.officialUrl,
    blob,
    downloadedAt: Date.now(),
  });
}

export async function isResourceDownloaded(
  id: string,
): Promise<boolean> {
  const resource = await getOfflineResource(id);
  return Boolean(resource);
}

export async function removeDownloadedResource(
  id: string,
): Promise<void> {
  await deleteOfflineResource(id);
}