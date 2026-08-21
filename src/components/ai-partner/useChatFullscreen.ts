import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from "react";

type WebkitFullscreenDocument = Document & {
  readonly webkitFullscreenElement?: Element | null;
  readonly webkitFullscreenEnabled?: boolean;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type WebkitFullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

// useLayoutEffect y no useEffect: el cleanup limpia estilos inline de altura.
// Con un efecto pasivo, React pinta el className de modo normal antes de
// limpiarlos y el widget brinca un frame con la altura del overlay.
export function useChatFullscreen(): {
  isFullscreen: boolean;
  toggle: () => void;
  exit: () => void;
  overlayRef: RefObject<HTMLDivElement | null>;
} {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const exit = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsFullscreen((value) => !value);
  }, []);

  useLayoutEffect(() => {
    if (!isFullscreen) return;

    let cancelled = false;
    const savedScrollY = window.scrollY;
    const body = document.body;
    const previousBodyStyles = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };

    body.style.position = "fixed";
    body.style.top = `-${savedScrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    document.documentElement.classList.add("bpm-chat-fullscreen");

    const fullscreenDocument = document as WebkitFullscreenDocument;
    const fullscreenElement = document.documentElement as WebkitFullscreenElement;

    const exitNativeFullscreen = () => {
      if (!fullscreenDocument.fullscreenElement && !fullscreenDocument.webkitFullscreenElement) {
        return;
      }

      const exitFullscreen =
        fullscreenDocument.exitFullscreen ?? fullscreenDocument.webkitExitFullscreen;
      if (!exitFullscreen) return;

      try {
        void Promise.resolve(exitFullscreen.call(fullscreenDocument)).catch(() => {});
      } catch {
        // Legacy WebKit implementations may throw synchronously.
      }
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") exit();
    };

    const handleFullscreenChange = () => {
      if (!fullscreenDocument.fullscreenElement && !fullscreenDocument.webkitFullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    const requestFullscreen =
      fullscreenElement.requestFullscreen ?? fullscreenElement.webkitRequestFullscreen;
    const fullscreenEnabled =
      fullscreenDocument.fullscreenEnabled ?? fullscreenDocument.webkitFullscreenEnabled ?? false;

    if (fullscreenEnabled && requestFullscreen) {
      try {
        void Promise.resolve(requestFullscreen.call(fullscreenElement))
          .then(() => {
            if (cancelled) exitNativeFullscreen();
          })
          .catch(() => {});
      } catch {
        // Legacy WebKit implementations may throw synchronously.
      }
    }

    const visualViewport = window.visualViewport;
    let syncVisualViewport: (() => void) | undefined;

    if (visualViewport) {
      syncVisualViewport = () => {
        const node = overlayRef.current;
        if (!node) return;
        node.style.height = `${visualViewport.height}px`;
        node.style.top = `${visualViewport.offsetTop}px`;
      };

      syncVisualViewport();
      visualViewport.addEventListener("resize", syncVisualViewport);
      visualViewport.addEventListener("scroll", syncVisualViewport);
    }

    return () => {
      cancelled = true;

      if (visualViewport && syncVisualViewport) {
        visualViewport.removeEventListener("resize", syncVisualViewport);
        visualViewport.removeEventListener("scroll", syncVisualViewport);

        const node = overlayRef.current;
        if (node) {
          node.style.height = "";
          node.style.top = "";
        }
      }

      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);

      exitNativeFullscreen();

      // Quita la escala antes de restaurar el body para que el scroll use el layout de 16px.
      document.documentElement.classList.remove("bpm-chat-fullscreen");

      body.style.position = previousBodyStyles.position;
      body.style.top = previousBodyStyles.top;
      body.style.left = previousBodyStyles.left;
      body.style.right = previousBodyStyles.right;
      body.style.width = previousBodyStyles.width;

      window.scrollTo({ top: savedScrollY, left: 0, behavior: "instant" });
    };
  }, [isFullscreen, exit]);

  return { isFullscreen, toggle, exit, overlayRef };
}
