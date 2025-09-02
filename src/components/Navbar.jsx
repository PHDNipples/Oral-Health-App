// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import '../index.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth(); // Now correctly receives 'logout'

    useEffect(() => {
        const handleScroll = () => {
            const hasScrolled = window.scrollY > 50;
            setIsScrolled(hasScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/auth');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const AtaataLogo = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 966.62 1045.63" className="logo-svg">
            <path className="fill-white" d="M474.34,248.14c-7.85-10.28-22.07-17.2-34.81-19.37-15.62-2.66-32.25-1.54-46.4,5.59-5.9,2.97-11.28,6.93-16.17,11.38-17.67,16.04-29.12,38.76-31.5,62.52-2.38,23.75,4.32,48.3,18.45,67.54,0,0,39.5,44.3,48.67,53.71,16.52,16.94,61.14,49.42,61.14,49.42-18.56-13.67-15.62-36.14-6.55-45.89,7.58-8.15,18.81-10.59,30.91-6.89,16.39,5.01,18.81,30.53,3.36,34.12,40.65,8.74,74.77-77.13,92.6-114.21,5.32-11.06,9.93-22.56,12.15-34.62,3.07-16.69,1.37-34.32-5.37-49.89-6.74-15.57-18.59-28.98-33.48-37.1-5.33-2.9-11.05-5.14-17.02-6.18-5.77-1-11.69-.87-17.51-.18-28.53,3.35-55.11,20.58-69.84,45.26" />
            <path className="fill-white" d="M475.63,247.38c-10.36-13.42-27.5-19.72-43.91-21.11-9.24-.78-18.7-.17-27.66,2.3s-17.23,7.03-24.49,12.94c-13.42,10.92-23.64,25.61-29.75,41.76s-7.85,34.44-4.8,51.81c1.55,8.84,4.31,17.46,8.14,25.57,1.91,4.06,4.11,7.99,6.57,11.75,1.08,1.64,2.14,3.34,3.44,4.82,4.91,5.6,9.92,11.1,14.89,16.64,7.7,8.58,15.41,17.15,23.18,25.66,5.97,6.53,11.94,12.97,18.56,18.85,9.78,8.68,20.08,16.79,30.44,24.77,7.14,5.5,14.34,10.93,21.61,16.26.37.27.74.54,1.11.81,1.57,1.14,3.04-1.45,1.51-2.59-7.37-5.49-12.36-13.71-12.89-22.97-.41-7.08,1.54-14.83,6.33-20.22,7.12-8,18.05-9.94,28.11-7.31,3.85,1.01,7.14,2.83,9.72,5.91,2.18,2.6,3.58,5.82,4.21,9.14,1.34,7.03-1.42,14.84-8.93,16.65-1.4.34-1.46,2.59,0,2.89,8.81,1.86,17.54-.6,25.04-5.34,8.91-5.63,16.09-13.72,22.4-22.05,7.4-9.78,13.71-20.36,19.55-31.12,5.84-10.78,11.18-21.82,16.37-32.92,2.26-4.84,4.49-9.7,6.74-14.55,2.51-5.42,5.17-10.77,7.57-16.24,3.65-8.33,6.76-16.93,8.58-25.85s2.31-17.48,1.53-26.24c-1.49-16.66-7.7-32.63-18.33-45.59-10.12-12.36-24.88-22.82-40.95-25.18-8.54-1.25-17.34-.38-25.74,1.44-7.35,1.6-14.5,4.12-21.27,7.39-13.5,6.52-25.49,16.18-34.65,28.04-2.24,2.91-4.32,5.93-6.2,9.08-.99,1.66,1.6,3.17,2.59,1.51,7.52-12.55,18.09-23.15,30.48-30.91,12.56-7.86,27.03-12.91,41.84-13.97,9.08-.65,17.85.73,26.13,4.57,6.99,3.24,13.4,7.68,18.99,12.98,11.5,10.9,19.29,25.2,22.6,40.66,1.79,8.39,2.26,17.05,1.52,25.59-.77,8.8-2.98,17.41-6,25.7-4.21,11.56-9.94,22.6-15.11,33.76-4.85,10.47-9.76,20.92-15.05,31.18-5.56,10.79-11.5,21.41-18.3,31.47-6,8.87-12.72,17.49-20.97,24.38-6.42,5.36-14.26,9.77-22.82,9.87-1.93.02-3.85-.17-5.74-.56v2.89c7.71-1.86,11.73-9.17,11.45-16.75s-4.79-15.84-12.12-19.23c-5.06-2.34-11.21-3.17-16.74-2.64s-10.89,2.57-15.3,6.09c-6.74,5.37-10.2,13.78-10.55,22.27-.48,11.56,5.24,21.95,14.4,28.76l1.51-2.59c-5.11-3.72-10.16-7.51-15.2-11.33-10.06-7.62-20.02-15.38-29.7-23.48-7.29-6.1-14.24-12.47-20.71-19.44-7.22-7.78-14.32-15.67-21.42-23.56-6.44-7.15-12.86-14.31-19.27-21.49-1.16-1.3-2.46-2.55-3.47-3.97-5.1-7.17-9.27-14.94-12.28-23.21-5.98-16.44-7.59-34.45-4.15-51.63s10.88-32.01,21.88-44.67c5.78-6.65,12.47-12.67,20.06-17.17s16.72-7.36,25.78-8.3c16.88-1.75,34.92,1.4,48.8,11.59,3.07,2.25,5.92,4.91,8.25,7.93.5.65,1.28.98,2.05.54.63-.36,1.03-1.41.54-2.05h0Z" />
        </svg>
    );

    return (
        <>
            <style>
                {`
                .rainbow-container {
                    position: fixed;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 100vw;
                    overflow: hidden;
                    z-index: 50;
                    top: 0;
                    height: 250px;
                    background-color: transparent;
                    transition: all 0.3s ease-in-out;
                }
                .rainbow-container.scrolled {
                    height: -500px;
                    width: 100%;
                }
                
                .svg-arch {
                    position: absolute;
                    top: 0px;
                    bottom: 100px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                    transition: all 0.3s ease-in-out;
                }
                .svg-arch path {
                    transition: d 0.3s ease-in-out;
                }
                .svg-arch.scrolled {
                    transform: translateX(50%) translateY(400px);
                }
                
                .logo-container {
                    position: fixed;
                    top: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 200px;
                    height: 200px;
                    background-color: #00539b;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                    z-index: 1001;
                    transition: all 0.3s ease-in-out;
                }
                .logo-container.scrolled {
                    top: 0;
                    transform: translateX(-50%) scale(1);
                }
                .inner-circle {
                    width: 150px;
                    height: 150px;
                    background-color: white;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .logo-svg {
                    height: 90px;
                    width: auto;
                }
                .fill-white {
                    fill: white;
                }
                
                .nav-links {
                    position: fixed;
                    top: 110px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1002;
                    color: white;
                    font-size: 1.25rem;
                    font-weight: 500;
                    margin-left: 0;
                    padding: 0;
                    transition: all 0.3s ease-in-out;
                }
                .nav-links.scrolled {
                    top: 60px;
                    font-size: 1rem;
                }
                .nav-links a {
                    text-decoration: none;
                    color: inherit;
                    margin: 0 4rem;
                    cursor: pointer;
                    transition: color 0.2s;
                    white-space: nowrap;
                }
                .nav-links a:hover {
                    color: #ffd700;
                }
                `}
            </style>
            
            {/* Main ribbon background */}
            <div className={`rainbow-container ${isScrolled ? 'scrolled' : ''}`}>
                <svg className={`svg-arch`} viewBox="0 0 1000 650" preserveAspectRatio="none">
                    <path fill="#00539b" d={isScrolled ?
                        "M 0 0 Q 500 0 1000 0 L 1000 350 Q 500 300 0 350 Z" : 
                        "M 0 400 Q 500 0 1100 450 L 1100 700 Q 500 200 0 650 Z"} />
                </svg>
            </div>

            {/* Independent logo and links containers */}
            <div className={`logo-container ${isScrolled ? 'scrolled' : ''}`}>
                <div className="inner-circle">
                    <AtaataLogo />
                </div>
            </div>
            <div className={`nav-links ${isScrolled ? 'scrolled' : ''}`}>
                <a onClick={() => navigate('/')}>Home</a>
                {currentUser && (
                    <a onClick={() => navigate('/profile')}>Profile</a>
                )}
                <a onClick={currentUser ? handleLogout : () => navigate('/auth')}>
                    {currentUser ? 'Logout' : 'Login'}
                </a>
            </div>
        </>
    );
};

export default Navbar;