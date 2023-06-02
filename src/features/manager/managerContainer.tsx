import { useState, ChangeEvent, useEffect } from "react";
import { ProgressProps } from "react-video-player-extended";
import { ExtendedMarker } from "../player/interfaces/interfaces";
import { downloadAttachment } from "../player/utils.tsx/downloader";
import { CallbackProps, Table } from "../skilledWorker/components/table/table";
import {
  ExportedSequence,
  ExtendedExport,
  SkilledProps,
  StatusType,
} from "../skilledWorker/interfaces";
import { ManagerView } from "./managerView";
import { StatusController } from "../skilledWorker/components/statusController";

interface ManagerProps extends SkilledProps {
  onExport: () => void;
}

const ManagerContainer = (): JSX.Element => {
  const [url, _setUrl] = useState<string>("");
  const [play, setPlay] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const [video, setVideo] = useState<HTMLVideoElement | null>();

  const [markers, setMarkers] = useState<ExtendedMarker[]>();
  const [sequence, setSeq] = useState<ExportedSequence[]>([]);

  const [json, setJson] = useState<ExtendedExport>();
  const [end, setEnd] = useState<number | null>(null);

  const [seqId, setSeqId] = useState<string>("");

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
    setSeqId(data.id);
  };

  const handleTimeUpdate = () => {
    if (video) {
      if (video.currentTime > (end ?? video.duration)) {
        video.pause();
      }
    }
  };

  const handleEnd = () => {
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
      const extractedMarkers = json.json.flatMap((item: ExportedSequence) => [
        {
          type: item.type,
          id: item.from.id,
          time: item.from.time,
          title: item.from.title,
        },
        {
          type: item.type,
          id: item.to.id,
          time: item.to.time,
          title: item.to.title,
        },
      ]);

      setMarkers(extractedMarkers);
      setSeq(json.json);
      _setUrl(json.url);
    }
  }, [json]);

  const onPlayerChanged = (id: string, status: StatusType) => {
    setSeqId(id);
    setSeq((prevState) => {
      return [
        ...prevState.map((item) => {
          if (item.id === id) {
            return {
              ...item,

              status: status,
            };
          }
          return item;
        }),
      ];
    });
  };

  useEffect(() => {
    console.log(`sequence : ${JSON.stringify(sequence)}`);
  }, [sequence]);

  const handleExport = (): void => {
    const exportObj: ExtendedExport = {
      url: url,
      json: sequence,
    };

    downloadAttachment(JSON.stringify(exportObj, null, 2), "export.json");
  };

  const statusColumnRenderer = (marker: ExportedSequence) => {
    return (
      <StatusController
        status={marker.status}
        onChange={onPlayerChanged}
        id={marker.id}
      />
    );
  };

  return (
    <>
      <ManagerView
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
        onExport={handleExport}
      />
      <Table
        markers={sequence}
        onPlay={handlePlay}
        id={seqId}
        renderStatusColumn={statusColumnRenderer}
      />
    </>
  );
};

export { ManagerContainer };
export type { ManagerProps };
