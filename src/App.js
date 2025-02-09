import React, { useRef, useState } from 'react';
import './App.css';
import QrScanner from 'qr-scanner';

// const SERVER_IP = process.env.REACT_APP_SERVER_IP;
// const SERVER_IP = "http://localhost:5000";

function App() {
  const videoRef = useRef(null);
  const [qrScanner, setQrScanner] = useState(null);
  const [prevUrl, setPrevUrl] = useState('');

  async function startScanner() {
    if (qrScanner) {
      await qrScanner.start();
      return;
    }
    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        console.log('decoded qr code:', result.data);
        setPrevUrl(result.data);
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    setQrScanner(scanner);
    await scanner.start();
  };

  async function scanQrCode() {
    if (!prevUrl) return;
    const params = new URLSearchParams({
      url: prevUrl,
    });
    window.location.href = `/result?${params}`;
  }

  function stopScanner() {
    if (qrScanner) {
      qrScanner.stop();
    }
  };

  return (
    <div className="App">
      <header><h1>Home</h1></header>

      <div className="App-header">
        <div className="video-container">
          <video className="scan-video" ref={videoRef}></video>
        </div>
        <div className="buttons">
          <button onClick={startScanner}>
            Start Scanner
          </button>
          <button onClick={stopScanner}>
            Stop Scanner
          </button>
        </div>
        <button className="scan-button" onClick={scanQrCode}>
            Scan QR Code
        </button>
      </div>
    </div>
  );
}

export default App;
