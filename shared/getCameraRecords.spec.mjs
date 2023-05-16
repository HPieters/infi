import {
  getCameraDataFromFile,
  sanitizeLocation,
  extractCameraRecordFromRawCameraRecord,
  removeInvalidCameraRecord,
  getCamaraRecords,
} from "./getCameraRecords.mjs";

describe("getCameraDataFromFile", () => {
  it("should read the camera data file successfully", async () => {
    const mockData = `Camera;Latitude;Longitude\nUTR-CM-501 Neude rijbaan voor Postkantoor;52.093421;5.118278\n`;
    // Call the function and check the returned data
    const result = await getCameraDataFromFile("/__test__/cameras-defb.csv");
    expect(result.toString()).toBe(mockData);
  });

  it("should throw an error if there is an invalid filePath", async () => {
    // Call the function and expect it to throw an error
    await expectAsync(getCameraDataFromFile()).toBeRejectedWithError(
      "Invalid file path in getCameraData."
    );
    await expectAsync(getCameraDataFromFile(undefined)).toBeRejectedWithError(
      "Invalid file path in getCameraData."
    );
    await expectAsync(getCameraDataFromFile(null)).toBeRejectedWithError(
      "Invalid file path in getCameraData."
    );
    await expectAsync(getCameraDataFromFile([])).toBeRejectedWithError(
      "Invalid file path in getCameraData."
    );
    await expectAsync(getCameraDataFromFile({})).toBeRejectedWithError(
      "Invalid file path in getCameraData."
    );
    await expectAsync(getCameraDataFromFile("")).toBeRejectedWithError(
      "Invalid file path in getCameraData."
    );
  });

  it("should throw an error if there is an issue reading the file", async () => {
    // Call the function and expect it to throw an error
    await expectAsync(
      getCameraDataFromFile("fake-file.csv")
    ).toBeRejectedWithError("Unable to read file in getCameraData.");
  });
});

describe("sanitizeLocation", () => {
  it("should return an empty string if rawLocation is falsy", () => {
    expect(sanitizeLocation(null)).toEqual("");
    expect(sanitizeLocation(undefined)).toEqual("");
    expect(sanitizeLocation("")).toEqual("");
    expect(sanitizeLocation(0)).toEqual("");
    expect(sanitizeLocation(false)).toEqual("");
  });

  it("should trim the raw location", () => {
    const rawLocation = "  Camera Location  ";
    const expectedLocation = "Camera Location";
    const result = sanitizeLocation(rawLocation);
    expect(result).toEqual(expectedLocation);
  });

  it("should remove leading hyphen from location", () => {
    expect(sanitizeLocation("-Location1")).toEqual("Location1");
    expect(sanitizeLocation("--Location2")).toEqual("-Location2");
  });

  it("should return the location as is if it does not start with a hyphen", () => {
    expect(sanitizeLocation("Location3")).toEqual("Location3");
    expect(sanitizeLocation(" Location4 ")).toEqual("Location4");
  });
});

describe("extractCameraRecordFromRawCameraRecord", () => {
  it("should extract camera record correctly from raw camera record", () => {
    const rawCameraRecord = "UTR-CM-123 Camera Location;12.345;-67.890";
    const expectedCameraRecord = {
      number: "123",
      identifier: "UTR-CM-123",
      location: "Camera Location",
      latitude: "12.345",
      longitude: "-67.890",
    };

    const result = extractCameraRecordFromRawCameraRecord(rawCameraRecord);
    expect(result).toEqual(expectedCameraRecord);
  });

  it("should return null for invalid raw camera record", () => {
    const rawCameraRecord = "Invalid Record";
    const result = extractCameraRecordFromRawCameraRecord(rawCameraRecord);
    expect(result).toBeNull();
  });
});

describe("removeInvalidCameraRecord", () => {
  it("should remove invalid camera record", () => {
    const cameraRecords = [
      {
        number: "501",
        identifier: "UTR-CM-501",
        location: "Neude rijbaan voor Postkantoor",
        latitude: "52.093421",
        longitude: "5.118278",
      },
      null,
      {
        number: "502",
        identifier: "UTR-CM-502",
        location: "Potterstraat / Loeff Berchmakerstraat",
        latitude: "52.093599",
        longitude: "5.118325",
      },
    ];

    const expectedRecords = [
      {
        number: "501",
        identifier: "UTR-CM-501",
        location: "Neude rijbaan voor Postkantoor",
        latitude: "52.093421",
        longitude: "5.118278",
      },
      {
        number: "502",
        identifier: "UTR-CM-502",
        location: "Potterstraat / Loeff Berchmakerstraat",
        latitude: "52.093599",
        longitude: "5.118325",
      },
    ];

    const result = cameraRecords.filter(removeInvalidCameraRecord);
    expect(result).toEqual(expectedRecords);
  });
});

describe("getCamaraRecords", () => {
  it("should return valid camera records", async () => {
    const result = await getCamaraRecords();

    const expectedRecords = [
      {
        number: "501",
        identifier: "UTR-CM-501",
        location: "Neude rijbaan voor Postkantoor",
        latitude: "52.093421",
        longitude: "5.118278",
      },
    ];

    expect(result[0]).toEqual(expectedRecords[0]);
  });
});
