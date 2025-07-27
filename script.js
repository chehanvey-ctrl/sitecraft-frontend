<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>SiteCraft AI</title>
  <style>
    body {
      margin: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #0a0a0a;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
    }

    .container {
      max-width: 800px;
      width: 100%;
      background: #1a1a1a;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.05);
    }

    h1 {
      text-align: center;
      margin-bottom: 1rem;
      background: linear-gradient(to right, #7928ca, #ff0080);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    textarea {
      width: 100%;
      padding: 1rem;
      font-size: 1rem;
      border-radius: 8px;
      border: none;
      resize: vertical;
      min-height: 120px;
      margin-bottom: 1rem;
    }

    button {
      background: #ff0080;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      color: white;
      font-weight: bold;
      font-size: 1rem;
      cursor: pointer;
    }

    button:hover {
      background: #e60073;
    }

    iframe {
      margin-top: 2rem;
      width: 100%;
      height: 600px;
      border: none;
      border-radius: 8px;
    }

    #output button {
      margin-top: 1rem;
    }

    @media (max-width: 600px) {
      iframe {
        height: 400px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>SiteCraft AI</h1>
    <p>Describe your dream website and we'll build it in seconds.</p>

    <textarea id="userInput" placeholder="e.g. I want a sleek gym website for 'Strong Arms' with black and silver design..."></textarea>
    <button id="generateBtn" onclick="generateSite()">Generate Website</button>

    <div id="output" style="margin-top: 2rem;"></div>
  </div>

  <script>
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

        const data = await response.json();

        if (data && data.html) {
          resultDiv.innerHTML = `
            <iframe srcdoc="${data.html.replace(/"/g, '&quot;')}"></iframe>
            <button onclick="downloadHTML()">Download HTML</button>
          `;
          window.generatedHTML = data.html;
        } else {
          resultDiv.innerHTML = "<p>Something went wrong. No HTML returned.</p>";
        }
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
  </script>
</body>
</html>
