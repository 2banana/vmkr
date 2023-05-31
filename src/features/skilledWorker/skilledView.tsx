import VideoPlayer from "react-video-player-extended";
import { SkilledProps } from "./interfaces";

const SkilledWorkerView = (props: SkilledProps): JSX.Element => {



  return (
    <>
      <VideoPlayer
        markerConfiguration={{ color: "#800000", selectionColor: "#FFFF00" }}
        markers={props.markers}
        fps={props.fps}
        url={props.url}
        timeStart={props.timeStart}
        isPlaying={props.isPlaying}
        volume={props.volume}
        onPlay={props.onPlay}
        onPause={props.onPause}
        onVolume={props.onVolume}
        onProgress={props.onProgress}
        onLoadedMetadata={(data) => props.onMetaReady(data)}
        controls={[
          "Play",
          "Time",
          "Progress",
          "Volume",
          "FullScreen",
         // "AddMarker",
         // "ExportMarkers",
        ]}
        viewSettings={["Title", "FPS", "Repeat", "StartTime", "Volume"]}
      />
      <input type="file" onChange={(ev) => props.onChangeFile(ev)} />
    </>
  );
};

export { SkilledWorkerView };
