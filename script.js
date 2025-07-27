document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("prompt-form");
  const promptInput = document.getElementById("prompt");
  const resultDiv = document.getElementById("result");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const prompt = promptInput.value.trim();

    if (!prompt) {
      resultDiv.innerHTML = "<p>Please enter a prompt!</p>";
      return;
    }

    resultDiv.innerHTML = "<p>Generating your website preview...</p>";

    try {
      const response = await fetch("https://sitecraft-backend.onrender.com/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      // Expecting backend to return a URL string of the hosted preview
      if (data.preview_url) {
        resultDiv.innerHTML = `
          <p>Here's your preview:</p>
          <a href="${data.preview_url}" target="_blank" class="preview-link">View Website</a>
        `;
      } else {
        resultDiv.innerHTML = "<p>Unexpected response from backend.</p>";
      }
    } catch (error) {
      console.error("Error:", error);
      resultDiv.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    }
  });
});
