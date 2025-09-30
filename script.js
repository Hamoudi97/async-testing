const express = require("express");
const fs = require("fs").promises;
const app = express();
const PORT = 3000;

// setTimeout() to simulate API call
function fetchDataCallback(callback) {
  setTimeout(() => {
    callback(null, { id: 1, name: "yourName" });
  }, 1000);
}

// Wrap in promise
function fetchDataPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ id: 1, name: "yourName" });
    }, 1000);
  });
}

// Rewrite using async/await
function simulateDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchDataAsync() {
  await simulateDelay(1000);
  return { id: 1, name: "yourName" };
}

// Chain multiple steps with simulateDelay
async function login() {
  await simulateDelay(200);
  return "Login complete";
}

async function fetchUser() {
  await simulateDelay(500);
  return "Fetched user data";
}

async function renderContent() {
  await simulateDelay(300);
  return "Content rendered";
}

// Create endpoints with error handling

// /callback endpoint
app.get("/callback", (req, res) => {
  fetchDataCallback((error, data) => {
    if (error) {
      return res.status(500).json({ error: "Callback failed" });
    }
    res.json(data);
  });
});

// /promise endpoint
app.get("/promise", (req, res) => {
  fetchDataPromise()
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ error: "Promise failed" }));
});

// /async endpoint
app.get("/async", async (req, res) => {
  try {
    const data = await fetchDataAsync();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Async failed" });
  }
});

// /file endpoint
app.get("/file", async (req, res) => {
  try {
    const content = await fs.readFile("content.txt", "utf8");
    res.type("text/plain").send(content);
  } catch (error) {
    res.status(500).json({ error: "Could not read file" });
  }
});

// /chain endpoint
app.get("/chain", async (req, res) => {
  try {
    const step1 = await login();
    const step2 = await fetchUser();
    const step3 = await renderContent();

    res.json({
      steps: [step1, step2, step3],
    });
  } catch (error) {
    res.status(500).json({ error: "Chain failed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
  console.log("Endpoints: /callback /promise /async /file /chain");
});
