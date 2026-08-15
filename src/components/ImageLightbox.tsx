import { useEffect, useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  title: string;
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const CONTROL_CLASSES =
  'inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/15 ' +
  'text-white/60 hover:text-white hover:border-white/30 transition-colors duration-200 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40';

export default function ImageLightbox({
  images,
  title,
  index,
  onIndexChange,
  onClose,
}: ImageLightboxProps) {
  const open = index !== null;

  // Retain the last shown image so the closing transition has something to render.
  const [lastIndex, setLastIndex] = useState(0);
  if (index !== null && index !== lastIndex) setLastIndex(index);
  const activeIndex = index ?? lastIndex;

  useEffect(() => {
    if (index === null || images.length < 2) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onIndexChange((index! - 1 + images.length) % images.length);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onIndexChange((index! + 1) % images.length);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [index, images.length, onIndexChange]);

  return (
    <Dialog.Root
      modal
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop
          className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity duration-200
            data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none"
        />

        <Dialog.Viewport className="fixed inset-0 flex items-center justify-center p-4 sm:p-8">
          <Dialog.Popup
            className="relative flex flex-col items-center gap-5 outline-none transition-opacity duration-200
              data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none"
          >
            <Dialog.Title className="sr-only">
              {`${title} — image ${activeIndex + 1} of ${images.length}`}
            </Dialog.Title>

            <Dialog.Close
              aria-label="Close larger view"
              className={`fixed top-4 right-4 sm:top-6 sm:right-6 z-10 ${CONTROL_CLASSES}`}
            >
              <X size={18} />
            </Dialog.Close>

            <img
              src={images[activeIndex]}
              alt={`${title} — image ${activeIndex + 1}`}
              className="max-w-[90vw] max-h-[76vh] w-auto h-auto rounded-xl border border-white/15"
            />

            {images.length > 1 && (
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() => onIndexChange((activeIndex - 1 + images.length) % images.length)}
                  className={CONTROL_CLASSES}
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="text-[11px] uppercase tracking-[0.15em] font-body text-white/40 tabular-nums">
                  {activeIndex + 1} / {images.length}
                </span>

                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => onIndexChange((activeIndex + 1) % images.length)}
                  className={CONTROL_CLASSES}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
