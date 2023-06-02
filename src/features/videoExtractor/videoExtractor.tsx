import { useEffect, useState } from "react";
import { fetchFile } from "@ffmpeg/ffmpeg";
import { ProgressComponent } from "./progressIndicator";
import { Scrubber } from "./Scrubber/scrubber";
import { ffmpeg } from "../ffmpegWasm/ffmpeg";

interface ExtractorProps {
  url: string;

  ClickOnFrame: (totalFrames: number, clickedFrameIndex: number) => void;
  getCurrentIndex: (frames: number) => number;
}

const VideoFrameExtractor = ({
  url,
  ClickOnFrame,
  getCurrentIndex,
}: ExtractorProps): JSX.Element => {
  const [ratio, setRatio] = useState<number>(0);

  const [frames, setFrames] = useState<string[]>([]);
  const [ready, setReady] = useState<boolean>(ffmpeg.isLoaded());
  const [currentFrameIndex, setFI] = useState<number>(0);

  useEffect(() => {
    setFI(getCurrentIndex(frames.length));
  }, [frames]);

  ffmpeg.setProgress((data) => {
    setRatio(data.ratio);
  });

  useEffect(() => {
    console.log(`Current Index : ${currentFrameIndex}`);
  }, [currentFrameIndex]);

  useEffect(() => {
    (async () => {
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load().then(() => handleWarming());
      }
    })();
  }, []);

  const handleWarming = () => {
    if (ffmpeg.isLoaded()) {
      setReady(true);
    }
  };

  const extractFrames = async () => {
    ffmpeg.FS(
      "writeFile",
      "input.mp4",
      await fetchFile(`${"http://localhost:5173/" + url}`)
    );
    await ffmpeg.run("-i", "input.mp4", "output_%d.jpg");

    const files = ffmpeg.FS("readdir", "/");
    const extractedFrames = files.filter((file) => file.startsWith("output_"));
    const frameUrls = extractedFrames.map((frame) =>
      URL.createObjectURL(new Blob([ffmpeg.FS("readFile", frame)]))
    );

    setFrames(frameUrls);
  };

  useEffect(() => {
    handleVideoPlay();
  }, [ready]);

  const handleVideoPlay = () => {
    console.log("running");
    extractFrames();
  };

  if (!ready) {
    return <>{"loading..."}</>;
  }

  return (
    <div>
      {frames.length > 0 && (
        <div>
          <Scrubber
            frames={frames}
            frameIndex={currentFrameIndex}
            onFrame={(index) => ClickOnFrame(frames.length, index)}
          />
        </div>
      )}
      {frames.length === 0 && (
        <div>
          <h3>No frames extracted.</h3>
        </div>
      )}
      {ratio < 1 ? <ProgressComponent ratio={ratio} /> : null}
    </div>
  );
};

export default VideoFrameExtractor;
