import React from 'react'
import './Login.scss'
import instance from '../../utility/AxiosInstance';
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const navigation = useNavigate()

    const submitForm = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        if (username && password) {
            instance.post('/login', {
                username: username,
                password: password
            })
                .then(function (response) {
                    if (response.status === 200) {
                        try {
                            const token = `Bearer ${response.data.token}`
                            localStorage.setItem('loginToken', token)
                            navigation('/');
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
    return (
        <div className='login-container'>
            <div className="login-card-container">
                <div className="card-header">
                    <h1 style={{ color: 'red' }}>Web Name</h1>
                </div>
                <div className="body-section">

                    <form onSubmit={submitForm}>
                        <div className="title">
                            <h2>Admin Login</h2>
                        </div>
                        <div className="input-feild-container">
                            <div className='label-container'><label>User Name</label></div>
                            <input type="text" name="username" placeholder='Enter the user name' id='username' />
                        </div>
                        <div className="input-feild-container">
                            <div className='label-container'><label>Password</label></div>
                            <input type="password" name="password" id="password" placeholder='Enter the password' />
                        </div>
                        <div className='error-massage' style={{ opacity: '0' }}>Enter the correct user name and password</div>
                        <div className="submitButton"><input type="submit" value="Login" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
