import { SkilledWorkerView } from "./skilledView";
import { ChangeEvent, useEffect, useState } from "react";
import { ExtendedMarker } from "../player/interfaces/interfaces";
import { ProgressProps } from "react-video-player-extended";
import { ExportedSequence, ExtendedExport, PlayerType } from "./interfaces";
import { CallbackProps, Table } from "./components/table/table";
import { DropdownOption, SkillController } from "./components/skillController";
import { PlayerController } from "./components/playerController";
import { downloadAttachment } from "../player/utils.tsx/downloader";

const SkilledWorkerContainer = (): JSX.Element => {
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

  const onPlayerChanged = (player: PlayerType) => {
    setSeq((prevState) => {
      return [
        ...prevState.map((item) => {
          if (item.id === seqId) {
            return {
              ...item,

              player: player,
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

  const onSkillChanged = (skill: DropdownOption) => {
    setSeq((prevState) => {
      return [
        ...prevState.map((item) => {
          if (item.id === seqId) {
            return {
              ...item,
              skill: skill.value,
            };
          }
          return item;
        }),
      ];
    });
  };

  const getPlayer = (): PlayerType | string => {
    return sequence.find((item) => item.id === seqId)?.player || "";
  };

  const getSkill = (): string => {
    return sequence.find((item) => item.id === seqId)?.skill || "";
  };

  const handleExport = (): void => {
    const exportObj: ExtendedExport = {
      url: url,
      json: sequence,
    };

    downloadAttachment(JSON.stringify(exportObj, null, 2), "export.json");
  };

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
      <Table markers={sequence} onPlay={handlePlay} id={seqId} />
      <PlayerController player={getPlayer()} onChange={onPlayerChanged} />
      <SkillController
        selected={{ label: "", value: getSkill() }}
        options={[
          { label: "Slam", value: "slam" },
          { label: "Stomp", value: "stomp" },
        ]}
        onSelectOption={onSkillChanged}
      />
      <button onClick={handleExport}>{"Export"}</button>
    </>
  );
};

export { SkilledWorkerContainer };
