import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import './App.css';
import Login from "./Login";
import UserDatatable from "./UserDatatable";
import axios from 'axios';
import { isTokenExpired } from './jwtutil';

const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token && !isTokenExpired(token)) {
            setAuthToken(token);
            console.log("app.js", token)
        } else {
            setToken(null);
            localStorage.removeItem('token');
        }
    }, [token]);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/users" element={token ? <UserDatatable /> : <Navigate to="/login" />} />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
