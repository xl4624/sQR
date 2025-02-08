import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import QrScanner from 'qr-scanner';

function App() {
  const videoRef = useRef(null);
  const [qrScanner, setQrScanner] = useState(null);
  const [result, setResult] = useState('');

  async function startScanner() {
    if (qrScanner) {
      await qrScanner.start();
      return;
    }
    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        console.log('decoded qr code:', result.data);
        setResult(result.data);
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

  function stopScanner() {
    if (qrScanner) {
      qrScanner.stop();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <video ref={videoRef}></video>
        <button onClick={startScanner}>
          Start Scanner
        </button>
        <button onClick={stopScanner}>
          Stop Scanner
        </button>
        {result && (
          <div>Scanned Result: {result}</div>
        )}
      </header>
    </div>
  );
}

export default App;
