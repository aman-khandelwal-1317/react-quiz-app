import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../context/api';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const res = await api.post('/api/auth/login', { email, password });
          localStorage.setItem('token', res.data.token);

          const user = await api.get('/api/auth/me', {
            headers: { 'x-auth-token': res.data.token },
        });
        setUser(user.data);
          navigate('/');
      } catch (error) {
          console.error('Login error', error);
      }
  };

  return (
      <div className="container">
          <div className="row justify-content-center">
              <div className="col-md-6">
                  <h2 className="text-center mt-4">Login</h2>
                  <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email address</label>
                          <input
                              type="email"
                              className="form-control"
                              id="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                          />
                      </div>
                      <div className="mb-3">
                          <label htmlFor="password" className="form-label">Password</label>
                          <input
                              type="password"
                              className="form-control"
                              id="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                          />
                      </div>
                      <button type="submit" className="btn btn-primary w-100">Login</button>
                  </form>
              </div>
          </div>
      </div>
  );
};

export default Login;

