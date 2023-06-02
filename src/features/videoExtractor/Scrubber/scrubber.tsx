import { useEffect, useRef, useState } from "react";
import "./scrubber.css";

interface ScrubberProps {
  frames: string[];
  frameIndex: number;
  onFrame: (index: number) => void;
}

const Scrubber = ({ frames, frameIndex, onFrame }: ScrubberProps) => {
  const [currentIndex, setCurrentIndex] = useState(frameIndex);

  const contentRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLLIElement[]>([]);

  const [scrollInterval, setScrollInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  const scrollToCurrentFrame = () => {
    if (indexRef.current[frameIndex]) {
      indexRef.current[frameIndex].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const scrollToSpecificFrame = () => {
    if (indexRef.current[currentIndex]) {
      indexRef.current[currentIndex].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const startScrollLeft = () => {
    const interval = setInterval(() => {
      if (contentRef.current) {
        contentRef.current.scrollLeft -= 20;
      }
    }, 50);

    setScrollInterval(interval);
  };

  const stopScrollLeft = () => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      setScrollInterval(null);
    }
  };

  const startScrollRight = () => {
    const interval = setInterval(() => {
      if (contentRef.current) {
        contentRef.current.scrollLeft += 20;
      }
    }, 50);

    setScrollInterval(interval);
  };

  const stopScrollRight = () => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      setScrollInterval(null);
    }
  };

  useEffect(() => {
    scrollToCurrentFrame();
    setCurrentIndex(frameIndex);
  }, [frameIndex]);

  return (
    <>
      <div className="scrubber-interface">
        <div className="scrubber-container">
          <div className="scrubber-frame">
            <button
              onMouseDown={startScrollLeft}
              onMouseUp={stopScrollLeft}
              onMouseLeave={stopScrollLeft}
            >
              {"<"}
            </button>
            <div ref={contentRef} className="frame-scroll">
              <ul className="frame-list">
                {frames.map((frameUrl, index) => (
                  <li
                    ref={(ref) => ref && (indexRef.current[index] = ref)}
                    key={index}
                    className={index === currentIndex ? "active" : ""}
                  >
                    <img
                      src={frameUrl}
                      onClick={() => onFrame(index)}
                      alt={`Frame ${index}`}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <button
              onMouseDown={startScrollRight}
              onMouseUp={stopScrollRight}
              onMouseLeave={stopScrollRight}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
      <input
        style={{ width: "30px" }}
        type="text"
        value={currentIndex}
        onChange={(data) => setCurrentIndex(parseInt(data.currentTarget.value))}
      />
      <button onClick={scrollToSpecificFrame}> {"seek"}</button>
    </>
  );
};
export { Scrubber };
