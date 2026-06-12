import axios from "axios";
import { useState, useRef, useCallback, useEffect } from "react";

// ─── config ───────────────────────────────────────────────────────────────────

const BASE_URL = "https://elementsoneastcoast.com";

// ─── icons ────────────────────────────────────────────────────────────────────

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const ReplaceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);
const WarnIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
  </svg>
);
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5.14v14l11-7-11-7z" />
  </svg>
);
const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);
const ImagePlaceholderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
    <circle cx="8.5" cy="8.5" r="1.5" />
  </svg>
);
const SpinnerIcon = ({ className = "w-4 h-4" }) => (
  <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

// ─── helpers ──────────────────────────────────────────────────────────────────

const isVideo = (name = "") => /\.(mp4|webm|ogg|mov)$/i.test(name);

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// ─── shared primitives ────────────────────────────────────────────────────────

function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700 ${className}`} />;
}

function EmptySlot() {
  return (
    <div className="w-full aspect-video rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center gap-1.5">
      <ImagePlaceholderIcon />
      <span className="text-xs text-gray-400 dark:text-gray-600">Nothing uploaded yet</span>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div role="alert" className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium
      ${toast.type === "success"
        ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
        : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"}`}>
      {toast.type === "success" ? <CheckIcon /> : <WarnIcon />}
      {toast.msg}
    </div>
  );
}

// ─── confirm dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({ item, onConfirm, onCancel }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl p-5 space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Delete file?</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-700 dark:text-gray-300">{item.name}</span> will be permanently removed from the server.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 active:scale-[0.98] transition-all">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── replace modal ────────────────────────────────────────────────────────────

