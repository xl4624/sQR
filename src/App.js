import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import QrScanner from 'qr-scanner';

const GUEST_URL_HISTORY_SIZE = 3;

function App() {
  const videoRef = useRef(null);
  const [qrScanner, setQrScanner] = useState(null);
  const [result, setResult] = useState('');
  const urlCacheRef = useRef(new Set());
  const [urlHistory, setUrlHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('history');
    if (saved) {
      urlCacheRef.current = new Set(JSON.parse(saved));
      setUrlHistory(Array.from(urlCacheRef.current));
    }
  }, []);

  function addToHistory(url) {
    const set = urlCacheRef.current;
    set.delete(url);
    if (set.size >= GUEST_URL_HISTORY_SIZE) {
      set.delete(Array.from(set)[0]);
    }
    set.add(url);
    // History table should be in reverse chronological order.
    const newUrls = Array.from(set).reverse();
    setUrlHistory(newUrls);
    localStorage.setItem('history', JSON.stringify(newUrls));
  }

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
        addToHistory(result.data);
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
        {urlHistory && urlHistory.length > 0 && (
          <div>
            <br /><br /><br /><br />
            <table>
              <thead>
                <tr><th>URL</th></tr>
              </thead>
              <tbody>
                {urlHistory.map((url) => (
                  <tr key={url}><td>{url}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
