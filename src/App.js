import logo from './logo.svg';
import './App.css';
import ChunkedFileUpload from './ChunkedFileUpload';
import SingleFileUploader from './SingleFileUploader';


function App() {
  return (
    <>
       <h1>React File Upload</h1>

       <h2>Single File Upload</h2>
       <SingleFileUploader />

       <h2>Chunked File Upload</h2>
       <ChunkedFileUpload></ChunkedFileUpload>
    </>

  );
}

export default App;
