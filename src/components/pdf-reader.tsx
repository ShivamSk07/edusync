import {
  Document,
  Page,
  pdfjs,
} from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getOfflineResource,
  saveNote,
  saveListItem,
  saveVoiceNote,
} from "@/lib/offlinedb";

import {
  Bot,
  ListPlus,
  Mic,
  MicOff,
  StickyNote,
  X,
} from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type Props = {
  resourceId: string;
  onClose: () => void;
};

export function PdfReader({
  resourceId,
  onClose,
}: Props) {
  const [fileUrl, setFileUrl] =
    useState<string | null>(null);

  const [numPages, setNumPages] =
    useState<number>(0);

  const [selectedText, setSelectedText] =
    useState("");

  const [selectedPage, setSelectedPage] =
    useState<number>();

  const [showActions, setShowActions] =
    useState(false);

  const [recording, setRecording] =
    useState(false);

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const audioChunksRef =
    useRef<Blob[]>([]);

  /*
   * Load the downloaded PDF from IndexedDB.
   */
  useEffect(() => {
    let url: string | null = null;

    async function load() {
      try {
        const resource =
          await getOfflineResource(resourceId);

        if (!resource?.blob) {
          return;
        }

        url = URL.createObjectURL(
          resource.blob,
        );

        setFileUrl(url);
      } catch (error) {
        console.error(
          "Could not load offline resource:",
          error,
        );
      }
    }

    void load();

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [resourceId]);

  /*
   * Detect selected text inside the PDF.
   */
  useEffect(() => {
    function handleSelection() {
      const selection =
        window.getSelection();

      const text =
        selection?.toString().trim() ?? "";

      if (text) {
        setSelectedText(text);
        setShowActions(true);
      }
    }

    document.addEventListener(
      "selectionchange",
      handleSelection,
    );

    return () => {
      document.removeEventListener(
        "selectionchange",
        handleSelection,
      );
    };
  }, []);

  /*
   * Send selected text to the EdSync AI event.
   */
  const askAI = () => {
    if (!selectedText) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent("edsync:ask-ai", {
        detail: {
          text: selectedText,
          encoded:
            encodeURIComponent(
              selectedText,
            ),
        },
      }),
    );
  };

  /*
   * Save selected text as an offline note.
   */
  const saveSelectedNote =
    async () => {
      if (!selectedText) {
        return;
      }

      await saveNote({
        id: crypto.randomUUID(),
        resourceId,
        text: selectedText,
        selectedText,
        createdAt:
          new Date().toISOString(),
      });

      setShowActions(false);
    };

  /*
   * Save selected text to the student's list.
   */
  const saveToList =
    async () => {
      if (!selectedText) {
        return;
      }

      await saveListItem({
        id: crypto.randomUUID(),
        resourceId,
        text: selectedText,
        title: "Important",
        createdAt:
          new Date().toISOString(),
      });

      setShowActions(false);
    };

  /*
   * Start voice-note recording.
   */
  const startVoiceNote =
    async () => {
      if (
        !navigator.mediaDevices?.getUserMedia
      ) {
        alert(
          "Voice recording is not supported by this browser.",
        );
        return;
      }

      try {
        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true,
            },
          );

        const recorder =
          new MediaRecorder(stream);

        audioChunksRef.current = [];

        recorder.ondataavailable =
          (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(
                event.data,
              );
            }
          };

        recorder.onstop =
          async () => {
            const audioBlob =
              new Blob(
                audioChunksRef.current,
                {
                  type:
                    recorder.mimeType ||
                    "audio/webm",
                },
              );

            try {
              await saveVoiceNote({
                id: crypto.randomUUID(),
                resourceId,
                audioBlob,
                createdAt:
                  new Date().toISOString(),
              });
            } catch (error) {
              console.error(
                "Could not save voice note:",
                error,
              );
            }

            stream
              .getTracks()
              .forEach((track) => {
                track.stop();
              });

            audioChunksRef.current = [];
            mediaRecorderRef.current = null;
            setRecording(false);
          };

        mediaRecorderRef.current =
          recorder;

        recorder.start();
        setRecording(true);
      } catch (error) {
        console.error(
          "Could not start voice recording:",
          error,
        );

        alert(
          "Microphone access was not available.",
        );
      }
    };

  /*
   * Stop voice-note recording.
   */
  const stopVoiceNote =
    () => {
      mediaRecorderRef.current?.stop();
    };

  /*
   * Clean up recorder if the reader closes
   * while recording.
   */
  useEffect(() => {
    return () => {
      const recorder =
        mediaRecorderRef.current;

      if (
        recorder &&
        recorder.state !== "inactive"
      ) {
        recorder.stop();
      }
    };
  }, []);

  if (!fileUrl) {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-background">
        <p className="text-sm text-muted-foreground">
          Loading offline resource...
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <header className="flex items-center justify-between border-b bg-card px-4 py-3">
        <div>
          <h2 className="font-semibold">
            EdSync Reader
          </h2>

          <p className="text-xs text-muted-foreground">
            Offline resource
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border p-2"
          aria-label="Close PDF reader"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="flex-1 overflow-auto bg-muted/30 p-4">
        <div className="mx-auto w-fit rounded-xl bg-white shadow-lg">
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
            }}
            loading={
              <div className="p-8">
                Loading PDF...
              </div>
            }
            error={
              <div className="p-8 text-sm text-destructive">
                This PDF could not be opened.
              </div>
            }
          >
            {Array.from(
              { length: numPages },
              (_, index) => (
                <div
                  key={index}
                  className="mb-4"
                  onMouseUp={() =>
                    setSelectedPage(
                      index + 1,
                    )
                  }
                >
                  <Page
                    pageNumber={index + 1}
                    width={850}
                    renderTextLayer
                    renderAnnotationLayer
                  />
                </div>
              ),
            )}
          </Document>
        </div>
      </div>

      {showActions &&
        selectedText && (
          <div className="border-t bg-card p-3 shadow-xl">
            <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-2">
              <span className="mr-auto text-xs text-muted-foreground">
                Text selected
                {selectedPage
                  ? ` • Page ${selectedPage}`
                  : ""}
              </span>

              <button
                type="button"
                onClick={askAI}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
              >
                <Bot className="h-4 w-4" />
                Ask AI
              </button>

              <button
                type="button"
                onClick={
                  saveSelectedNote
                }
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
              >
                <StickyNote className="h-4 w-4" />
                Notes
              </button>

              <button
                type="button"
                onClick={saveToList}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
              >
                <ListPlus className="h-4 w-4" />
                Add to List
              </button>

              <button
                type="button"
                onClick={
                  recording
                    ? stopVoiceNote
                    : startVoiceNote
                }
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
              >
                {recording ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}

                {recording
                  ? "Stop"
                  : "Voice Note"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowActions(false)
                }
                className="rounded-lg border p-2"
                aria-label="Close selection actions"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
    </div>
  );
}