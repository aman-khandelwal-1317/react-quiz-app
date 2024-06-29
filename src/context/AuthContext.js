import React, { createContext, useState, useEffect } from 'react';
import api from '../context/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/api/auth/me', {
                        headers: { 'x-auth-token': token },
                    });
                    console.log('fetching user')
                    setUser(res.data);
                    
                } catch (err) {
                    console.error(err);
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, []);


    const logout = () => {
      localStorage.removeItem('token');
      setUser(null);
  };


  return (
    <AuthContext.Provider value={{ user, setUser,logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};


export { AuthContext, AuthProvider };

