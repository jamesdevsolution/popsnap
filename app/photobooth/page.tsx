"use client"

import { useState, useRef, useEffect, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type Layout = { id: string; cols: number; rows: number; label: string };
type Phase = "setup" | "booth" | "edit" | "result";

const LAYOUTS: Layout[] = [
    { id: "1x1", cols: 1, rows: 1, label: "1×1" },
    { id: "1x2", cols: 1, rows: 2, label: "1×2" },
    { id: "2x2", cols: 2, rows: 2, label: "2×2" },
    { id: "1x3", cols: 1, rows: 3, label: "1×3" },
];

const TIMERS = [3, 5, 10];

const FILTERS = [
    { id: "none", label: "None" },
    { id: "bw", label: "B&W" },
    { id: "warm", label: "Warm" },
    { id: "cool", label: "Cool" },
    { id: "vintage", label: "Vintage" },
    { id: "fade", label: "Fade" },
];

const BG_COLOR_PRESETS = [
    { hex: "#e7e7e7", label: "White" },
    { hex: "#111111", label: "Black" },
    { hex: "#E43B37", label: "Red" },
    { hex: "#F59E0B", label: "Amber" },
    { hex: "#10B981", label: "Emerald" },
    { hex: "#3B82F6", label: "Blue" },
    { hex: "#8B5CF6", label: "Violet" },
    { hex: "#EC4899", label: "Pink" },
    { hex: "#F97316", label: "Orange" },
    { hex: "#06B6D4", label: "Cyan" },
    { hex: "#84CC16", label: "Lime" },
    { hex: "#6B7280", label: "Gray" },
];

const STICKER_OPTIONS = ["🌟", "💖", "🎉", "✨", "🌈", "🔥", "🌸", "😎", "🎀", "🦋"];

// ── Layout Preview Mini-Grid ───────────────────────────────────────────────
const LayoutPreview = ({ layout, active }: { layout: Layout; active: boolean }) => {
    const MAX_PREVIEW_ROWS = 3;
    const previewRows = Math.min(layout.rows, MAX_PREVIEW_ROWS);
    return (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${layout.cols}, 1fr)`, gridTemplateRows: `repeat(${previewRows}, 1fr)`, gap: 2, width: 32, height: 32 }}>
            {Array.from({ length: layout.cols * previewRows }).map((_, i) => (
                <div key={i} className={`rounded-[2px] transition-colors duration-150 ${active ? "bg-[#E43B37]" : "bg-[#ccc]"}`} />
            ))}
        </div>
    );
};

// ── Step indicator ─────────────────────────────────────────────────────────
const StepPip = ({ active, done }: { active: boolean; done: boolean }) => (
    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${done ? "bg-[#E43B37]" : active ? "bg-[#111]" : "bg-[#ccc]"}`} />
);

// ── Section label ──────────────────────────────────────────────────────────
const SectionLabel = ({ step, label }: { step: number; label: string }) => (
    <div className="flex items-center gap-2.5">
        <span className="w-6 h-6 rounded-full bg-[#111] text-white text-[11px] font-black flex items-center justify-center flex-shrink-0">{step}</span>
        <span className="text-[13px] font-black text-[#111] tracking-wide uppercase">{label}</span>
    </div>
);

// ── Apply filter to pixel data in-place ───────────────────────────────────
const applyFilterToPixels = (d: Uint8ClampedArray, filter: string) => {
    if (filter === "none") return;
    for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        if (filter === "bw") {
            const gray = r * 0.299 + g * 0.587 + b * 0.114;
            d[i] = d[i + 1] = d[i + 2] = gray;
        } else if (filter === "warm") {
            d[i] = Math.min(255, r * 1.15);
            d[i + 2] = Math.max(0, b * 0.85);
        } else if (filter === "cool") {
            d[i] = Math.max(0, r * 0.85);
            d[i + 2] = Math.min(255, b * 1.15);
        } else if (filter === "vintage") {
            d[i] = Math.min(255, r * 0.9 + g * 0.05 + b * 0.05 + 40);
            d[i + 1] = Math.min(255, r * 0.1 + g * 0.8 + b * 0.1 + 20);
            d[i + 2] = Math.min(255, r * 0.1 + g * 0.1 + b * 0.7 + 10);
        } else if (filter === "fade") {
            d[i] = r * 0.8 + 50;
            d[i + 1] = g * 0.8 + 50;
            d[i + 2] = b * 0.8 + 50;
        }
    }
};

