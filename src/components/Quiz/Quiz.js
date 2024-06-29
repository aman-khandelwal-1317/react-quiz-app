import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../context/api'; 
import { AuthContext } from '../../context/AuthContext';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useContext(AuthContext);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  useEffect(() => {

    if (authLoading) return; 

    if (!user) {
      navigate('/login');
      return;
    }


    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/api/quiz/${id}`);
        setQuiz(res.data);
        setLoading(false);
    } catch (err) {
        setError(err);
        setLoading(false);
    }
    };

    fetchQuiz();
  }, [id, user, authLoading, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
        setTimeLeft(prevTime => {
            if (prevTime <= 1) {
                clearInterval(timer);
                handleSubmit();
                return 0;
            }
            return prevTime - 1;
        });
    }, 1000);

    return () => clearInterval(timer);
});


const handleOptionChange = (questionId, optionId) => {
  setAnswers({ ...answers, [questionId]: optionId });
};

  const handleSubmit = async () => {
    try {
      const submissionData = {
          userId: user._id,
          answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
              questionId,
              selectedOption
          }))
      };
      const res = await api.post(`/api/quiz/${id}/submit`, submissionData);
      navigate(`/quiz/result/${res.data._id}`); // Assuming res.data._id is the score ID
  } catch (error) {
      console.error('Submit error', error);
  }
  };

  if (loading) return <div className="container mt-4"><div className="alert alert-info">Loading...</div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">Error loading quiz</div></div>;

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading quiz</div>;

return (
       <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-3 text-center">{quiz.category} Quiz - {quiz.difficulty}</h2>
              <div className="mb-3 text-center">
                <span className="badge bg-primary">Time Left: {formatTime(timeLeft)}</span>
              </div>
              <form>
                {quiz.questions.map((question, index) => (
                  <div key={question._id} className="mb-4">
                    <h5 className="mb-3">{index + 1}. {question.questionText}</h5>
                    {question.options.map(option => (
                      <div className="form-check" key={option._id}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`question-${question._id}`}
                          id={`question-${question._id}-option-${option._id}`}
                          value={option._id}
                          checked={answers[question._id] === option._id}
                          onChange={() => handleOptionChange(question._id, option._id)}
                        />
                        <label className="form-check-label" htmlFor={`question-${question._id}-option-${option._id}`}>
                          {option.optionText}
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="text-center">
                  <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                    Submit Quiz
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

);

};

export default Quiz;
