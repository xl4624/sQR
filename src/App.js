import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import QrScanner from 'qr-scanner';

function App() {
  const videoRef = useRef(null);

  async function startScanner() {
    const scanner = new QrScanner(
      videoRef.current,
      (result) => console.log('decoded qr code:', result),
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );
    await scanner.start();
  }
  return (
    <div className="App">
      <header className="App-header">
        <video ref={videoRef}></video>
        <button onClick={startScanner}>
          Start Scanner
        </button>
      </header>
    </div>
  );
}

export default App;