// ── Main Component ─────────────────────────────────────────────────────────
const Photobooth = () => {
    const [phase, setPhase] = useState<Phase>("setup");
    const [camReady, setCamReady] = useState(false);
    const [camError, setCamError] = useState("");
    const [selLayout, setSelLayout] = useState<Layout>(LAYOUTS[2]);
    const [selTimer, setSelTimer] = useState(3);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [flashing, setFlashing] = useState(false);
    const [photos, setPhotos] = useState<string[]>([]);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isMirrored, setIsMirrored] = useState(true);

    const [pendingSticker, setPendingSticker] = useState<string | null>(null);
    const previewImgRef = useRef<HTMLImageElement>(null);
    const previewContainerRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef<{ id: number; startX: number; startY: number } | null>(null);
    const [draggingId, setDraggingId] = useState<number | null>(null);

    // ── Edit state ─────────────────────────────────────────────────────────
    const [selFilter, setSelFilter] = useState("none");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [stickers, setStickers] = useState<{ emoji: string; x: number; y: number; id: number }[]>([]);
    const [caption, setCaption] = useState("");
    const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
    const [isBuilding, setIsBuilding] = useState(false);
    const editDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const stickerIdRef = useRef(0);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const captureCanvasRef = useRef<HTMLCanvasElement>(null);
    const photosRef = useRef<string[]>([]);
    const abortRef = useRef(false);

    const total = selLayout.cols * selLayout.rows;

    // ── Camera ─────────────────────────────────────────────────────────────
    const requestCamera = async () => {
        setCamError("");
        try {
            const s = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }, audio: false });
            streamRef.current = s;
            if (videoRef.current) videoRef.current.srcObject = s;
            setCamReady(true);
        } catch {
            setCamError("Camera access denied. Please allow camera and try again.");
        }
    };

    useEffect(() => {
        if (phase === "booth" && streamRef.current && videoRef.current) videoRef.current.srcObject = streamRef.current;
    }, [phase]);

    useEffect(() => { return () => { streamRef.current?.getTracks().forEach((t) => t.stop()); }; }, []);

    // ── Capture one frame ──────────────────────────────────────────────────
    const captureFrame = useCallback((): string => {
        const video = videoRef.current!;
        const canvas = captureCanvasRef.current!;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext("2d")!;
        if (isMirrored) {
            ctx.save(); ctx.scale(-1, 1); ctx.drawImage(video, -canvas.width, 0); ctx.restore();
        } else {
            ctx.drawImage(video, 0, 0);
        }
        return canvas.toDataURL("image/jpeg", 0.92);
    }, [isMirrored]);

    // ── Run session ────────────────────────────────────────────────────────
    const runSession = useCallback(async (layoutTotal: number, timer: number) => {
        abortRef.current = false;
        photosRef.current = [];
        setPhotos([]);
        setIsRunning(true);
        for (let shot = 0; shot < layoutTotal; shot++) {
            if (abortRef.current) break;
            for (let i = timer; i >= 1; i--) {
                if (abortRef.current) break;
                setCountdown(i);

                new Audio('/assets/beep.mp3').play().catch(() => { });

                await new Promise((r) => setTimeout(r, 1000));
            }
            new Audio('/assets/shutter.mp3').play().catch(() => { });

            if (abortRef.current) break;
            setCountdown(null);
            setFlashing(true);
            await new Promise((r) => setTimeout(r, 120));
            const dataUrl = captureFrame();
            setFlashing(false);
            photosRef.current = [...photosRef.current, dataUrl];
            setPhotos([...photosRef.current]);
            if (shot < layoutTotal - 1 && !abortRef.current) await new Promise((r) => setTimeout(r, 400));
        }
        if (!abortRef.current) setIsRunning(false);
    }, [captureFrame]);

    const handleSnap = useCallback(() => {
        if (isRunning) return;
        runSession(total, selTimer);
    }, [isRunning, total, selTimer, runSession]);

    const startBooth = () => {
        setResultUrl(null);
        setPhotos([]);
        photosRef.current = [];
        setIsRunning(false);
        setStickers([]);
        setSelFilter("none");
        setBgColor("#E7E7E7");
        setCaption("");
        setPhase("booth");
    };

    // ── When booth finishes → go to edit ───────────────────────────────────
    useEffect(() => {
        if (phase === "booth" && photos.length === total && total > 0 && !isRunning) {
            setTimeout(() => setPhase("edit"), 400);
        }
    }, [photos, total, phase, isRunning]);

    // ── Build strip canvas ─────────────────────────────────────────────────
    const buildStrip = useCallback(async (
        photoUrls: string[],
        layout: Layout,
        filter: string,
        bg: string,
        stickerList: { emoji: string; x: number; y: number }[],
        cap: string,
        bakeStickers = true,
    ): Promise<string> => {
        const { cols, rows } = layout;
        const cellW = 400, cellH = 300, gap = 10;
        const captionH = cap.trim() ? 44 : 0;
        const pad = 20;
        const borderW = 12;

        const W = borderW * 2 + pad * 2 + cols * cellW + (cols - 1) * gap;
        const H = borderW * 2 + pad * 2 + rows * cellH + (rows - 1) * gap + captionH;

        const canvas = document.createElement("canvas");
        canvas.width = W; canvas.height = H;
        const ctx = canvas.getContext("2d")!;

        // ── Background ──────────────────────────────────────────────────────
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // ── Helper: load image ──────────────────────────────────────────────
        const loadImg = (src: string): Promise<HTMLImageElement> =>
            new Promise((res) => { const img = new Image(); img.onload = () => res(img); img.src = src; });

        // ── Photos — draw each cell with filter applied only to that cell ───
        for (let i = 0; i < photoUrls.length; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = borderW + pad + col * (cellW + gap);
            const y = borderW + pad + row * (cellH + gap);
            const img = await loadImg(photoUrls[i]);

            const scratch = document.createElement("canvas");
            scratch.width = cellW;
            scratch.height = cellH;
            const sctx = scratch.getContext("2d")!;

            const scale = Math.max(cellW / img.width, cellH / img.height);
            const sw = img.width * scale, sh = img.height * scale;
            sctx.drawImage(img, (cellW - sw) / 2, (cellH - sh) / 2, sw, sh);

            if (filter !== "none") {
                const imageData = sctx.getImageData(0, 0, cellW, cellH);
                applyFilterToPixels(imageData.data, filter);
                sctx.putImageData(imageData, 0, 0);
            }

            ctx.drawImage(scratch, x, y);
        }

        // ── Caption ─────────────────────────────────────────────────────────
        if (cap.trim()) {
            const capY = H - captionH - borderW;
            ctx.font = `bold 20px Figtree, sans-serif`;
            // Pick contrasting text color based on bg brightness
            const r = parseInt(bg.slice(1, 3), 16);
            const g2 = parseInt(bg.slice(3, 5), 16);
            const b = parseInt(bg.slice(5, 7), 16);
            const brightness = (r * 299 + g2 * 587 + b * 114) / 1000;
            ctx.fillStyle = brightness > 140 ? "#333" : "#eee";
            ctx.textAlign = "center";
            ctx.fillText(cap, W / 2, capY + 28);
        }

        // ── Stickers ────────────────────────────────────────────────────────
        if (bakeStickers) {
            ctx.font = "48px serif";
            ctx.textAlign = "center";
            for (const s of stickerList) {
                ctx.fillText(s.emoji, s.x * W, s.y * H);
            }
        }

        return canvas.toDataURL("image/png");
    }, []);

    // ── Rebuild preview whenever edit options change ───────────────────────
    useEffect(() => {
        if (phase !== "edit" || photos.length === 0) return;
        if (editDebounceRef.current) clearTimeout(editDebounceRef.current);
        editDebounceRef.current = setTimeout(async () => {
            setIsBuilding(true);
            const url = await buildStrip(photos, selLayout, selFilter, bgColor, stickers, caption, false);
            setEditPreviewUrl(url);
            setIsBuilding(false);
        }, 120);
    }, [phase, photos, selLayout, selFilter, bgColor, stickers, caption, buildStrip]);

    // ── Sticker handlers ───────────────────────────────────────────────────
    const handlePreviewClick = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
        if (!pendingSticker || !previewImgRef.current || draggingRef.current) return;
        const rect = previewImgRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setStickers((prev) => [...prev, { emoji: pendingSticker, x, y, id: stickerIdRef.current++ }]);
    }, [pendingSticker]);

    const removeSticker = useCallback((id: number) => {
        setStickers((prev) => prev.filter((s) => s.id !== id));
    }, []);

    const handleStickerPointerDown = useCallback((e: React.PointerEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        draggingRef.current = { id, startX: e.clientX, startY: e.clientY };
        setDraggingId(id);
    }, []);

    const handleStickerPointerMove = useCallback((e: React.PointerEvent, id: number) => {
        if (!draggingRef.current || draggingRef.current.id !== id || !previewImgRef.current) return;
        e.preventDefault();
        const rect = previewImgRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        setStickers((prev) => prev.map((s) => s.id === id ? { ...s, x, y } : s));
    }, []);

    const handleStickerPointerUp = useCallback((e: React.PointerEvent, id: number) => {
        const drag = draggingRef.current;
        draggingRef.current = null;
        setDraggingId(null);
        const dist = Math.hypot(e.clientX - (drag?.startX ?? 0), e.clientY - (drag?.startY ?? 0));
        if (dist < 5) removeSticker(id);
    }, [removeSticker]);

    // ── Finalise ───────────────────────────────────────────────────────────
    const handleFinalise = async () => {
        setIsBuilding(true);
        const url = await buildStrip(photos, selLayout, selFilter, bgColor, stickers, caption, true);
        setResultUrl(url);
        setIsBuilding(false);
        setPhase("result");
    };

    // ── Cancel / retake ────────────────────────────────────────────────────
    const handleCancel = () => {
        abortRef.current = true;
        setIsRunning(false);
        setPhotos([]);
        setCountdown(null);
        setPhase("setup");
    };

    const handleRetake = () => {
        setPhotos([]);
        setResultUrl(null);
        setEditPreviewUrl(null);
        setPhase("setup");
    };

    const handleDownload = () => {
        if (!resultUrl) return;
        const a = document.createElement("a");
        a.download = `snapstop-${selLayout.id}.png`;
        a.href = resultUrl;
        a.click();
    };

    // ──────────────────────────────────────────────────────────────────────
    return (
        <div className="font-[Figtree] bg-[#eeecea] min-h-screen">
            <canvas ref={captureCanvasRef} className="hidden" />

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* SETUP PHASE                                                    */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {phase === "setup" && (
                <main className="max-w-[900px] mx-auto px-5 sm:px-10 py-5 sm:py-16 flex flex-col gap-12">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#111] leading-[1.05]">Set up your booth</h1>
                        <p className="text-[#777] font-semibold text-sm sm:text-base">Choose your camera, layout, and timer then snap away.</p>
                    </div>

                    {/* Camera */}
                    <section className="flex flex-col gap-4">
                        <SectionLabel step={1} label="Camera" />
                        <div className="bg-white rounded-[20px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${camReady ? "bg-green-100" : "bg-[#f3f3f3]"}`}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke={camReady ? "#22c55e" : "#999"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="13" r="4" stroke={camReady ? "#22c55e" : "#999"} strokeWidth="2" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-extrabold text-[15px] text-[#111]">{camReady ? "Camera connected" : "No camera connected"}</p>
                                    <p className="text-[12px] font-semibold text-[#999]">{camReady ? "Your webcam is ready to use" : camError || "Click to allow camera access"}</p>
                                </div>
                            </div>
                            {!camReady ? (
                                <button onClick={requestCamera} className="cursor-pointer flex-shrink-0 bg-[#111] text-white rounded-full px-6 py-2.5 text-sm font-bold hover:bg-[#333] transition-colors">Allow access</button>
                            ) : (
                                <span className="flex-shrink-0 flex items-center gap-1.5 text-green-600 font-bold text-sm"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Ready</span>
                            )}
                        </div>
                        {camError && <p className="text-[#E43B37] text-sm font-semibold px-1">{camError}</p>}
                    </section>

                    {/* Layout */}
                    <section className="flex flex-col gap-4">
                        <SectionLabel step={2} label="Layout" />
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                            {LAYOUTS.map((l) => {
                                const active = selLayout.id === l.id;
                                return (
                                    <button key={l.id} onClick={() => setSelLayout(l)} className={`flex flex-col items-center gap-2 rounded-[16px] py-4 px-2 border-[1.5px] transition-all duration-150 cursor-pointer ${active ? "bg-white border-[#E43B37]" : "bg-white border-transparent hover:border-[#ddd]"}`}>
                                        <LayoutPreview layout={l} active={active} />
                                        <span className={`text-[11px] font-black tracking-tight ${active ? "text-[#E43B37]" : "text-[#999]"}`}>{l.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-[12px] font-semibold text-[#aaa] px-1">{selLayout.cols * selLayout.rows} photo{selLayout.cols * selLayout.rows > 1 ? "s" : ""} will be taken · {selLayout.label} grid</p>
                    </section>

                    {/* Timer */}
                    <section className="flex flex-col gap-4">
                        <SectionLabel step={3} label="Countdown timer" />
                        <div className="flex gap-3">
                            {TIMERS.map((t) => {
                                const active = selTimer === t;
                                return (
                                    <button key={t} onClick={() => setSelTimer(t)} className={`flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 border-[1.5px] text-sm font-black transition-all duration-150 ${active ? "bg-[#111] border-[#111] text-white" : "bg-white border-[#ddd] text-[#555] hover:border-[#bbb]"}`}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke={active ? "#fff" : "#999"} strokeWidth="2" />
                                            <path d="M12 6v6l4 2" stroke={active ? "#fff" : "#999"} strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        {t}s
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <button onClick={startBooth} disabled={!camReady} className={`w-full cursor-pointer sm:w-auto self-start flex items-center justify-center gap-2.5 rounded-full px-10 py-4 text-base font-black tracking-tight transition-all duration-150 ${camReady ? "bg-[#E43B37] text-white hover:bg-[#c9332f]" : "bg-[#ddd] text-[#aaa] cursor-not-allowed"}`}>
                        {camReady ? "Start booth →" : "Allow camera first"}
                    </button>
                </main>
            )}

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* BOOTH PHASE                                                    */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {phase === "booth" && (
                <main className="max-w-[900px] mx-auto px-5 sm:px-10 py-8 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111]">
                                {!isRunning && photos.length === 0 ? "Hit snap to start!" : countdown !== null ? "Get ready…" : `${photos.length} of ${total} done`}
                            </h2>
                            <p className="text-[#999] text-sm font-semibold mt-0.5">Layout: {selLayout.label} · Timer: {selTimer}s{isRunning && " · Auto-capturing…"}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                {Array.from({ length: total }).map((_, i) => (<StepPip key={i} active={i === photos.length} done={i < photos.length} />))}
                            </div>
                            <button onClick={handleCancel} className="cursor-pointer flex items-center gap-1.5 bg-white border border-[#ddd] text-[#555] rounded-full px-4 py-2 text-sm font-bold hover:border-[#bbb] hover:text-[#111] transition-colors">← Cancel</button>
                        </div>
                    </div>

                    {/* Viewfinder */}
                    <div className="relative bg-black overflow-hidden" style={{ aspectRatio: "16/10" }}>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                            style={{ transform: isMirrored ? "scaleX(-1)" : "none" }}
                        />
                        {countdown !== null && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                                <span className="text-white font-[Coiny] leading-none" style={{ fontSize: "clamp(80px, 15vw, 160px)" }}>{countdown}</span>
                            </div>
                        )}
                        {flashing && <div className="absolute inset-0 bg-white z-20 pointer-events-none" />}
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">{photos.length}/{total}</div>

                        {/* Mirror toggle */}
                        <button
                            onClick={() => setIsMirrored((m) => !m)}
                            title={isMirrored ? "Switch to normal" : "Switch to mirror"}
                            className="cursor-pointer absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-black/80 transition-colors"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2v20M2 12l4-4m-4 4l4 4M22 12l-4-4m4 4l-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {isMirrored ? "Mirror" : "Normal"}
                        </button>

                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                            <div className="h-full bg-[#E43B37] transition-all duration-500" style={{ width: `${(photos.length / total) * 100}%` }} />
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex gap-2 overflow-x-auto flex-1">
                            {Array.from({ length: total }).map((_, i) => (
                                <div key={i} className={`flex-shrink-0 w-14 h-14 rounded-[10px] overflow-hidden border-[1.5px] transition-all duration-200 ${i < photos.length ? "border-[#E43B37]" : "border-[#ddd] bg-white"}`}>
                                    {photos[i] ? <img src={photos[i]} alt={`Shot ${i + 1}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="text-[11px] font-bold text-[#ccc]">{i + 1}</span></div>}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleSnap}
                            disabled={isRunning || photos.length >= total}
                            className={`group flex-shrink-0 w-16 h-16 flex items-center justify-center transition-all duration-150 ${isRunning || photos.length >= total ? "cursor-not-allowed" : "active:scale-95 cursor-pointer"}`}
                        >
                            <img
                                src="/assets/icon.png"
                                alt="Snap"
                                className={`w-20 h-20 object-contain transition-transform duration-150 ease-out ${isRunning || photos.length >= total ? "opacity-30" : "group-hover:scale-125 group-hover:-translate-y-1"}`}
                            />
                        </button>
                    </div>
                </main>
            )}

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* EDIT PHASE                                                     */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {phase === "edit" && (
                <main className="max-w-[1100px] mx-auto px-5 sm:px-10 py-5 flex flex-col gap-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111]">Edit your strip</h2>
                            <p className="text-[#777] font-semibold text-sm">
                                {pendingSticker ? `Click anywhere on the strip to place ${pendingSticker}` : "Add filters, a background color, stickers, and a caption."}
                            </p>
                        </div>
                        <button onClick={handleRetake} className="cursor-pointer flex-shrink-0 flex items-center gap-1.5 bg-white border border-[#ddd] text-[#555] rounded-full px-4 py-2 text-sm font-bold hover:border-[#bbb] hover:text-[#111] transition-colors mt-1">← Retake</button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">

                        {/* Preview */}
                        <div className="flex-1 bg-white rounded-[20px] p-5 flex items-center justify-center min-h-[300px] relative">
                            {isBuilding && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-[20px] bg-white/80 z-10">
                                    <div className="w-6 h-6 rounded-full border-2 border-[#E43B37] border-t-transparent animate-spin" />
                                </div>
                            )}
                            {editPreviewUrl && (
                                <div className="relative inline-block " ref={previewContainerRef}>
                                    <img
                                        ref={previewImgRef}
                                        src={editPreviewUrl}
                                        alt="Preview"
                                        draggable={false}
                                        onClick={handlePreviewClick}
                                        className="max-w-full  select-none transition-opacity duration-200"
                                        style={{ maxHeight: "55vh", objectFit: "contain", opacity: isBuilding ? 0.4 : 1, cursor: pendingSticker ? "crosshair" : "default" }}
                                    />
                                    {stickers.map((s) => (
                                        <span
                                            key={s.id}
                                            onPointerDown={(e) => handleStickerPointerDown(e, s.id)}
                                            onPointerMove={(e) => handleStickerPointerMove(e, s.id)}
                                            onPointerUp={(e) => handleStickerPointerUp(e, s.id)}
                                            title="Drag to move · tap to remove"
                                            style={{
                                                position: "absolute",
                                                left: `${s.x * 100}%`,
                                                top: `${s.y * 100}%`,
                                                transform: "translate(-50%, -50%)",
                                                fontSize: 32,
                                                lineHeight: 1,
                                                cursor: draggingId === s.id ? "grabbing" : "grab",
                                                userSelect: "none",
                                                touchAction: "none",
                                                filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.3))",
                                                transition: draggingId === s.id ? "none" : "transform 0.1s",
                                                zIndex: draggingId === s.id ? 20 : 10,
                                                scale: draggingId === s.id ? "1.2" : "1",
                                            }}
                                        >
                                            {s.emoji}
                                        </span>
                                    ))}
                                    {pendingSticker && (
                                        <div className="absolute inset-0 overflow-hidden ring-2 ring-[#E43B37] ring-offset-2 pointer-events-none animate-pulse" />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="w-full lg:w-[280px] flex flex-col gap-5">

                            {/* Filter */}
                            <div className="bg-white rounded-[20px] p-4 flex flex-col gap-3">
                                <p className="text-[11px] font-black text-[#111] tracking-widest uppercase">Filter</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {FILTERS.map((f) => {
                                        const active = selFilter === f.id;
                                        return (
                                            <button key={f.id} onClick={() => setSelFilter(f.id)} className={`cursor-pointer rounded-[10px] py-2 px-1 text-[11px] font-black transition-all duration-150 border-[1.5px] ${active ? "bg-[#111] border-[#111] text-white" : "bg-[#f5f5f5] border-transparent text-[#555] hover:border-[#ddd]"}`}>
                                                {f.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Background Color */}
                            <div className="bg-white rounded-[20px] p-4 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-[11px] font-black text-[#111] tracking-widest uppercase">Background</p>
                                    <span className="text-[10px] font-bold text-[#bbb]">{bgColor.toUpperCase()}</span>
                                </div>
                                <div className="grid grid-cols-6 gap-1.5">
                                    {BG_COLOR_PRESETS.map(({ hex, label }) => {
                                        const active = bgColor === hex;
                                        return (
                                            <button
                                                key={hex}
                                                onClick={() => setBgColor(hex)}
                                                title={label}
                                                className="cursor-pointer w-full aspect-square rounded-[7px] transition-all duration-150 flex items-center justify-center"
                                                style={{
                                                    background: hex,
                                                    border: active ? "2.5px solid #111" : hex === "#ffffff" ? "1.5px solid #e5e5e5" : "2px solid transparent",
                                                    boxShadow: active ? "0 0 0 1.5px #fff inset" : "none",
                                                }}
                                            >
                                                {active && (
                                                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                                        <path
                                                            d="M2 6l3 3 5-5"
                                                            stroke={["#ffffff", "#F59E0B", "#84CC16", "#10B981", "#06B6D4"].includes(hex) ? "#111" : "#fff"}
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                {/* Free-pick color input */}
                                <label className="cursor-pointer flex items-center gap-2 bg-[#f5f5f5] hover:bg-[#efefef] rounded-[10px] px-3 py-2 transition-colors">
                                    <div
                                        className="w-5 h-5 rounded-[4px] flex-shrink-0 border border-[#ddd]"
                                        style={{ background: BG_COLOR_PRESETS.some(p => p.hex === bgColor) ? "#f5f5f5" : bgColor }}
                                    />
                                    <span className="text-[11px] font-black text-[#555]">Custom color…</span>
                                    <input
                                        type="color"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="sr-only"
                                    />
                                </label>
                            </div>

                            {/* Stickers */}
                            <div className="bg-white rounded-[20px] p-4 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-[11px] font-black text-[#111] tracking-widest uppercase">Stickers</p>
                                    {stickers.length > 0 && (
                                        <button onClick={() => setStickers([])} className="cursor-pointer text-[11px] font-bold text-[#E43B37] hover:text-[#c9332f] transition-colors">Clear all</button>
                                    )}
                                </div>
                                {pendingSticker && (
                                    <div className="flex items-center justify-between bg-[#fff8f8] border border-[#fca5a5] rounded-[10px] px-3 py-2">
                                        <span className="text-[12px] font-bold text-[#E43B37]">Click the strip to place {pendingSticker}</span>
                                        <button onClick={() => setPendingSticker(null)} className="cursor-pointer text-[#E43B37] hover:text-[#c9332f] font-black text-sm ml-2">✕</button>
                                    </div>
                                )}
                                <div className="grid grid-cols-5 gap-1.5">
                                    {STICKER_OPTIONS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            onClick={() => setPendingSticker(pendingSticker === emoji ? null : emoji)}
                                            className={`cursor-pointer text-xl rounded-[8px] py-1.5 transition-all active:scale-90 ${pendingSticker === emoji ? "bg-[#fff0f0] ring-2 ring-[#E43B37]" : "hover:bg-[#f5f5f5]"}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                                {stickers.length > 0 && (
                                    <p className="text-[11px] text-[#aaa] font-semibold">{stickers.length} sticker{stickers.length > 1 ? "s" : ""} · tap a sticker to remove it</p>
                                )}
                            </div>

                            {/* Caption */}
                            <div className="bg-white rounded-[20px] p-4 flex flex-col gap-3">
                                <p className="text-[11px] font-black text-[#111] tracking-widest uppercase">Caption</p>
                                <input
                                    type="text"
                                    maxLength={20}
                                    placeholder="Add a caption…"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    className="w-full bg-[#f5f5f5] rounded-[10px] px-3 py-2.5 text-base font-semibold text-[#111] placeholder-[#bbb] outline-none focus:ring-2 focus:ring-[#E43B37]/30 transition-all"
                                />
                                <p className="text-[11px] text-[#bbb] font-semibold text-right">{caption.length}/20</p>
                            </div>

                            {/* Save */}
                            <button onClick={handleFinalise} disabled={isBuilding} className={`cursor-pointer w-full flex items-center justify-center gap-2 rounded-full py-4 text-base font-black tracking-tight transition-all duration-150 ${isBuilding ? "bg-[#ddd] text-[#aaa] cursor-not-allowed" : "bg-[#E43B37] text-white hover:bg-[#c9332f]"}`}>
                                {isBuilding ? "Building…" : "Save strip →"}
                            </button>
                        </div>
                    </div>
                </main>
            )}

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* RESULT PHASE                                                   */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {phase === "result" && resultUrl && (
                <main className="max-w-[900px] mx-auto px-5 sm:px-10 py-5 flex flex-col gap-8">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-xs font-bold tracking-widest text-[#E43B37] uppercase">All done!</p>
                            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#111]">Your strip is ready.</h2>
                            <p className="text-[#777] font-semibold text-sm">Download or retake to try again.</p>
                        </div>
                        <button onClick={handleRetake} className="cursor-pointer flex-shrink-0 flex items-center gap-1.5 bg-white border border-[#ddd] text-[#555] rounded-full px-4 py-2 text-sm font-bold hover:border-[#bbb] hover:text-[#111] transition-colors mt-1">← Retake</button>
                    </div>

                    <div className="bg-white rounded-[20px] p-6 flex items-center justify-center">
                        <img src={resultUrl} alt="Your photo strip" className="max-w-full " style={{ maxHeight: "60vh", objectFit: "contain" }} />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button onClick={handleDownload} className="cursor-pointer flex items-center gap-2 bg-[#111] text-white rounded-full px-8 py-3.5 text-sm font-bold hover:bg-[#333] transition-colors">Download PNG</button>
                        <button onClick={() => setPhase("edit")} className="cursor-pointer flex items-center gap-2 bg-white text-[#111] border border-[#ddd] rounded-full px-8 py-3.5 text-sm font-bold hover:border-[#bbb] transition-colors">Edit again</button>
                    </div>
                </main>
            )}
        </div>
    );
};

export default Photobooth;