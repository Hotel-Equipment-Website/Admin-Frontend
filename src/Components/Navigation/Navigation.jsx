import React from 'react'
import './Navigation.scss'
// import { Link, useNavigate } from 'react-router-dom';

export default function Navigation() {
    const log_out = () => {
        localStorage.clear()
        window.location.reload();

    }
    return (
        <div className="navigation-header">
            <h1>Web Name</h1>
            <div style={{ display: 'flex', textDecoration: 'none' }}>
                <div className='home-btn'>
                    <a href='/' style={{ backgroundColor: '#ffffff71', borderRadius: '15px', fontWeight: 'bold', width: '100px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Home</a>
                </div>
                <div className='logout-btn'>
                    <a onClick={log_out} style={{ backgroundColor: '#ffffff71', borderRadius: '15px', fontWeight: 'bold', width: '100px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Log Out</a>
                </div>
            </div>
        </div>
    )
}
