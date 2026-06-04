import { useEffect, useState, type ReactNode } from "react";
import { PopupModal } from "react-calendly";

export const CALENDLY_URL = "https://calendly.com/pablormzhu/bpm-io-30-min";

export function CalendlyTrigger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [rootEl, setRootEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setRootEl(document.body);
  }, []);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      {rootEl && (
        <PopupModal
          url={CALENDLY_URL}
          open={open}
          onModalClose={() => setOpen(false)}
          rootElement={rootEl}
          pageSettings={{ hideGdprBanner: true }}
        />
      )}
    </>
  );
}
