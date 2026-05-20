const BASE_URL = "http://localhost:4000/api/v1";

const TOKEN =
  "your-demo-token-here"; // Replace with a valid token from your backend for demo purposes

const routes = [
  // successful reads
  {
    method: "GET",
    path: "/service",
  },
  {
    method: "GET",
    path: "/endpoint",
  },
  {
    method: "GET",
    path: "/incident",
  },
  {
    method: "GET",
    path: "/metrics",
  },

  // validation failures
  {
    method: "POST",
    path: "/service",
    body: {},
  },
  {
    method: "POST",
    path: "/endpoint",
    body: {
      invalid: true,
    },
  },

  // unauthorized
  {
    method: "GET",
    path: "/stream",
    noAuth: true,
  },

  // not found
  {
    method: "GET",
    path: "/service/random-id",
  },
  {
    method: "DELETE",
    path: "/endpoint/random-id",
  },

  // random server-ish failures
  {
    method: "GET",
    path: "/metrics/unknown",
  },

  // mixed writes
  {
    method: "PATCH",
    path: "/service/random-id",
    body: {
      name: "Updated Service",
    },
  },
];

const randomDelay = () => Math.floor(Math.random() * 2500) + 700;

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

function randomMethodColor(method) {
  switch (method) {
    case "GET":
      return "\x1b[36m";

    case "POST":
      return "\x1b[32m";

    case "PATCH":
      return "\x1b[33m";

    case "DELETE":
      return "\x1b[31m";

    default:
      return "\x1b[0m";
  }
}

async function hitRoute(route) {
  const color = randomMethodColor(route.method);

  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (!route.noAuth) {
      headers.Authorization = `Bearer ${TOKEN}`;
    }

    const response = await fetch(`${BASE_URL}${route.path}`, {
      method: route.method,

      headers,

      body: route.body ? JSON.stringify(route.body) : undefined,
    });

    console.log(
      `${color}${route.method}\x1b[0m ${route.path} → ${response.status}`,
    );
  } catch (error) {
    console.log(`\x1b[31mERROR\x1b[0m ${route.path} → ${error.message}`);
  }
}

async function runDemoTraffic() {
  console.log("\n🚀 Spectrix demo traffic started...\n");

  while (true) {
    const batchSize = Math.floor(Math.random() * 6) + 1;

    const batch = [];

    for (let i = 0; i < batchSize; i++) {
      batch.push(hitRoute(randomItem(routes)));
    }

    await Promise.all(batch);

    const delay = randomDelay();

    console.log(`⏳ waiting ${delay}ms...\n`);

    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

runDemoTraffic();
