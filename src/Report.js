import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Report.css';

function Report() {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');
  const navigate = useNavigate();

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        URL: url,
        subject: subject,
        description: description
      }),
    });

    if (response.ok) {
      navigate(`/result?url=${encodeURIComponent(url)}`);
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
            <input
              type="text"
              placeholder="Report Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Report;
