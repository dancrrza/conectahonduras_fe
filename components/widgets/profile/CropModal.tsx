"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { X, Check, ZoomIn, ZoomOut } from "lucide-react";

type Props = {
  src: string;
  onConfirm: (blob: Blob, preview: string) => void;
  onCancel: () => void;
};

const SIZE = 280; // crop square display size in px

export function CropModal({ src, onConfirm, onCancel }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Natural image dimensions
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);

  // Scale: how many natural pixels per display px
  // We fit the image inside a 360px square display container
  const DISPLAY = 360;
  const [scale, setScale] = useState(1); // 1 = fit to container, >1 = zoomed in

  // Pan offset (in display px) — how much the image is shifted inside the container
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragStart = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null);

  const onImgLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    setNaturalW(img.naturalWidth);
    setNaturalH(img.naturalHeight);
    // Start centered
    setOffset({ x: 0, y: 0 });
    setScale(1);
  };

  // Clamp offset so the crop square (SIZE px centered) always stays within the image display area
  const clampOffset = useCallback((ox: number, oy: number, sc: number) => {
    const dispW = (naturalW / Math.max(naturalW, naturalH)) * DISPLAY * sc;
    const dispH = (naturalH / Math.max(naturalW, naturalH)) * DISPLAY * sc;
    const halfCrop = SIZE / 2;
    const imgCenterX = DISPLAY / 2 + ox;
    const imgCenterY = DISPLAY / 2 + oy;
    // Image edges in display coordinates
    const imgLeft = imgCenterX - dispW / 2;
    const imgTop = imgCenterY - dispH / 2;
    const imgRight = imgLeft + dispW;
    const imgBottom = imgTop + dispH;
    // Crop square edges (centered in DISPLAY)
    const cropLeft = DISPLAY / 2 - halfCrop;
    const cropTop = DISPLAY / 2 - halfCrop;
    const cropRight = DISPLAY / 2 + halfCrop;
    const cropBottom = DISPLAY / 2 + halfCrop;

    let nx = ox, ny = oy;
    if (imgLeft > cropLeft) nx -= imgLeft - cropLeft;
    if (imgRight < cropRight) nx += cropRight - imgRight;
    if (imgTop > cropTop) ny -= imgTop - cropTop;
    if (imgBottom < cropBottom) ny += cropBottom - imgBottom;
    return { x: nx, y: ny };
  }, [naturalW, naturalH]);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.mx;
    const dy = e.clientY - dragStart.current.my;
    setOffset(clampOffset(dragStart.current.ox + dx, dragStart.current.oy + dy, scale));
  }, [scale, clampOffset]);
  const onMouseUp = useCallback(() => { dragStart.current = null; }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    dragStart.current = { mx: t.clientX, my: t.clientY, ox: offset.x, oy: offset.y };
  };
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!dragStart.current) return;
    const t = e.touches[0];
    const dx = t.clientX - dragStart.current.mx;
    const dy = t.clientY - dragStart.current.my;
    setOffset(clampOffset(dragStart.current.ox + dx, dragStart.current.oy + dy, scale));
  }, [scale, clampOffset]);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, [onMouseMove, onMouseUp, onTouchMove]);

  const zoom = (dir: 1 | -1) => {
    const next = Math.min(3, Math.max(1, scale + dir * 0.25));
    setScale(next);
    setOffset((o) => clampOffset(o.x, o.y, next));
  };

  const handleConfirm = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !naturalW) return;

    const OUTPUT = 512;
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Compute what portion of the natural image falls inside the crop square
    const dispW = (naturalW / Math.max(naturalW, naturalH)) * DISPLAY * scale;
    const dispH = (naturalH / Math.max(naturalW, naturalH)) * DISPLAY * scale;
    // Image top-left in display space
    const imgLeft = DISPLAY / 2 - dispW / 2 + offset.x;
    const imgTop = DISPLAY / 2 - dispH / 2 + offset.y;
    // Crop square top-left
    const cropLeft = DISPLAY / 2 - SIZE / 2;
    const cropTop = DISPLAY / 2 - SIZE / 2;
    // Relative position of crop inside image (in display px)
    const relX = cropLeft - imgLeft;
    const relY = cropTop - imgTop;
    // Convert to natural pixels
    const pxPerDisp = naturalW / dispW;
    const srcX = relX * pxPerDisp;
    const srcY = relY * (naturalH / dispH);
    const srcSize = SIZE * pxPerDisp;

    ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, OUTPUT, OUTPUT);
    canvas.toBlob((blob) => {
      if (!blob) return;
      onConfirm(blob, URL.createObjectURL(blob));
    }, "image/jpeg", 0.9);
  };

  // Display size of the image inside the container
  const ratio = naturalW && naturalH ? Math.max(naturalW, naturalH) : 1;
  const dispImgW = naturalW ? (naturalW / ratio) * DISPLAY * scale : DISPLAY * scale;
  const dispImgH = naturalH ? (naturalH / ratio) * DISPLAY * scale : DISPLAY * scale;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)", padding: "24px", maxWidth: 420, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,235,224,0.5)", margin: 0 }}>
            Ajustar foto de perfil
          </p>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(240,235,224,0.4)", padding: 4 }}>
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Crop area */}
        <div
          style={{ position: "relative", width: DISPLAY, height: DISPLAY, overflow: "hidden", cursor: "grab", userSelect: "none", background: "#000" }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        >
          {/* Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={src}
            alt=""
            onLoad={onImgLoad}
            draggable={false}
            style={{
              position: "absolute",
              width: dispImgW,
              height: dispImgH,
              left: DISPLAY / 2 - dispImgW / 2 + offset.x,
              top: DISPLAY / 2 - dispImgH / 2 + offset.y,
              pointerEvents: "none",
            }}
          />

          {/* Dark overlay with square cutout */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox={`0 0 ${DISPLAY} ${DISPLAY}`}>
            <defs>
              <mask id="hole">
                <rect width={DISPLAY} height={DISPLAY} fill="white" />
                <rect
                  x={(DISPLAY - SIZE) / 2} y={(DISPLAY - SIZE) / 2}
                  width={SIZE} height={SIZE}
                  fill="black"
                />
              </mask>
            </defs>
            <rect width={DISPLAY} height={DISPLAY} fill="rgba(0,0,0,0.55)" mask="url(#hole)" />
            <rect
              x={(DISPLAY - SIZE) / 2} y={(DISPLAY - SIZE) / 2}
              width={SIZE} height={SIZE}
              fill="none" stroke="rgba(208,59,39,0.8)" strokeWidth="1.5"
            />
          </svg>
        </div>

        <p style={{ fontSize: 10, color: "rgba(240,235,224,0.3)", margin: 0 }}>
          Arrastrá para reposicionar
        </p>

        {/* Zoom controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => zoom(-1)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(240,235,224,0.7)", cursor: "pointer", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ZoomOut style={{ width: 14, height: 14 }} />
          </button>
          <span style={{ fontSize: 11, color: "rgba(240,235,224,0.35)", minWidth: 48, textAlign: "center" }}>
            {Math.round(scale * 100)}%
          </span>
          <button onClick={() => zoom(1)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(240,235,224,0.7)", cursor: "pointer", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ZoomIn style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, width: "100%" }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "11px", background: "transparent", border: "1px solid rgba(240,235,224,0.12)", color: "rgba(240,235,224,0.5)", cursor: "pointer", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Cancelar
          </button>
          <button onClick={handleConfirm} style={{ flex: 1, padding: "11px", background: "#D03B27", border: "none", color: "#F0EBE0", cursor: "pointer", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Check style={{ width: 14, height: 14 }} /> Aplicar
          </button>
        </div>
      </div>

      {/* Hidden canvas for export */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
