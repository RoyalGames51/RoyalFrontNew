import { useRef, useState, useEffect, useCallback } from "react";
import { Box, Spinner, Center } from "@chakra-ui/react";

// Shared wrapper for the externally-hosted game iframes (Minas, Royal Joker, Royal Pachinka).
// We don't control those games' internal HTML/canvas, so we can't detect or resize their real
// content (different origin — the browser blocks reading cross-origin iframe dimensions). Until
// each game is made responsive at the source, this gives players the two things we *can*
// guarantee from our side: a one-click way to maximize the browser's own viewport (Fullscreen
// API), and a scrollable fallback instead of hard-clipping controls that don't fit on-screen.
export default function GameFrame({ src, title }) {
  const wrapperRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  return (
    <Box
      ref={wrapperRef}
      w="100%"
      h={isFullscreen ? "100vh" : "calc(100vh - 80px)"}
      bg="gray.900"
      display="flex"
      flexDirection="column"
    >
      {src ? (
        <Box flex="1" position="relative" w="100%" h="100%" bg="gray.800" overflow="auto">
          <iframe
            src={src}
            title={title}
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
          />
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
