import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import QRCode from 'qrcode';

// Styled Components
const HomeContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  font-family: 'Poppins', sans-serif;
  color: white;
  padding: 20px;
  background: url('https://source.unsplash.com/1600x900/?pharmacy,healthcare') center/cover;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6); /* Dark overlay */
    z-index: 0;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  max-width: 600px;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const Button = styled.button`
  padding: 15px 35px;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  background: #ff6b6b;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    background: #d44f4f;
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(255, 107, 107, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const QRCodeContainer = styled.div`
  margin-top: 30px;
  text-align: center;
  max-width: 400px;
`;

const InputField = styled.input`
  padding: 12px 20px;
  font-size: 16px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
`;

const QRCodeImage = styled.img`
  margin-top: 20px;
  max-width: 100%;
  height: auto;
  border: 2px solid #ddd;
  border-radius: 8px;
`;

// Home Component
const Home = () => {
  const navigate = useNavigate();
  const [drugInfo, setDrugInfo] = useState('');
  const [qrData, setQrData] = useState('');
  const [drugCategory, setDrugCategory] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input change for drug information
  const handleInputChange = (e) => {
    setDrugInfo(e.target.value);
  };

  // Handle drug category change
  const handleCategoryChange = (e) => {
    setDrugCategory(e.target.value);
  };

  // Generate QR code for the entered drug information
  const generateQRCode = (data) => {
    if (data) {
      setLoading(true);
      QRCode.toDataURL(data, (err, url) => {
        if (err) {
          console.error('QR Code generation failed:', err);
        } else {
          setQrData(url);
        }
        setLoading(false);
      });
    }
  };

  // Trigger QR code generation when drug info or category changes
  useEffect(() => {
    if (drugInfo) {
      generateQRCode(`Drug Information: ${drugInfo}`);
    }
  }, [drugInfo]);

  // This will trigger when drug category changes
  useEffect(() => {
    if (drugCategory) {
      console.log(`Category selected: ${drugCategory}`); // Debugging category
    }
  }, [drugCategory]);

  return (
    <HomeContainer>
      <Content>
        <Title> Hellooo  Welcome to ADR Detection</Title>
        <Subtitle>Find out adverse drug reactions & discussions with ease.</Subtitle>
        <Button onClick={() => navigate('/search')}>Start Searching</Button>

        {/* Drug Information Input and QR Code */}
        <QRCodeContainer>
          <InputField
            type="text"
            placeholder="Enter drug information"
            value={drugInfo}
            onChange={handleInputChange}
          />
          <InputField as="select" value={drugCategory} onChange={handleCategoryChange}>
            <option value="">Select Drug Category</option>
            <option value="Antibiotics">Antibiotics</option>
            <option value="Painkillers">Painkillers</option>
            <option value="Vitamins">Vitamins</option>
          </InputField>
          {loading && <p>Loading QR Code...</p>}
          {qrData && (
            <div>
              <h2>QR Code for {drugInfo}</h2>
              <QRCodeImage src={qrData} alt="Generated QR Code" />
            </div>
          )}
        </QRCodeContainer>
      </Content>

      {/* Footer */}
      <footer>
        <p>&copy; 2025 ADR Detection | All Rights Reserved</p>
      </footer>
    </HomeContainer>
  );
};

export default Home;
