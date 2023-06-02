import { useEffect, useState } from "react";
import { PlayerView } from "./playerView";
import { ProgressProps } from "react-video-player-extended";
import { Track } from "../analyzer/analytical.entity";
import { Marker } from "react-video-player-extended/dist/marker";
import { TimelineComponent } from "../timeline/timelineContainer";
import { TimelineOptions, TimelineRowStyle } from "animation-timeline-js";
import { createKeyframePairs } from "../timeline/timelineutils";
import {
  ExtendedMarker,
  ExtendedTimelineRow,
  ExtendedTimelineKeyframe,
  keyTypes,
} from "./interfaces/interfaces";
import { downloadAttachment } from "./utils.tsx/downloader";
import { ExtendedExport } from "../skilledWorker/interfaces";
import { fortmatExport } from "./utils.tsx/saveFormat";
import VideoFrameExtractor from "../videoExtractor/videoExtractor";
import { ffmpeg } from "../ffmpegWasm/ffmpeg";
import { metaExtractor } from "../ffmpegWasm/metaExtractor";

// no touchy touchy , will breaky breaky  -_-
//https://media.w3.org/2010/05/bunny/
const PlayerContainer = (): JSX.Element => {
  const [url, _setUrl] = useState<string>("trailer.mp4");
  const [play, setPlay] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const [fps, setFps] = useState<number>(30);
  const [video, setVideo] = useState<HTMLVideoElement | null>();
  const [frame, setFrame] = useState<number>(30);
  const [frames, _setFrames] = useState<number | null>(null);
  const [meta, _setMeta] = useState<Track | null>(null);
  const [markers, setMarkers] = useState<ExtendedMarker[]>();
  const [ids, setIds] = useState<number[]>([]);
  const [duration, setDuration] = useState<number>(0);

  // Position of Time Dragger | ms
  const [position, setPosition] = useState<number>(0); // in ms
  // Current position of player
  const [ct, setCT] = useState<number>(0); // in ms

  // Sync timeline with player
  const [sync, setSync] = useState<boolean>(false);

  // Timeline keys
  const [rows, setRows] = useState<ExtendedTimelineRow[]>([]);

  // Callback helpers
  const handlePlay = (): void => setPlay(true);
  const handlePause = (): void => setPlay(false);
  const handleVolume = (value: number): void => setVolume(value);
  //const handleFps = (value: number): void => setFps(value);

  const handleByFrame = (frame: number) => {
    video && (video.currentTime = frame * (1 / fps));
  };

  // time : milliSeconds
  const handleTimeDragger = (time: number) => {
    setPosition(time);
  };

  // ms / 1000
  useEffect(() => {
    video && (video.currentTime = position / 1000);
  }, [position]);

  const handleOnProgress = (_e: Event, _progress: ProgressProps): void => {
    setCT(_progress.currentTime * 1000);
  };

  const handleSync = () => setSync(!sync);

  const handleVideo = (event: React.SyntheticEvent<HTMLVideoElement, Event>) =>
    setVideo(event.currentTarget);

  // meta data ffmpeg

  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (!ffmpeg.isLoaded()) {
        console.log("loading.....");
        await ffmpeg.load().then(() => handleWarming());
      }
    })();
  }, []);

  const handleWarming = () => {
    if (ffmpeg.isLoaded()) {
      setReady(true);
    }
  };

  // TODO :: extraction of meta with ffmpeg-wasm
  useEffect(() => {
    (async () => {
      const [_duration, fps, _tota] = await metaExtractor(url);

      setFps(fps);
    })();
  }, [ready]);

  /////////

  const handleMeta = async () => {
    // const res = await fetch("http://localhost:3000/", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json", mode: "cors" },
    //   body: JSON.stringify({ url: url }),
    // });
    // const data: Root = await res.json();
    // setMeta(data.media.track[1]);
    // data.media.track[1].FrameRate &&
    //   setFps(parseInt(data.media.track[1].FrameRate));
    // data.media.track[1].FrameRate &&
    //   setFrames(parseInt(data.media.track[1].FrameCount));
    // setDuration(parseFloat(data.media.track[1].Duration));
  };

  const handleMarkers = (marker: Marker) => {
    const extendedMarker: ExtendedMarker = {
      type: item,
      ...marker,
    };

    setMarkers((prev) => [...(prev || []), extendedMarker]);
  };

  useEffect(() => {
    // prep for timeline

    if (markers) {
      const keyframes = createKeyframePairs(markers);

      setRows(keyframes || []);
    }
  }, [markers]);

  const removeMarkers = () => {
    ids.forEach((id) => {
      setMarkers((prev) => prev?.filter((marker) => marker.id !== id));
    });
  };

  const handleSelection = (frames: ExtendedTimelineKeyframe[]): void => {
    const idsAr: number[] = frames.map((obj) => parseInt(obj.id));

    setIds(idsAr);
  };

  const options = {
    id: "timeline",
    rowsStyle: {
      height: 100,
    } as TimelineRowStyle,
    snapEnabled: false,
  } as TimelineOptions;

  // pulling metadata n sets when video is loaded
  useEffect(() => {
    handleMeta();

    setDuration(video?.duration || 0);
  }, [video]);

  // timeline

  const sideBar: keyTypes[] = ["start", "main", "end"];

  const handleItemSelection = (item: keyTypes) => {
    setItem(item);
  };

  const [item, setItem] = useState<keyTypes>("start");

  const handleTimelineDrag = (keyframes: ExtendedTimelineKeyframe[]) => {
    keyframes.forEach((key) => {
      const { id, val } = key;

      setMarkers((prevState) =>
        prevState?.map((marker) =>
          marker.id.toString() === id ? { ...marker, time: val / 1000 } : marker
        )
      );
      setPosition(val);
    });
  };

  const handleExports = (): void => {
    const exportJson: ExtendedExport = fortmatExport(url, markers || []);

    downloadAttachment(JSON.stringify(exportJson, null, 2), "export.json");
  };

  // Key handlers

  const handleMarkRemoval = (ev: KeyboardEvent): void => {
    if (ev.code == "Delete") removeMarkers();
  };

  // Key Events

  useEffect(() => {
    document.addEventListener("keydown", handleMarkRemoval);

    return () => {
      document.removeEventListener("keydown", handleMarkRemoval);
    };
  }, [handleMarkRemoval]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const calculatePlayerTime = (
    totalDuration: number,
    totalFrames: number,
    clickedFrameIndex: number
  ): void => {
    const durationPerFrame: number = totalDuration / totalFrames;
    const playerTime: number = durationPerFrame * (clickedFrameIndex - 1);

    handleRanOutOfNames(playerTime);
  };

  const calculateCurrentFrameIndex = (frames: number): number => {
    const currentTime = () => {
      const marker = markers?.find((marker) => ids.includes(marker.id));
      return marker ? marker.time : 0;
    };

    const durationPerFrame: number = duration / frames;
    const currentFrameIndex: number = Math.ceil(
      currentTime() / durationPerFrame
    );
    return currentFrameIndex;
  };

  const handleRanOutOfNames = (adjusted: number) => {
    const updatedMarkers = markers?.map((marker) =>
      ids.includes(marker.id) ? { ...marker, time: adjusted } : marker
    );
    setMarkers(updatedMarkers);
    setPosition(adjusted * 1000);
  };

  return (
    <>
      <PlayerView
        url={url}
        isPlaying={play}
        volume={volume}
        markers={markers ?? []}
        onPlay={handlePlay}
        onPause={handlePause}
        onVolume={handleVolume}
        fps={fps}
        onMetaReady={handleVideo}
        onProgress={handleOnProgress}
        onMarkerAdded={handleMarkers}
      />

      <input
        type="text"
        value={frame}
        onChange={(data) => setFrame(parseInt(data.currentTarget.value))}
      />
      <div>{meta?.FrameRate}</div>
      <span> {`/ ${frames}`}</span>
      <span> {`duration :  ${duration}`}</span>
      <button onClick={() => handleByFrame(frame)}>{`shift`}</button>
      <button onClick={() => handleMeta()}>{"get meta"}</button>

      <button onClick={() => removeMarkers()}>{"remove"}</button>
      <button onClick={() => handleExports()}>{"save"}</button>
      <button onClick={() => handleClick()}>{"adjust by frames"}</button>
      <input type="checkbox" onChange={handleSync} />

      {isDialogOpen && (
        <dialog open={isDialogOpen} onClose={handleClose}>
          <VideoFrameExtractor
            url={url}
            ClickOnFrame={(totalFrames: number, clickedFrameIndex: number) =>
              calculatePlayerTime(duration, totalFrames, clickedFrameIndex)
            }
            getCurrentIndex={calculateCurrentFrameIndex}
          />
          <button onClick={handleClose}>Close</button>
        </dialog>
      )}

      <TimelineComponent
        time={sync ? ct : position}
        model={{ rows: rows }}
        options={options}
        onTimeChange={handleTimeDragger}
        rows={sideBar}
        item={item}
        onRowSelected={handleItemSelection}
        onTimelineDrag={handleTimelineDrag}
        onTimelineSelected={handleSelection}
      />
    </>
  );
};

export { PlayerContainer };
