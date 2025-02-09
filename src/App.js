import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import QrScanner from 'qr-scanner';

function App() {
  const videoRef = useRef(null);
  const [qrScanner, setQrScanner] = useState(null);
  const [prevUrl, setPrevUrl] = useState('');
  const navigate = useNavigate();

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
    navigate(`/result?${params}`);
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
