import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Result.css';

function Result() {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const scanUrl = async () => {
      try {
        const response = await fetch('http://localhost:5000/scan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ URL: url }),
        });

        const data = await response.json();
        console.log('Scan result:', data);
        // setResult("unsafe");
        setResult(data.result);
      } catch (error) {
        console.error('Error:', error);
        setResult('error');
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      scanUrl();
    }
  }, [url]);

  function handleReportButton() {
    const params = new URLSearchParams({
      url: url,
    });
    navigate(`/report?${params}`);
  }

  return (
    <div className="Result-container">
      <header><h1>Scan Result</h1></header>

      <div className="Result-content">
        <div className="result-box">
          <h2>This QR code is...</h2>

          {loading ? (
            <div className="status-box loading">Scanning...</div>
          ) : (
            <div className={`status-box ${result === 'safe' ? 'safe' : 'unsafe'}`}>
              {result === 'safe' ? 'Safe!' : 'Unsafe!'}
            </div>
          )}

          <div className="other-data">
            <p>Scanned URL: {url}</p>
          </div>
        </div>

        <button
          className="action-button visit-button"
          onClick={() => window.open(url, '_blank')}
        >
          Visit URL
        </button>

        <button
          className="action-button report-button"
          onClick={handleReportButton}
        >
          Report QR Code
        </button>
      </div>
    </div>
  );
}

export default Result;
