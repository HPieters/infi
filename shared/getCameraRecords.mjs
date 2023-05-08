import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { parse, transform } from "csv/sync";

const getCameraDataFromFile = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return fs.readFile(`${__dirname}/data/cameras-defb.csv`);
  } catch (error) {
    throw new Error("Unable to read file in getCameraData.");
  }
};

const sanitizeLocation = (rawLocation) => {
  if (!rawLocation) {
    return "";
  }
  const location = rawLocation.trim();

  if (location.charAt(0) === "-") {
    return location.substring(1);
  }

  return location;
};

const extractCameraRecordFromRawCameraRecord = (rawCameraRecord) => {
  const regex = /^UTR-CM-(\d+)\s*(.*?);(.*?);(.*$)/;
  const match = rawCameraRecord.match(regex);
  if (match) {
    return {
      number: match[1],
      identifier: `UTR-CM-${match[1]}`,
      location: sanitizeLocation(match[2]),
      latitude: match[3],
      longitude: match[4],
    };
  } else {
    return null;
  }
};

const removeInvalidCameraRecord = (cameraRecord) => cameraRecord !== null;

export const getCamaraRecords = async () => {
  try {
    const rawCameraRecords = parse(await getCameraDataFromFile());

    // transform raw record into data structure and flatten the sub-array elements
    const cameraRecords = transform(rawCameraRecords, (data) =>
      data.map(extractCameraRecordFromRawCameraRecord)
    ).flat();

    // remove any invalid camera records
    return cameraRecords.filter(removeInvalidCameraRecord);
  } catch (e) {
    throw new Error("Unable to get camera records.");
  }
};
