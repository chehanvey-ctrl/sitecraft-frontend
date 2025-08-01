document.getElementById("generateBtn").addEventListener("click", async () => {
  const prompt = document.getElementById("userInput").value;
  const outputDiv = document.getElementById("output");
  const previewFrame = document.getElementById("previewFrame");
  const downloadBtn = document.getElementById("downloadBtn");

  outputDiv.innerHTML = "⏳ Generating your site, hang tight...";

  try {
    const response = await fetch("https://sitecraft-backend.onrender.com/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const cleanedHTML = data.html.replace(/\\n/g, '\n').replace(/\\"/g, '"');

    // ✅ Inject HTML into iframe
    previewFrame.srcdoc = cleanedHTML;

    // ✅ Download functionality
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
    console.error(error);
    outputDiv.innerHTML = `❌ Oops! ${error.message}`;
  }
});
