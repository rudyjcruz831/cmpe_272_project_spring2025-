import React, { useState } from 'react';

type Recommendation = {
  name: string;
  category: string;
  description: string;
  relevance_score: number;
  relevance_reason: string;
};

const RecommendationsComponent = () => {
  const [address, setAddress] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('http://localhost:8000/reccomendations',
        {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, radius: 0 }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setRecommendations(data.places);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  return (
    <div>
      <h1>Get Place Recommendations</h1>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter your address"
      />
      <button onClick={fetchRecommendations}>Get Recommendations</button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Recommendations</h2>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
            <ul>
              {Array.isArray(recommendations) && recommendations.length > 0 ? (
                recommendations.map((place, index) => (
                  <li key={index}>
                    <h3>{place.name || 'Unknown Name'}</h3>
                    <p>Category: {place.category || 'Unknown Category'}</p>
                    <p>Description: {place.description || 'No Description Available'}</p>
                    <p>Relevance Score: {place.relevance_score || 'N/A'}</p>
                    <p>Reason: {place.relevance_reason || 'No Reason Provided'}</p>
                  </li>
                ))
              ) : (
                <li>No recommendations available</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationsComponent;