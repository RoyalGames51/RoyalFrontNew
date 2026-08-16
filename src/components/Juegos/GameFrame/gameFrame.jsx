import { useRef, useState, useEffect, useCallback } from "react";
import { Box, Spinner, Center } from "@chakra-ui/react";

// Shared wrapper for the externally-hosted game iframes (Minas, Royal Joker, Royal Pachinka,
// Bingo). We don't control those games' internal HTML/canvas, so we can't detect or resize their
// real content (different origin — the browser blocks reading cross-origin iframe dimensions).
// When a game's native pixel resolution is known (nativeWidth/nativeHeight), we can still scale
// the iframe *element itself* (a black box from CSS's point of view, no cross-origin read needed)
// with transform: scale() so the whole game always fits without clipping, letterboxed if the
// screen's aspect ratio doesn't match. Games whose native resolution isn't known yet fall back to
// the old 100%/scroll behavior, plus the Fullscreen API toggle either way.
export default function GameFrame({ src, title, nativeWidth, nativeHeight }) {
  const wrapperRef = useRef(null);
  const scaleContainerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const hasFixedResolution = !!(nativeWidth && nativeHeight);

  const toggleFullscreen = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const isCurrentlyFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
    if (!isCurrentlyFullscreen) {
      const request = el.requestFullscreen || el.webkitRequestFullscreen;
      request?.call(el);
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      exit?.call(document);
    }
  }, []);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleChange);
    document.addEventListener("webkitfullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      document.removeEventListener("webkitfullscreenchange", handleChange);
    };
  }, []);

  // A lingering scrollbar on the outer page (even a few px) shrinks the real viewport, so
  // 100vh ends up taller than what's actually visible and the bottom of the game gets clipped.
  // Locking document scroll while fullscreen removes that discrepancy.
  useEffect(() => {
    if (!isFullscreen) return;
    const { documentElement, body } = document;
    const prevHtmlOverflow = documentElement.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      documentElement.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [isFullscreen]);

  // Recompute the scale factor whenever the available space changes (window resize, entering/
  // exiting fullscreen, sidebar collapsing, etc.) so the fixed-resolution game always fits exactly.
  useEffect(() => {
    if (!hasFixedResolution) return;
    const container = scaleContainerRef.current;
    if (!container) return;
    const updateScale = () => {
      const { clientWidth, clientHeight } = container;
      if (!clientWidth || !clientHeight) return;
      setScale(Math.min(clientWidth / nativeWidth, clientHeight / nativeHeight));
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, [hasFixedResolution, nativeWidth, nativeHeight, isFullscreen]);

  return (
    <Box
      ref={wrapperRef}
      w="100%"
      h={isFullscreen ? "100dvh" : "calc(100vh - 80px)"}
      bg="gray.900"
      display="flex"
      flexDirection="column"
    >
      {src ? (
        <Box flex="1" position="relative" w="100%" h="100%" bg="gray.800" overflow={hasFixedResolution ? "hidden" : "auto"}>
          {hasFixedResolution ? (
            <Box
              ref={scaleContainerRef}
              position="absolute"
              inset={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <div
                style={{
                  width: nativeWidth,
                  height: nativeHeight,
                  flexShrink: 0,
                  transform: `scale(${scale})`,
                  transformOrigin: "center center",
                }}
              >
                <iframe
                  src={src}
                  title={title}
                  style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                />
              </div>
            </Box>
          ) : (
            <iframe
              src={src}
              title={title}
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            />
          )}
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 10,
              width: 36,
              height: 36,
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(0,0,0,0.55)",
              color: "#C9A84C",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              {isFullscreen ? "fullscreen_exit" : "fullscreen"}
            </span>
          </button>
        </Box>
      ) : (
        <Center h="100%">
          <Spinner size={{ base: "md", md: "xl" }} color="teal.300" />
        </Center>
      )}
    </Box>
  );
}
