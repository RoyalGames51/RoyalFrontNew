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

  // Game pages are meant to fill exactly the available viewport (calc(100vh - nav) or 100dvh in
  // fullscreen) — there's never legitimate content to page-scroll to. But a stray sub-pixel
  // rounding difference anywhere in the surrounding layout is enough to make the document a few
  // px taller than the viewport, which shows a page scrollbar and lets the whole game shift under
  // the nav when scrolled. Locking document scroll for as long as GameFrame is mounted (not just
  // during fullscreen) removes that possibility outright instead of chasing the exact px source.
  useEffect(() => {
    const { documentElement, body } = document;
    const prevHtmlOverflow = documentElement.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      documentElement.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  // Recompute the scale factor whenever the available space changes (window resize, entering/
  // exiting fullscreen, sidebar collapsing, etc.) so the fixed-resolution game always fits exactly.
  // Also re-runs when `src` flips from null to a real URL: the scaled container only exists in the
  // DOM once `src` is truthy (some games, like Minas, resolve it asynchronously after this effect's
  // first run), so without `src` as a dependency the observer would attach to nothing and `scale`
  // would stay stuck at its initial value once the container finally mounts.
  useEffect(() => {
    if (!hasFixedResolution || !src) return;
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
  }, [hasFixedResolution, nativeWidth, nativeHeight, isFullscreen, src]);

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
        <Box
          ref={scaleContainerRef}
          flex="1"
          position="relative"
          w="100%"
          h="100%"
          bg="gray.800"
          overflow={hasFixedResolution ? "hidden" : "auto"}
        >
          {hasFixedResolution ? (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: nativeWidth,
                height: nativeHeight,
                transform: `translate(-50%, -50%) scale(${scale})`,
                transformOrigin: "center center",
              }}
            >
              <iframe
                src={src}
                title={title}
                scrolling="no"
                style={{ width: "100%", height: "100%", border: "none", display: "block", overflow: "hidden" }}
              />
            </div>
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
