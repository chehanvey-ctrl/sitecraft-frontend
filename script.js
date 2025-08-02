document.getElementById("generateBtn").addEventListener("click", async () => {
  const prompt = document.getElementById("userInput").value;
  const outputDiv = document.getElementById("output");
  const previewFrame = document.getElementById("previewFrame");
  const downloadBtn = document.getElementById("downloadBtn");

  outputDiv.innerHTML = "⏳ Generating your AI-powered site...";

  try {
    const response = await fetch("https://sitecraft-backend.onrender.com/generate-pure", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

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

    if (!data.html) {
      throw new Error("No HTML received from backend.");
    }

    const cleanedHTML = data.html.replace(/\\n/g, '\n').replace(/\\"/g, '"');

    // ✅ Inject HTML into iframe
    previewFrame.srcdoc = cleanedHTML;

    // ✅ Download functionality
    const blob = new Blob([cleanedHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = url;
      a.download = "sitecraft-ai-site.html";
      a.click();
    };

    outputDiv.innerHTML = "✅ Your AI site is ready! Scroll down to preview or download it.";
  } catch (error) {
    console.error("❌ Generation error:", error);
    outputDiv.innerHTML = `❌ Oops! ${error.message}`;
  }
});
