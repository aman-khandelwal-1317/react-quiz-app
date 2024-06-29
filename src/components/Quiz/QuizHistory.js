import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../context/api'; 
import { AuthContext } from '../../context/AuthContext';

const QuizHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/api/quiz/history/${user._id}`);
        setHistory(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error)
        setError(error);
        setLoading(false);
      }
    };
    if (user) {
    fetchHistory();
    }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading quiz history</div>;

  return (
    <div className="container mt-4">
      <h2>Quiz History</h2>
      <div className="list-group">
        {history.map((score) => (
          <Link
            to={`/quiz/result/${score._id}`}
            key={score._id}
            className="list-group-item list-group-item-action"
          >
            <div>
              <h5>{score.quizId.category} - {score.quizId.difficulty}</h5>
              <p>Total Score: {score.totalScore} / 15</p>
              {/* <p>Date: {new Date(score.createdAt).toLocaleString()}</p> */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuizHistory;
