import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled Components
const ADRContainer = styled.div`
  padding: 30px;
  font-family: 'Poppins', sans-serif;
  background-color: #f8f8f8;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 40px;
`;

const ADRItem = styled.div`
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ADRTitle = styled.h3`
  font-size: 1.8rem;
  color: #2a2a2a;
`;

const ADRText = styled.p`
  font-size: 1.2rem;
  color: #555;
  line-height: 1.6;
`;

const CommentList = styled.ul`
  margin-top: 10px;
  list-style-type: none;
  padding-left: 20px;
`;

const CommentItem = styled.li`
  font-size: 1.1rem;
  color: #444;
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const SentimentTag = styled.span`
  font-size: 0.9rem;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  margin-left: 10px;
  color: #fff;
  background-color: ${({ sentiment }) =>
    sentiment === 'Positive' ? '#28a745' :
    sentiment === 'Negative' ? '#dc3545' :
    '#ffc107'};
`;

const LoadingMessage = styled.p`
  font-size: 1.5rem;
  color: #ff6b6b;
  text-align: center;
`;

const ADRDetection = ({ drugName }) => {
  const [adrResults, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchADRData = async () => {
      if (!drugName.trim()) {
        setMessage('Please provide a valid drug name.');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/get-adr-results?drug_name=${encodeURIComponent(drugName)}`);
        const data = await response.json();

        console.log('Fetched ADR Data:', data); // Debugging

        if (!data.adr_results || data.adr_results.length === 0) {
          setMessage('No ADRs detected for this drug.');
          setResults([]);
        } else {
          setResults(data.adr_results);
          setMessage('');
        }
      } catch (error) {
        setMessage('Failed to fetch ADR data. Please try again.');
        console.error(error);
      }
      setLoading(false);
    };

    fetchADRData();
  }, [drugName]);

  return (
    <ADRContainer>
      <Title>ADR Detection Results for {drugName}</Title>
      {loading && <LoadingMessage>Loading...</LoadingMessage>}
      {message && <p>{message}</p>}
      {adrResults.length > 0 &&
        adrResults.map((post, index) => (
          <ADRItem key={index}>
            <ADRTitle>{post.title || 'No Title Available'}</ADRTitle>
            <ADRText>{post.selftext || 'No Description Available'}</ADRText>

            {post.comments && post.comments.length > 0 ? (
              <CommentList>
                {post.comments.map((commentObj, commentIndex) => (
                  <CommentItem key={commentIndex}>
                    {commentObj.comment}
                    <SentimentTag sentiment={commentObj.sentiment}>
                      {commentObj.sentiment}
                    </SentimentTag>
                  </CommentItem>
                ))}
              </CommentList>
            ) : (
              <p>No comments found for this post.</p>
            )}
          </ADRItem>
        ))
      }
    </ADRContainer>
  );
};

export default ADRDetection;