function ReplaceModal({ item, sectionType, onReplaced, onCancel }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }, []);

  const handleReplace = async () => {
    if (!file || uploading) return;
    setUploading(true); setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", sectionType);
      formData.append("replaceId", item.id);
      formData.append("replaceName", item.name);
      await axios.post("/api/media/replace", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onReplaced(); // signal parent to re-fetch
    } catch {
      setError("Replace failed. Please try again.");
      setUploading(false);
    }
  };

  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Replace file</h4>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate max-w-[220px]">{item.name}</p>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <CloseIcon />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {/* current preview */}
          <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
            {isVideo(item.name)
              ? <video src={item.url} className="w-full h-full object-cover" preload="metadata" onLoadedMetadata={e => { e.target.currentTime = 0.5; }} />
              : <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
            }
            <span className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] text-white font-medium uppercase tracking-wide">Current</span>
          </div>
          {/* drop zone */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 cursor-pointer text-center transition-colors duration-150 select-none
              ${dragOver ? "border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-950/40" : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/50"}`}
          >
            <input ref={inputRef} type="file" className="hidden" onChange={e => setFile(e.target.files[0])} />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-700 dark:ring-gray-600 text-gray-400">
              <UploadIcon />
            </div>
            {file
              ? <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{file.name}</p>
              : <p className="text-sm text-gray-500 dark:text-gray-400">Drop new file or <span className="font-medium text-blue-600 dark:text-blue-400">browse</span></p>
            }
          </div>
          {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
          <div className="flex gap-2">
            <button onClick={onCancel} disabled={uploading}
              className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button onClick={handleReplace} disabled={!file || uploading}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all
                ${!file || uploading ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600" : "bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.98] dark:bg-white dark:text-gray-900"}`}>
              {uploading ? <SpinnerIcon /> : <ReplaceIcon />}
              {uploading ? "Replacing…" : "Replace"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── item action buttons ──────────────────────────────────────────────────────

function ItemActions({ onDelete, onReplace, deleting }) {
  return (
    <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
      <button onClick={e => { e.stopPropagation(); onReplace(); }} title="Replace"
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-sm border border-white/20 hover:bg-blue-600 transition-colors">
        <ReplaceIcon />
      </button>
      <button onClick={e => { e.stopPropagation(); onDelete(); }} title="Delete" disabled={deleting}
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-sm border border-white/20 hover:bg-red-600 transition-colors disabled:opacity-50">
        {deleting ? <SpinnerIcon className="w-3.5 h-3.5" /> : <TrashIcon />}
      </button>
    </div>
  );
}

// ─── drop zone ────────────────────────────────────────────────────────────────

function DropZone({ onFile, file, onClear, inputRef }) {
  const [dragOver, setDragOver] = useState(false);
  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  }, [onFile]);

  return (
    <div className="space-y-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 cursor-pointer text-center transition-colors duration-150 select-none
          ${dragOver ? "border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-950/40" : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600"}`}
      >
        <input ref={inputRef} type="file" className="hidden" onChange={e => onFile(e.target.files[0])} />
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-700 dark:ring-gray-600 text-gray-400">
          <UploadIcon />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Drop here or <span className="font-medium text-blue-600 dark:text-blue-400">browse</span></p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Images & videos supported</p>
        </div>
      </div>
      {file && (
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
          <span className="flex-1 truncate text-xs text-gray-600 dark:text-gray-300">{file.name}</span>
          <span className="shrink-0 text-xs text-gray-400">{formatSize(file.size)}</span>
          <button onClick={onClear} className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" aria-label="Remove">
            <CloseIcon />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── banner preview ───────────────────────────────────────────────────────────

function BannerPreview({ images, loading, onDelete, onReplace, deletingId }) {
  const [active, setActive] = useState(0);

  if (loading) return (
    <div className="space-y-2">
      <Skeleton className="w-full aspect-video" />
      <div className="grid grid-cols-4 gap-1.5">
        {[0, 1, 2, 3].map(i => <Skeleton key={i} className="aspect-square rounded-lg" />)}
      </div>
    </div>
  );
  if (!images?.length) return <EmptySlot />;

  const safeActive = Math.min(active, images.length - 1);
  const current = images[safeActive];

  return (
    <div className="space-y-2">
      <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 group">
        <img key={current.id} src={current.url} alt={current.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
          <span className="text-white text-xs font-medium truncate">{current.name}</span>
        </div>
        <span className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white tabular-nums">
          {safeActive + 1} / {images.length}
        </span>
        <ItemActions
          onDelete={() => onDelete(current)}
          onReplace={() => onReplace(current)}
          deleting={deletingId === current.id}
        />
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {images.map((img, i) => (
          <button key={img.id} onClick={() => setActive(i)}
            className={`relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 transition-all duration-150 group
              ${i === safeActive ? "ring-2 ring-gray-900 dark:ring-white ring-offset-1" : "opacity-55 hover:opacity-100"}`}>
            <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── gallery preview ──────────────────────────────────────────────────────────

function GalleryPreview({ images, loading, onDelete, onReplace, deletingId }) {
  const [playingId, setPlayingId] = useState(null);
  const videoRefs = useRef({});

  if (loading) return (
    <div className="grid grid-cols-3 gap-2">
      {[0, 1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="aspect-square rounded-lg" />)}
    </div>
  );
  if (!images?.length) return <EmptySlot />;

  const togglePlay = (id) => {
    const el = videoRefs.current[id];
    if (!el) return;
    if (playingId === id) { el.pause(); setPlayingId(null); }
    else { Object.values(videoRefs.current).forEach(v => v?.pause()); el.play(); setPlayingId(id); }
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {images.map((item) => {
        const vid = isVideo(item.name);
        return (
          <div key={item.id} onClick={vid ? () => togglePlay(item.id) : undefined}
            className={`relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 group ${vid ? "cursor-pointer" : ""}`}>
            {vid ? (
              <>
                <video ref={el => { videoRefs.current[item.id] = el; }} src={item.url}
                  className="w-full h-full object-cover" preload="metadata"
                  onEnded={() => setPlayingId(null)}
                  onLoadedMetadata={e => { e.target.currentTime = 0.5; }} />
                <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-150
                  ${playingId === item.id ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 border border-white/25 text-white group-hover:scale-110 transition-transform duration-150">
                    {playingId === item.id ? <PauseIcon /> : <PlayIcon />}
                  </div>
                </div>
                <span className="absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white font-medium">VIDEO</span>
              </>
            ) : (
              <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
              <p className="text-white text-[10px] font-medium truncate">{item.name}</p>
            </div>
            <ItemActions
              onDelete={() => onDelete(item)}
              onReplace={() => onReplace(item)}
              deleting={deletingId === item.id}
            />
          </div>
        );
      })}
    </div>
  );
}



// ─── section config ───────────────────────────────────────────────────────────

const SECTIONS = [
  { type: "banner",  label: "Banner",  description: "Hero images displayed at the top of your page.", PreviewComponent: BannerPreview },
  { type: "gallery", label: "Gallery", description: "Images and videos from the gallery folder.", PreviewComponent: GalleryPreview },
];

// ─── section row ──────────────────────────────────────────────────────────────

function SectionRow({ section }) {
  const { type, label, description, PreviewComponent } = section;

  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [file, setFile]             = useState(null);
  const [uploading, setUploading]   = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmItem, setConfirmItem] = useState(null);
  const [replaceItem, setReplaceItem] = useState(null);
  const [toast, setToast]           = useState(null);
  const inputRef   = useRef(null);
  const toastTimer = useRef(null);

  const showToast = (msg, kind) => {
    setToast({ msg, type: kind });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  // ── fetch files from backend ──────────────────────────────────────────────
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/media/list?type=${type}`);
      setItems(res.data.files ?? []);
    } catch {
      showToast("Failed to load files.", "error");
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // ── delete ────────────────────────────────────────────────────────────────
  const handleDeleteConfirmed = async () => {
    const item = confirmItem;
    setConfirmItem(null);
    setDeletingId(item.id);
    try {
      await axios.delete("/api/media/delete", { data: { id: item.id, name: item.name, type } });
      await fetchItems(); // re-fetch from server
      showToast(`"${item.name}" deleted.`, "success");
    } catch {
      showToast("Delete failed. Please try again.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // ── replace ───────────────────────────────────────────────────────────────
  const handleReplaced = async () => {
    setReplaceItem(null);
    await fetchItems(); // re-fetch from server
    showToast("File replaced successfully.", "success");
  };

  // ── upload ────────────────────────────────────────────────────────────────
  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file || uploading) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      await axios.post("/api/media/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      await fetchItems(); // re-fetch from server
      clearFile();
      showToast(`"${file.name}" uploaded successfully.`, "success");
    } catch {
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <ConfirmDialog item={confirmItem} onConfirm={handleDeleteConfirmed} onCancel={() => setConfirmItem(null)} />
      <ReplaceModal item={replaceItem} sectionType={type} onReplaced={handleReplaced} onCancel={() => setReplaceItem(null)} />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
        {/* info bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500">{description}</p>
          <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
            {loading ? "Loading…" : `${items.length} file${items.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-gray-800">
          {/* left – current files */}
          <div className="p-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Current</p>
            <PreviewComponent
              images={items}
              loading={loading}
              onDelete={setConfirmItem}
              onReplace={setReplaceItem}
              deletingId={deletingId}
            />
          </div>

          {/* right – upload new */}
          <div className="p-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Add new</p>
            <DropZone onFile={setFile} file={file} onClear={clearFile} inputRef={inputRef} />
            <button onClick={handleUpload} disabled={!file || uploading}
              className={`flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150
                ${!file || uploading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                  : "bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.98] dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"}`}>
              {uploading ? <SpinnerIcon /> : <UploadIcon />}
              {uploading ? "Uploading…" : `Add to ${label}`}
            </button>
            <Toast toast={toast} />
          </div>
        </div>
      </div>
    </>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function MediaUpload() {
  const [activeTab, setActiveTab] = useState(SECTIONS[0].type);
  const activeSection = SECTIONS.find(s => s.type === activeTab);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 ">Media</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your banner images and gallery media.</p>
      </div>

      {/* tab bar */}
      {/* tab bar */}
<div className="flex gap-0.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-black/10 dark:border-white/10 p-1">
  {SECTIONS.map(section => {
    const isActive = activeTab === section.type;
    return (
      <button
        key={section.type}
        role="tab"
        onClick={() => setActiveTab(section.type)}
        className={`flex-1 flex items-center justify-center gap-2 rounded-[10px] px-4 py-2 text-sm transition-all duration-150
          ${isActive
            ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-medium border border-black/10 dark:border-white/10"
            : "font-normal text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-900/50"
          }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full bg-current transition-opacity duration-150 ${isActive ? "opacity-100" : "opacity-0"}`} />
        {section.label}
      </button>
    );
  })}
</div>

      {activeSection && <SectionRow key={activeSection.type} section={activeSection} />}
    </div>
  );
}