import { SkilledWorkerView } from "./skilledView";
import { ChangeEvent, useEffect, useState } from "react";
import { ExtendedMarker } from "../player/interfaces/interfaces";
import { ProgressProps } from "react-video-player-extended";
import { ExtendedExport } from "./interfaces";
import { CallbackProps, Table } from "../../components/table";

const SkilledWorkerContainer = (): JSX.Element => {
  const [url, _setUrl] = useState<string>("");
  const [play, setPlay] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const [video, setVideo] = useState<HTMLVideoElement | null>();

  const [markers, setMarkers] = useState<ExtendedMarker[]>();

  const [json, setJson] = useState<ExtendedExport>();
  const [end, setEnd] = useState<number | null>(null);

  const handleOnProgress = (_e: Event, _progress: ProgressProps): void => {};

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const jsonContent = reader.result as string;
          const parsedData = JSON.parse(jsonContent) as ExtendedExport;
          setJson(parsedData);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePlay = (data: CallbackProps) => {
    if (video) {
      video.currentTime = data.start;
      video.play();
    }

    setEnd(data.end);
  };

  const handleTimeUpdate = () => {
    if (video) {
      console.log(` ${video.currentTime} and ${end} `);
      if (video.currentTime > (end ?? video.duration)) {
        video.pause();
      }
    }
  };

  const handleEnd = () => {
    console.log("this runs x1");
    setEnd(video != null ? video.duration : null);
  };

  useEffect(() => {
    video?.addEventListener("timeupdate", handleTimeUpdate);
    video?.addEventListener("pause", handleEnd);

    return () => {
      video?.removeEventListener("timeupdate", handleTimeUpdate);
      video?.removeEventListener("pause", handleEnd);
    };
  }, [video, end]);

  const handleVideo = (event: React.SyntheticEvent<HTMLVideoElement, Event>) =>
    setVideo(event.currentTarget);

  useEffect(() => {
    if (json) {
      setMarkers(json.json);
      _setUrl(json.url);
    }
  }, [json]);

  return (
    <>
      <SkilledWorkerView
        url={url}
        isPlaying={play}
        volume={volume}
        fps={1}
        markers={markers || []}
        timeStart={0}
        onPlay={(): void => setPlay(true)}
        onPause={(): void => setPlay(false)}
        onVolume={(value: number): void => setVolume(value)}
        onProgress={handleOnProgress}
        onMetaReady={handleVideo}
        onMarkerAdded={() => {}}
        onChangeFile={handleFileUpload}
      />
      <Table markers={markers || []} onPlay={handlePlay} />
    </>
  );
};

export { SkilledWorkerContainer };
