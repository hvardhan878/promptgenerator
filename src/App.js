import React, { useState } from "react";
import "./styles.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setInputText(text);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputText);
  };

  const promptText = `
  write without wordwraps and headlines, without connection words, back to back seperated with commas:
  [1], [2], [3] {night}, [4], [5] {camera settings}
  
  replace [1] with the subject: "${inputText}"
  replace [2] with a list of detailed descriptions about [1]
  replace [3] with a list of detailed descriptions about the environment of the scene
  replace [4] with a list of detailed descriptions about the mood/feelings and atmosphere of the scene
  replace [5] with a list of detailed descriptions about the technical basis like render engine/camera model and details
  
  replace the content inside the {} brackets with details about the content/word inside the {} and delete the brackets. Repeat that for every {} bracket in the prompt
  complex prompt for an AI-based text to image program that converts a prompt about a topic into an image. The outcome depends on the prompts coherency. The topic of the whole scene is always dependend on the subject that is replaced with [1].
  always start the prompt with "/imagine prompt:"
  always end the prompt with "--v 4"
  don't use any line breaks, seperate the words with commas. make it a minimum of 80 words
    `;

  async function fetchData() {
    const apiKey = process.env.REACT_APP_API_KEY; // Replace with your GPT-3 API key
    const maxTokens = 3000;
    const apiUrl =
      "https://api.openai.com/v1/completions";

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: promptText,
        max_tokens: maxTokens,
        temperature: 0.7,
        model: "text-davinci-003"
      }),
    };
    const response = await fetch(apiUrl, requestOptions);
    const data = await response.json();
    setOutputText(data.choices[0].text);
  }
  return (
    <div className="container">
      <div className="form">
        <h2 className="form-title">Enter Your Text</h2>
        <div className="textarea-container">
          <textarea
            id="input-text"
            className="textarea"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button className="btn paste-btn" onClick={handlePaste}>
            <i className="fas fa-paste"></i>
          </button>
        </div>
        <button className="btn-submit" type="submit" onClick={fetchData}>
          Submit
        </button>
      </div>
      <div className="form">
        <h2 className="form-title">Result</h2>
        <div className="textarea-container">
          <textarea
            id="output-text"
            className="textarea"
            value={outputText}
            onChange={(e) => setOutputText(e.target.value)}
          />
          <button
            className="btn copy-btn"
            onClick={handleCopy}
            disabled={!outputText}
          >
            <i className="fas fa-copy"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
