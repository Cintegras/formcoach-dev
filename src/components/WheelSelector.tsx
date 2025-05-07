import React, {useEffect, useRef, useState} from 'react';

interface WheelSelectorProps {
  values: (string | number)[];
  initialValue?: string | number;
  onChange: (value: string | number) => void;
  height?: number;
  itemHeight?: number;
}

const WheelSelector: React.FC<WheelSelectorProps> = ({
  values,
  initialValue,
  onChange,
  height = 200,
  itemHeight = 40,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const initialIndex = initialValue !== undefined 
      ? values.findIndex(v => v === initialValue)
      : Math.floor(values.length / 2);

    return initialIndex >= 0 ? initialIndex : 0;
  });

    const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleItems = Math.floor(height / itemHeight);
  const halfVisibleItems = Math.floor(visibleItems / 2);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    // Prevent page scrolling
    e.preventDefault();
  };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartY(e.clientY);
    e.preventDefault();
  };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;

        const deltaY = e.touches[0].clientY - startY;
    handleScroll(deltaY);
    setStartY(e.touches[0].clientY);
    // Prevent page scrolling
    e.preventDefault();
  };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

        const deltaY = e.clientY - startY;
    handleScroll(deltaY);
    setStartY(e.clientY);
  };

    const handleEnd = () => {
    if (!isDragging) return;

        setIsDragging(false);

        // Snap to closest item
    const index = Math.round(scrollY / itemHeight * -1);
    const boundedIndex = Math.max(0, Math.min(values.length - 1, index));

        setSelectedIndex(boundedIndex);
    setScrollY(boundedIndex * itemHeight * -1);

        // Call onChange with the selected value
    onChange(values[boundedIndex]);
  };

    const handleScroll = (deltaY: number) => {
    const newScrollY = scrollY + deltaY;
    const maxScroll = 0;
    const minScroll = (values.length - 1) * itemHeight * -1;

        const boundedScrollY = Math.min(maxScroll, Math.max(minScroll, newScrollY));
    setScrollY(boundedScrollY);
  };

    // Update scroll position when selectedIndex changes
  useEffect(() => {
    setScrollY(selectedIndex * itemHeight * -1);
  }, [selectedIndex, itemHeight]);

    // Update selected value when initialValue changes
  useEffect(() => {
    if (initialValue !== undefined) {
      const newIndex = values.findIndex(v => v === initialValue);
      if (newIndex >= 0 && newIndex !== selectedIndex) {
        setSelectedIndex(newIndex);
      }
    }
  }, [initialValue, values, selectedIndex]);

    return (
    <div 
      className="relative overflow-hidden"
      style={{ height: `${height}px` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      // Prevent page scrolling when wheel is used
      onWheel={(e) => e.preventDefault()}
    >
      <div 
        ref={containerRef}
        className="absolute left-0 right-0 transition-transform"
        style={{
          transform: `translateY(${scrollY + (height / 2 - itemHeight / 2)}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s'
        }}
      >
        {values.map((value, index) => (
          <div
            key={index}
            className={`flex items-center justify-center text-2xl ${
              index === selectedIndex 
                ? 'text-[#00C4B4] font-bold text-3xl' 
                : 'text-[#A4B1B7]'
            }`}
            style={{ height: `${itemHeight}px` }}
          >
            {value}
          </div>
        ))}
      </div>

        {/* Selection indicator */}
      <div className="absolute left-0 right-0 pointer-events-none" style={{ 
        top: `${height / 2 - itemHeight / 2}px`,
        height: `${itemHeight}px`
      }}>
        <div className="h-full border-t border-b border-[#00C4B4]/30"></div>
      </div>
    </div>
  );
};

export default WheelSelector;
