import Fastify from "fastify";
import cors from "@fastify/cors";

import { getCamaraRecords } from "../shared/getCameraRecords.mjs";

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: (origin, cb) => {
    const hostname = new URL(origin).hostname;
    if (hostname === "localhost") {
      //  Request from localhost will pass
      cb(null, true);
      return;
    }
    // Generate an error on other origins, disabling access
    cb(new Error("Not allowed"), false);
  },
});

// Declare a route
fastify.get("/cameras", async function (_request, reply) {
  try {
    const cameraRecords = await getCamaraRecords();
    reply.send(cameraRecords);
  } catch (err) {
    reply.code(500).send(err);
  }
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3001 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
