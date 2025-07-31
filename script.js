async function generateSite() {
  const prompt = document.getElementById("userInput").value;
  const resultDiv = document.getElementById("output");
  const button = document.getElementById("generateBtn");

  resultDiv.innerHTML = "<p>Generating your website preview...</p>";
  button.disabled = true;
  button.textContent = "Generating...";

  try {
    const response = await fetch("https://sitecraft-backend.onrender.com/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const html = await response.text(); // ✅ Now uses .text()

    resultDiv.innerHTML = `
      <iframe srcdoc="${html.replace(/"/g, '&quot;')}"></iframe>
      <button onclick="downloadHTML()">Download HTML</button>
    `;
    window.generatedHTML = html;
  } catch (error) {
    console.error("Error:", error);
    resultDiv.innerHTML = `<p>Oops! An error occurred: ${error.message}</p>`;
  } finally {
    button.disabled = false;
    button.textContent = "Generate Website";
  }
}

function downloadHTML() {
  const blob = new Blob([window.generatedHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "generated-website.html";
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById("generateBtn").addEventListener("click", generateSite);
