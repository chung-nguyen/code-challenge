import React, { useRef, useEffect, useState } from 'react';

interface AutoFitTextProps {
  text: string;
  minFontSize?: number;
  maxFontSize?: number;
  className?: string;
}

export const AutoFitText: React.FC<AutoFitTextProps> = ({
  text,
  minFontSize = 10,
  maxFontSize = 16,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  const fitText = () => {
    if (!containerRef.current || !textRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;

    // Try decreasing font size until it fits
    let size = maxFontSize;
    textRef.current.style.fontSize = `${size}px`;

    while (
      textRef.current.scrollWidth > containerWidth &&
      size > minFontSize
    ) {
      size -= 1;
      textRef.current.style.fontSize = `${size}px`;
    }

    setFontSize(size);
  };

  useEffect(() => {
    fitText();
    window.addEventListener('resize', fitText);
    return () => window.removeEventListener('resize', fitText);
  }, [text, maxFontSize]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div
        ref={textRef}
        className="whitespace-nowrap"
        style={{ fontSize: `${fontSize}px`, lineHeight: 1 }}
      >
        {text}
      </div>
    </div>
  );
};