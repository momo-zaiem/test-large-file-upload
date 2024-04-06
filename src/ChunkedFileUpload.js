import React, { useState } from "react";
import LinearProgress from '@mui/material/LinearProgress';

const ChunkedFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const chunkSize = 5 * 1024 * 1024; // 5MB (adjust based on your requirements)
    const totalChunks = Math.ceil(selectedFile.size / chunkSize);
    const chunkProgress = 100 / totalChunks;
    let chunkNumber = 0;
    let start = 0;
    let end = 0;

    const uploadNextChunk = async () => {
      if (end <= selectedFile.size) {
        const chunk = selectedFile.slice(start, end);
        const formData = new FormData();
        formData.append("file", chunk);
        formData.append("chunkNumber", chunkNumber);
        formData.append("totalChunks", totalChunks);
        formData.append("originalname", selectedFile.name);

        fetch("https://mz-upload-large-file.azurewebsites.net/upload-chunk", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log({ data });
            const temp = `Chunk ${
              chunkNumber + 1
            }/${totalChunks} uploaded successfully`;
            setStatus(temp);
            setProgress(Number((chunkNumber + 1) * chunkProgress));
            console.log(temp);
            chunkNumber++;
            start = end;
            end = start + chunkSize;
            uploadNextChunk();
          })
          .catch((error) => {
            console.error("Error uploading chunk:", error);
          });
      } else {
        setProgress(100);
        setSelectedFile(null);
        setStatus("success");
      }
    };

    uploadNextChunk();
  };

  return (
    <>
    <div className="input-group">
      <label htmlFor="file" className="sr-only">
        Choose a file
      </label>
      <input id="file" type="file" onChange={handleFileChange} />
    </div>
    {selectedFile && (
      <section>
        File details:
        <ul>
          <li>Name: {selectedFile.name}</li>
          <li>Type: {selectedFile.type}</li>
          <li>Size: {selectedFile.size} bytes</li>
        </ul>
      </section>
    )}

    {(selectedFile) && (
      <>
        <button onClick={handleFileUpload} className="submit">
          Upload a file
        </button>
      </>
    )}

    {(progress > 0) && (
      <>
        <h3>{status}</h3>
        {progress > 0 && <LinearProgress variant="determinate" value={progress} />}
      </>
    )}

    <Result status={status} />
  </>

    // <div>
    //   <h2>Resumable File Upload</h2>
    //   <h3>{status}</h3>
    //   {progress > 0 && <LinearProgress variant="determinate" value={progress} />}
    //   <input type="file" onChange={handleFileChange} />
    //   <Button onClick={handleFileUpload}>Upload File</Button>
    // </div>
  );
};

const Result = ({ status }) => {
  if (status === "success") {
    return <p>✅ File uploaded successfully!</p>;
  } else if (status === "fail") {
    return <p>❌ File upload failed!</p>;
  } else if (status === "uploading") {
    return <p>⏳ Uploading selected file...</p>;
  } else {
    return null;
  }
};

export default ChunkedFileUpload;
