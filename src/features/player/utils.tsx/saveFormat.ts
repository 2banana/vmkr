import { ExtendedExport } from "../../skilledWorker/interfaces";
import { ExtendedMarker, keyTypes } from "../interfaces/interfaces";
import { v4 as uuidv4 } from "uuid";

const fortmatExport = (url: string, markers: ExtendedMarker[]) => {
  const exportJSon: ExtendedExport = {
    url: url,
    json: [],
  };

  for (let i = 0; i < markers.length - 1; i += 2) {
    const from = markers[i];
    const to = markers[i + 1];

    const identicalType = (): keyTypes => {
      if (from.type && to.type != null) {
        return from.type === to.type ? to.type : "start";
      }

      return "start";
    };

    exportJSon.json.push({
      id: getUid(),
      type: identicalType(),
      status: "pending",
      from: { id: from.id, time: from.time, title: from.title },
      to: { id: to.id, time: to.time, title: to.title },
    });
  }

  return exportJSon;
};

// uuid for now
// could use db UIDs
const getUid = (): string => uuidv4();

export { fortmatExport };
