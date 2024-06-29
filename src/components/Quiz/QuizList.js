import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../context/api'; 
import { AuthContext } from '../../context/AuthContext';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get('/api/quiz');
        setQuizzes(res.data);
      } catch (error) {
        console.error('Error fetching quizzes', error);
      }
    };

    fetchQuizzes();
  }, []);

  const categories = ['All', ...new Set(quizzes.map(quiz => quiz.category))];

  const filteredQuizzes = selectedCategory === 'All'
    ? quizzes
    : quizzes.filter(quiz => quiz.category === selectedCategory);


  return (
    <div className='quiz-list'>
      <div className="container mt-4">
        <h2 className="mb-4">Available Quizzes</h2>
        <div className="d-flex justify-content-end mb-4">
          <select
            className="form-select w-auto"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {[...new Set(quizzes.map(quiz => quiz.category))].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="row">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz._id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{quiz.title}</h5>
                  <p className="card-text">Category: {quiz.category}</p>
                  <p className="card-text">Difficulty: {quiz.difficulty}</p>
                  <p className="card-text">Time: 15 min</p>
                  <p className="card-text">Questions: 15</p>
                  <Link to={`/quiz/${quiz._id}`} className="btn btn-primary mt-auto">
                    Play
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizList;
