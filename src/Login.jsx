import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function Login({setToken}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://45.147.46.202:8080/api/user/login', {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                console.log("token", response);
                const token = response.data.jwtToken;
                localStorage.setItem('token', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setToken(token);
                navigate('/users');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div class="wrapper">

            <div class="form-wrapper sign-in">

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        <label>Kullanıcı Adı</label>
                    </div>

                    <div className="input-group">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <label>Şifre</label>
                    </div>


                    <button className={"btn"} type="submit">Login</button>
                </form>
            </div>
        </div>

    );
}

export default Login;
