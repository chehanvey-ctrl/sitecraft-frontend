async function generateSite() {
  const prompt = document.getElementById("userInput").value;
  const resultDiv = document.getElementById("output");

  resultDiv.innerHTML = "<p>Generating your website preview...</p>";

  try {
    const response = await fetch("https://sitecraft-backend.onrender.com/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.html) {
      resultDiv.innerHTML = `<iframe style="width:100%; height:600px; border:none;" srcdoc='${data.html}'></iframe>`;
    } else {
      resultDiv.innerHTML = "<p>Something went wrong. No HTML returned.</p>";
    }

  } catch (error) {
    console.error("Error:", error);
    resultDiv.innerHTML = `<p>Oops! An error occurred: ${error.message}</p>`;
  }
}
