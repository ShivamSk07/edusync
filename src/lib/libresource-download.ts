import { saveOfflineResource } from "@/lib/offline-db";

export async function downloadResource(
  id: string,
  title: string,
  url: string,
) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Download failed: ${response.status}`);
  }

  const blob = await response.blob();

  await saveOfflineResource({
    id,
    title,
    url,
    blob,
    downloadedAt: Date.now(),
  });
}