import { saveOfflineResource, type OfflineResource } from "./offline-db";

export async function downloadResource(
  idOrResource: string | { id: string; title: string; officialUrl?: string; fileUrl?: string; type?: string; provider?: string },
  title?: string,
  url?: string,
) {
  const id = typeof idOrResource === "string" ? idOrResource : idOrResource.id;
  const resourceTitle = typeof idOrResource === "string" ? title || "Document" : idOrResource.title;
  const targetUrl = typeof idOrResource === "string" ? url || "" : idOrResource.fileUrl || idOrResource.officialUrl || "";

  let blob: Blob;

  try {
    if (targetUrl.startsWith("http")) {
      const response = await fetch(targetUrl, { mode: "cors" });
      if (response.ok) {
        blob = await response.blob();
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } else {
      throw new Error("No URL provided");
    }
  } catch {
    // If CORS or offline prevents fetching the external URL, generate an offline study resource package
    const content = `# ${resourceTitle}\n\nThis resource has been saved in your EdSync offline cache.\n\nSource: ${targetUrl || "Official Syllabus Portal"}\nSaved on: ${new Date().toLocaleString()}\n\nUse EdSync AI Study Buddy or the Reader to annotate and study this topic offline.`;
    blob = new Blob([content], { type: "text/markdown" });
  }

  const resourceData: OfflineResource = {
    id,
    title: resourceTitle,
    officialUrl: targetUrl,
    fileUrl: targetUrl,
    blob,
    downloadedAt: new Date().toISOString(),
  };

  await saveOfflineResource(resourceData);
  return resourceData;
}
