import { useEffect, useState } from "react";
import { Scrubber } from "./Scrubber/scrubber";
import { Frames } from "./extractResponse";

interface ExtractorProps {
  url: string;

  ClickOnFrame: (adjusted: number) => void;
  getCurrentMarkerTime: () => number;
}

interface Dto {
  url: string;
}

const VideoFrameExtractor = ({
  ClickOnFrame,
  getCurrentMarkerTime,
}: ExtractorProps): JSX.Element => {
  const [response, setResponse] = useState<Frames | null>(null);

  const [frames, setFrames] = useState<string[]>([]);

  const [index, setIndex] = useState<number>(0);

  const onFrameClick = (): void => {
    if (response) {
      const durationPerFrame: number = response.duration / response.frames;
      const playerTime: number = durationPerFrame * (index + 1);

      const roundedPlayerTime: number = Math.round(playerTime * 1000) / 1000;
      ClickOnFrame(roundedPlayerTime);
    }
  };

  const getSelectedFrameFromMarker = (): number => {
    if (response) {
      const durationPerFrame: number = response.duration / response.frames;

      return Math.ceil(getCurrentMarkerTime() / durationPerFrame);
    }

    return 0;
  };

  const extractFrames = async () => {
    try {
      const dto: Dto = {
        url: "https://media.w3.org/2010/05/bunny/trailer.mp4",
      };

      const response = await fetch(
        "http://localhost:3000/frames/extract-frames",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dto),
        }
      );

      const data = await response.json();
      setResponse(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const generateImagePaths = (): void => {
    const imagePaths = [];

    if (response) {
      for (let i = 1; i < response.frames; i++) {
        const imagePath = `http://localhost:3000/output/${response.id}/${i}.jpg`;
        imagePaths.push(imagePath);
      }
    }

    setFrames(imagePaths);
  };

  useEffect(() => {
    response && setIndex(getSelectedFrameFromMarker);
    generateImagePaths();
  }, [response]);

  useEffect(() => {
    onFrameClick();
  }, [index]);

  useEffect(() => {
    extractFrames();
  }, []);

  return (
    <div>
      {response && response.frames > 0 && (
        <div>
          <Scrubber frames={frames} frameIndex={index} onFrame={setIndex} />
        </div>
      )}
      {response && response.frames === 0 && (
        <div>
          <h3>No frames extracted.</h3>
        </div>
      )}
    </div>
  );
};

export default VideoFrameExtractor;
