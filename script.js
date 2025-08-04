<script>
document.getElementById("generateBtn").addEventListener("click", async () => {
  const prompt = document.getElementById("userInput").value.trim();
  const outputDiv = document.getElementById("output");
  const previewFrame = document.getElementById("previewFrame");
  const downloadBtn = document.getElementById("downloadBtn");
  const progressBarContainer = document.getElementById("progressBar");
  const progressFill = document.getElementById("progressBarFill");

  if (!prompt) {
    outputDiv.innerHTML = "❌ Please enter a prompt before generating.";
    return;
  }

  outputDiv.innerHTML = "⏳ Generating your AI-powered site...";
  progressBarContainer.style.display = "block";
  progressFill.style.width = "0%";

  let progress = 0;
  const interval = setInterval(() => {
    if (progress < 95) {
      progress += Math.random() * 2;
      progressFill.style.width = `${progress.toFixed(0)}%`;
    }
  }, 100);

  try {
    const response = await fetch("https://sitecraft-backend.onrender.com/generate-pure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    clearInterval(interval);
    progressFill.style.width = "100%";

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error ${response.status}: ${text}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
    }

    const data = await response.json();
    if (!data.html) throw new Error("No HTML received from backend.");

    const deployedURL = data.site_url || null;
    previewFrame.srcdoc = data.html;

    // Download functionality
    const blob = new Blob([data.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = url;
      a.download = "sitecraft-ai-site.html";
      a.click();
    };

    outputDiv.innerHTML = "✅ Your AI site is ready! Scroll down to preview or download it.";

    // 🔁 Redirect to success page with deployed URL
    if (deployedURL) {
      setTimeout(() => {
        window.location.href = `success.html?url=${encodeURIComponent(deployedURL)}`;
      }, 1500); // Give the user a moment to see the success message
    }

  } catch (error) {
    clearInterval(interval);
    progressBarContainer.style.display = "none";
    progressFill.style.width = "0%";
    console.error("❌ Generation error:", error);
    outputDiv.innerHTML = `❌ Oops! ${error.message}`;
  }
});
</script>
