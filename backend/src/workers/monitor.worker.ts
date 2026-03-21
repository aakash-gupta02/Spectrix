import { Endpoint } from "../modules/endpoint/endpoint.model.js";
import "../modules/service/service.model.js";
import { runCheck } from "./runner.js";
import { connectDB } from "../config/db.js";
const POLL_INTERVAL = 60000 * 5; // 60 seconds * 5 = 5 minutes

async function runWorker() {
  console.log("🚀 Monitoring worker started...");
  await connectDB();

  setInterval(async () => {
    try {
      const endpoints = await Endpoint.find({ active: true })
        .populate("serviceId", "baseUrl") // populate service's baseUrl
        .lean(); // get plain JS objects for better performance

        // console.log("endpoints: ", endpoints);
        

      for (const endpoint of endpoints) {
        runCheck(endpoint); // don't await → parallel
      }

    } catch (err) {
      console.error("Worker error:", err);
    }
  }, POLL_INTERVAL);
}

runWorker();