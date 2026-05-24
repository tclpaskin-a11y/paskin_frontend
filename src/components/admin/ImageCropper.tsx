import { useState, useRef, useEffect } from "react";
import { X, ZoomIn, ZoomOut, Check, Crop } from "lucide-react";
import { motion } from "framer-motion";

interface ImageCropperProps {
  file: File;
  aspectRatio: number; // e.g. 1 for 1:1, 1.777 (16/9) for 16:9
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
}

export default function ImageCropper({
  file,
  aspectRatio,
  onClose,
  onCropComplete,
}: ImageCropperProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [imageSrc, setImageSrc] = useState<string>("");
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [baseSize, setBaseSize] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const offsetStartRef = useRef({ x: 0, y: 0 });

  const CROP_CONTAINER_SIZE = 400; // Screen size of crop container area
  
  // Crop area size on screen
  let cropWidth = 320;
  let cropHeight = 320;
  if (aspectRatio > 1) {
    cropWidth = 340;
    cropHeight = 340 / aspectRatio;
  } else if (aspectRatio < 1) {
    cropHeight = 340;
    cropWidth = 340 * aspectRatio;
  }

  // Generate image URL on mount
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    setNaturalSize({ width: nw, height: nh });

    // Calculate base size to cover crop area at zoom = 1
    const scaleToCover = Math.max(cropWidth / nw, cropHeight / nh);
    const bw = nw * scaleToCover;
    const bh = nh * scaleToCover;
    setBaseSize({ width: bw, height: bh });
    setOffset({ x: 0, y: 0 });
    setZoom(1);
  };

  // Clamp offset to ensure the image always covers the crop area
  const getClampedOffset = (x: number, y: number, currentZoom: number) => {
    const currentW = baseSize.width * currentZoom;
    const currentH = baseSize.height * currentZoom;

    const maxOffsetX = Math.max(0, (currentW - cropWidth) / 2);
    const maxOffsetY = Math.max(0, (currentH - cropHeight) / 2);

    return {
      x: Math.min(maxOffsetX, Math.max(-maxOffsetX, x)),
      y: Math.min(maxOffsetY, Math.max(-maxOffsetY, y)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    offsetStartRef.current = { ...offset };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const targetX = offsetStartRef.current.x + dx;
    const targetY = offsetStartRef.current.y + dy;

    setOffset(getClampedOffset(targetX, targetY, zoom));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    offsetStartRef.current = { ...offset };
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    const targetX = offsetStartRef.current.x + dx;
    const targetY = offsetStartRef.current.y + dy;

    setOffset(getClampedOffset(targetX, targetY, zoom));
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [offset, zoom, baseSize]);

  // Handle zooming and clamp offsets accordingly
  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    setOffset(getClampedOffset(offset.x, offset.y, newZoom));
  };

  const handleCrop = () => {
    if (!naturalSize.width || !naturalSize.height) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      
      const currentW = baseSize.width * zoom;
      const currentH = baseSize.height * zoom;

      // Screen offsets from center
      const sX = (currentW - cropWidth) / 2 - offset.x;
      const sY = (currentH - cropHeight) / 2 - offset.y;

      // Natural mapping
      const naturalScale = naturalSize.width / currentW;
      const cropX = sX * naturalScale;
      const cropY = sY * naturalScale;
      const cropW = cropWidth * naturalScale;
      const cropH = cropHeight * naturalScale;

      canvas.width = cropW;
      canvas.height = cropH;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // High quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

        canvas.toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], file.name, {
              type: file.type || "image/jpeg",
              lastModified: Date.now(),
            });
            onCropComplete(croppedFile);
          }
        }, file.type || "image/jpeg", 0.9);
      }
    };
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl z-10 border border-slate-100 dark:border-slate-800 flex flex-col"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <Crop className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Crop Image</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Viewport container */}
        <div className="p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950/50">
          <div 
            ref={containerRef}
            className="relative overflow-hidden bg-slate-200 dark:bg-slate-900 rounded-2xl cursor-move shadow-inner select-none flex items-center justify-center"
            style={{ 
              width: CROP_CONTAINER_SIZE, 
              height: CROP_CONTAINER_SIZE 
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={(e) => handleTouchMove(e.nativeEvent)}
            onTouchEnd={handleMouseUp}
          >
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Crop preview"
                onLoad={handleImageLoad}
                className="absolute object-cover pointer-events-none select-none"
                style={{
                  width: baseSize.width ? `${baseSize.width * zoom}px` : "auto",
                  height: baseSize.height ? `${baseSize.height * zoom}px` : "auto",
                  transform: `translate(${offset.x}px, ${offset.y}px)`,
                  transition: isDraggingRef.current ? "none" : "transform 0.15s ease-out",
                }}
              />
            )}

            {/* Dark Overlay/Mask outside crop box */}
            <div className="absolute inset-0 pointer-events-none">
              <div 
                className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] rounded-md"
                style={{
                  width: `${cropWidth}px`,
                  height: `${cropHeight}px`,
                  left: `${(CROP_CONTAINER_SIZE - cropWidth) / 2}px`,
                  top: `${(CROP_CONTAINER_SIZE - cropHeight) / 2}px`,
                }}
              >
                {/* Visual grid inside the crop box */}
                <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-30">
                  <div className="border-r border-b border-white border-dashed"></div>
                  <div className="border-r border-b border-white border-dashed"></div>
                  <div className="border-b border-white border-dashed"></div>
                  <div className="border-r border-b border-white border-dashed"></div>
                  <div className="border-r border-b border-white border-dashed"></div>
                  <div className="border-b border-white border-dashed"></div>
                  <div className="border-r border-white border-dashed"></div>
                  <div className="border-r border-white border-dashed"></div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>

          {/* Zoom Slider */}
          <div className="w-full mt-6 flex items-center gap-4 px-2">
            <ZoomOut className="h-4 w-4 text-slate-400" />
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(e) => handleZoomChange(Number(e.target.value))}
              className="flex-1 accent-primary bg-slate-200 dark:bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <ZoomIn className="h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 flex gap-4 bg-white dark:bg-slate-900">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-4 rounded-2xl transition-all"
          >
            Discard
          </button>
          <button
            onClick={handleCrop}
            className="flex-1 bg-primary hover:bg-primary-glow text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
          >
            <Check className="h-5 w-5" />
            Apply Crop
          </button>
        </div>
      </motion.div>
    </div>
  );
}
