document.getElementById("generateBtn").addEventListener("click", async () => {
  const prompt = document.getElementById("userInput").value;
  const outputDiv = document.getElementById("output");
  const previewFrame = document.getElementById("previewFrame");
  const downloadBtn = document.getElementById("downloadBtn");
  const progressContainer = document.getElementById("progressContainer");
  const progressBar = document.getElementById("progressBar");

  outputDiv.innerHTML = "⏳ Generating your site, hang tight...";
  progressContainer.style.display = "block";
  progressBar.style.width = "0%";

  // Simulated progress
  let progress = 0;
  const interval = setInterval(() => {
    if (progress < 95) {
      progress += 1;
      progressBar.style.width = progress + "%";
    }
  }, 100);

  try {
    const response = await fetch("https://sitecraft-backend.onrender.com/generate-pure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();

    clearInterval(interval);
    progressBar.style.width = "100%";

    const cleanedHTML = data.html.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    previewFrame.srcdoc = cleanedHTML;

    const blob = new Blob([cleanedHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = url;
      a.download = "sitecraft-generated.html";
      a.click();
    };

    outputDiv.innerHTML = "✅ Site generated! Scroll down for preview and download.";
  } catch (error) {
    clearInterval(interval);
    progressContainer.style.display = "none";
    outputDiv.innerHTML = `❌ Oops! ${error.message}`;
  }
});
