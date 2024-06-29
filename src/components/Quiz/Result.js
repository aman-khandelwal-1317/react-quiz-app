import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../context/api';
import { AuthContext } from '../../context/AuthContext';

const Result = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
        try {
            const res = await api.get(`/api/quiz/result/${resultId}`);
            setResult(res.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    if (user) {
      fetchResult();
  }

  }, [resultId,user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading result</div>;

  return (
    <div className="container mt-5">
    <h2 className="text-center mb-4">Quiz Results</h2>
    <h4 className="text-center mb-4">Total Score: {result.totalScore}</h4>
    <div className="list-group">
        {result.detailedResults.map((item, index) => (
            <div key={index} className="list-group-item">
                <h5 className="mb-3">{item.questionText}</h5>
                <ul className="list-group">
                    {item.options.map((option, idx) => (
                        <li 
                            key={idx} 
                            className={`list-group-item ${option.optionText === item.correctOption ? 'list-group-item-success' : item.selectedOption === option.optionText ? 'list-group-item-danger' : ''}`}
                        >
                            {option.optionText}
                        </li>
                    ))}
                </ul>
                <p className={`mt-2 ${item.isCorrect ? 'text-success' : 'text-danger'}`}>
                    {item.isCorrect ? 'Correct' : 'Incorrect'}: You selected "{item.selectedOption}", Correct answer is "{item.correctOption}"
                </p>
            </div>
        ))}
    </div>
    <div className="text-center mt-4">
        <button type="button" className="btn btn-secondary me-2" onClick={() => navigate(`/quiz/${result.quizId}`)}>
            Play Again
        </button>
        <Link to="/" className="btn btn-info">
            Home
        </Link>
    </div>
</div>

  );
};

export default Result;
