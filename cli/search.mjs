import { program } from "commander";
import { getCamaraRecords } from "../shared/getCameraRecords.mjs";

const searchCameraDataByName = (cameraData, name) => {
  const searchName = name.toLowerCase();
  const cameraDataLoctation = cameraData.location.toLowerCase();
  return cameraDataLoctation.includes(searchName);
};

const formatCameraRecordToOutput = (cameraRecord) =>
  `${cameraRecord.number} | ${cameraRecord.identifier} ${cameraRecord.location} | ${cameraRecord.latitude} | ${cameraRecord.longitude}`;

const main = async () => {
  // init
  program
    .name("search")
    .description(
      "CLI tool to search for cameras in Utrecht for Keep Talking and Everybody Codes"
    )
    .version("0.1.0");

  // define arguments
  program.option("--name");

  try {
    // parse arguments
    program.parse();

    // get options from arguments
    const options = program.opts();

    // validate input, see if name is provided
    if (!options.name) {
      throw new Error("Please provide a name to initiate a search.");
    }

    // validate input, see if a valid name is provided
    const name = program.args[0];
    if (!name || name.length === 0) {
      throw new Error(
        "Please provide atleast 1 character to initiate a search."
      );
    }

    // get records from csv file
    const cameraRecords = await getCamaraRecords();

    // search records for matches with user provided name
    const matchingCameraRecords = cameraRecords.filter((record) =>
      searchCameraDataByName(record, name)
    );

    // format matching camera records to output
    const formattedCameraRecords = matchingCameraRecords
      .map(formatCameraRecordToOutput)
      .join("\n");

    // output results
    console.log(formattedCameraRecords);
  } catch (error) {
    console.error(error.message);
  }
};

main();
