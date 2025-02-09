import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Report.css';

const SERVER_IP = process.env.REACT_APP_SERVER_IP;

function Report() {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${SERVER_IP}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        report: description
      }),
    });

    if (response.ok) {
      const params = new URLSearchParams({ url: url });
      navigate(`/result?${params}`);
    } else {
      alert('Failed to submit report. Please try again.');
    }
  };

  return (
    <div className="report-container">
      <header><h1>Report QR Code</h1></header>
      <form className="report-content" onSubmit={handleSubmit}>
        <div className="report-box">
          <div className="input-group">
            <label className="question-label">
              What makes you think this URL is suspicious?
            </label>
            <textarea
              placeholder="Please describe some details about the website or link..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="description-textarea"
            />
          </div>
          <button type="submit">
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
}

export default Report;
