import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import './QRScanner.css';

const QRScanner = ({ onScan = null, title = 'QR Code Scanner' }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [animateScanner, setAnimateScanner] = useState(false);

  const handleStartScan = () => {
    setIsScanning(true);
    setAnimateScanner(true);
    setScannedData(null);

    setTimeout(() => {
      const mockData = {
        participantId: `P${Math.floor(Math.random() * 10000)}`,
        token: `auth-tkn-${Math.floor(Math.random() * 100000)}`,
        name: 'John Doe',
        event: 'Tech Contest 2024',
        timestamp: new Date().toLocaleTimeString(),
        verified: true,
      };
      setScannedData(mockData);
      setIsScanning(false);
      if (onScan) onScan(mockData);

      setTimeout(() => {
        if (user?.role === 'organizer' || user?.role === 'admin') {
          navigate(`/organizer/verify/${mockData.token}`);
        } else if (user?.role === 'judge') {
          navigate(`/judge/score/${mockData.token}`);
        }
      }, 1500);
    }, 2000);
  };

  const handleReset = () => {
    setScannedData(null);
    setAnimateScanner(false);
  };

  return (
    <div className="qr-scanner-container">
      <h2>{title}</h2>

      {!scannedData ? (
        <div className="scanner-area">
          <div className={`scanner-frame ${isScanning ? 'active' : ''}`}>
            {animateScanner && (
              <div className="scanner-lines">
                <div className="scan-line"></div>
                <div className="scan-line"></div>
                <div className="scan-line"></div>
              </div>
            )}
            <div className="scanner-corners">
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
            </div>
            <div className="scanner-center">
              {isScanning ? (
                <div className="scanning-indicator">
                  <div className="pulse"></div>
                  <p>Scanning...</p>
                </div>
              ) : (
                <div className="qr-icon">
                  <i className="bi bi-qr-code-scan" />
                </div>
              )}
            </div>
          </div>

          <button
            className={`scan-button ${isScanning ? 'disabled' : ''}`}
            onClick={handleStartScan}
            disabled={isScanning}
          >
            {isScanning ? 'Scanning...' : 'Start Scan'}
          </button>
        </div>
      ) : (
        <div className="scan-result">
          <div className="result-header success">
            <span className="result-icon">
              <i className="bi bi-check2-circle" />
            </span>
            <p>Scan Successful</p>
          </div>

          <div className="result-data">
            <div className="result-item">
              <label>Participant ID</label>
              <value>{scannedData.participantId}</value>
            </div>
            <div className="result-item">
              <label>Name</label>
              <value>{scannedData.name}</value>
            </div>
            <div className="result-item">
              <label>Event</label>
              <value>{scannedData.event}</value>
            </div>
            <div className="result-item">
              <label>Scanned At</label>
              <value>{scannedData.timestamp}</value>
            </div>
            <div className="result-item">
              <label>Status</label>
              <value className={`status-${scannedData.verified ? 'verified' : 'unverified'}`}>
                {scannedData.verified ? 'Verified' : 'Unverified'}
              </value>
            </div>
          </div>

          <button className="reset-button" onClick={handleReset}>
            Scan Another
          </button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
