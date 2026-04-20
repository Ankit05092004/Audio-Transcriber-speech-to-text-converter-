import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setAudioURL(URL.createObjectURL(selectedFile));
    setText("");
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an audio file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.text();
      setText(data);

    } catch (error) {
      alert("Error processing file");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transcription.txt";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎤 Audio Transcriber</h1>

        <input type="file" accept="audio/*" onChange={handleFileChange} />

        {audioURL && (
          <audio controls src={audioURL} style={{ marginTop: "15px" }} />
        )}

        <button style={styles.button} onClick={handleUpload}>
          {loading ? "Processing..." : "Transcribe"}
        </button>

        {loading && <div style={styles.loader}></div>}

        {text && (
          <div style={styles.resultBox}>
            <h3>Transcription</h3>

            <textarea
              value={text}
              readOnly
              rows={10}
              style={styles.textarea}
            />

            <div style={styles.actions}>
              <button onClick={handleCopy} style={styles.copyBtn}>
                {copied ? "Copied!" : "Copy"}
              </button>

              <button onClick={downloadText} style={styles.downloadBtn}>
                Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    width: "400px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  title: {
    marginBottom: "20px",
  },
  button: {
    marginTop: "15px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#667eea",
    color: "white",
    cursor: "pointer",
  },
  resultBox: {
    marginTop: "20px",
  },
  textarea: {
    width: "100%",
    borderRadius: "8px",
    padding: "10px",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  copyBtn: {
    padding: "8px 15px",
    border: "none",
    borderRadius: "6px",
    background: "#48bb78",
    color: "white",
    cursor: "pointer",
  },
  downloadBtn: {
    padding: "8px 15px",
    border: "none",
    borderRadius: "6px",
    background: "#4299e1",
    color: "white",
    cursor: "pointer",
  },
  loader: {
    marginTop: "15px",
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #667eea",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    animation: "spin 1s linear infinite",
  },
};

export default App;