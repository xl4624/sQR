import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Result.css';

const SERVER_IP = process.env.REACT_APP_SERVER_IP

function Result() {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function scanUrl() {
      const response = await fetch(`${SERVER_IP}/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ URL: url }),
      });

      const data = await response.json();
      console.log('Scan result:', data);
      setResult(data.result);
      setLoading(false);
    };

    async function fetchAnalysis() {
      const params = new URLSearchParams({ url });
      const response = await fetch(`${SERVER_IP}/reports?${params}`);
      const data = await response.json();
      console.log("fetchAnalysis(): ", data);
      setAnalysis(data.analysis);
    };

    if (url) {
      scanUrl();
      fetchAnalysis();
    }
  }, [url]);

  function getStatusDisplay() {
    if (loading) {
      return {
        className: 'loading',
        text: 'Scanning...'
      };
    }

    if (result === "safe" && analysis) {
      return {
        className: 'safe maybe',
        text: 'Safe?'
      };
    }

    return {
      className: result === 'safe' ? 'safe' : 'unsafe',
      text: result === 'safe' ? 'Safe!' : 'Unsafe!'
    };
  }

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

          <div className={`status-box ${getStatusDisplay().className}`}>
            {getStatusDisplay().text}
          </div>

          <div className="other-data">
            <p>Scanned URL: {url}</p>
          </div>

          {/* Show existing reports analysis if there is more than 1 report */}
          {analysis && (
            <div className="analysis-box">
              <h2>Community Report Analysis</h2>
              <ul className="analysis-list">
                {analysis.split('\n').map((point, index) => (
                  <li key={index} className="analysis-point">
                    {point.replace('* ', '')}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
