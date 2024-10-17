import { useRef, useEffect } from 'react';

export const useHorizontalScroll = (dependencies = []) => {
  const scrollContainerRef = useRef(null);

  const handleWheel = (evt) => {
    if (scrollContainerRef.current && evt.target.closest('.custom-scrollbar-x')) {
      evt.preventDefault();
      scrollContainerRef.current.scrollLeft += evt.deltaY;
    }
  };

  useEffect(() => {
    const attachWheelEvent = () => {
      const container = scrollContainerRef.current;
      if (container) {
        container.addEventListener('wheel', handleWheel, { passive: false });
      }
    };

    attachWheelEvent();
    const timeoutId = setTimeout(attachWheelEvent, 100);
    
    return () => {
      clearTimeout(timeoutId);
      const container = scrollContainerRef.current;
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, dependencies);

  return scrollContainerRef;
};