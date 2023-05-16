import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { parse, transform } from "csv/sync";

export const getCameraDataFromFile = async (filePath) => {
  if (!filePath || typeof filePath !== "string" || filePath.length === 0) {
    throw new Error("Invalid file path in getCameraData.");
  }

  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const fileContent = await fs.readFile(`${__dirname}${filePath}`);
    return fileContent;
  } catch (error) {
    throw new Error("Unable to read file in getCameraData.");
  }
};

export const sanitizeLocation = (rawLocation) => {
  if (!rawLocation) {
    return "";
  }

  const location = rawLocation.trim();

  // location sometimes starts with a hyphen, remove if so
  if (location.charAt(0) === "-") {
    return location.substring(1);
  }

  return location;
};

export const extractCameraRecordFromRawCameraRecord = (rawCameraRecord) => {
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
  }

  return null;
};

export const removeInvalidCameraRecord = (cameraRecord) =>
  cameraRecord !== null;

export const getCamaraRecords = async () => {
  try {
    const rawCameraRecords = parse(
      await getCameraDataFromFile("/data/cameras-defb.csv")
    );

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
