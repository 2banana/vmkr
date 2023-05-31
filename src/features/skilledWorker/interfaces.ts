import { ChangeEvent } from "react";
import { ProgressProps } from "react-video-player-extended";
import { Marker } from "react-video-player-extended/dist/marker";
import { ExtendedMarker, keyTypes } from "../player/interfaces/interfaces";

interface SkilledProps {
  url: string;
  isPlaying: boolean;
  volume: number;
  fps: number;
  markers: Marker[];
  timeStart: number;

  onPlay: () => void;
  onPause: () => void;
  onVolume: (volume: number) => void;
  onProgress: (e: Event, progress: ProgressProps) => void | null;
  onMetaReady: (event: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  onMarkerAdded: (marker: Marker) => void;
  onChangeFile: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface ExtendedExport {
  url: string;
  json: ExportedSequence[];
}

interface ExportedSequence {
  id: string;
  type: keyTypes;
  skill?: string;
  player?: PlayerType;
  status?: StatusType;
  from: ExtendedMarker;
  to: ExtendedMarker;
}

type StatusType = "accepted" | "rejected" | "pending";
type PlayerType = "rp" | "bp";

interface ModifyingData {
  status: StatusType;
  player: PlayerType;
  skill: string;
}

export type {
  SkilledProps,
  ExtendedExport,
  ExportedSequence,
  StatusType,
  PlayerType,
  ModifyingData,
};
