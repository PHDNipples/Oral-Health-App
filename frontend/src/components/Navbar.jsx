// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import AtaataLogoImg from '../Logo/Ataata.svg';
import TabloidHero from './TabloidHero/TabloidHero';
import LogoSpinner from './LogoSpinner';
import { gsap } from 'gsap';
import '../index.css';
import './Navbar.css';
import { NAVBAR_CURVE, getCurveAngle, getCurveY } from './navbarCurve';

const routeColors = {
  '/': '#e08fff',
  '/profile': '#6db1ff',
  '/my-providers': '#ff80df',
  '/find-my-teeth': '#ff5b71ff',
  '/lets-talk': '#fe7070',
  '/auth': '#e08fff',
  '/health': '#e696d2ff',
  '/test': '#9ca3af'
};

const NAVBAR_VERTICAL_SHIFT = 90;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const navRefs = useRef([]);
  const pillRef = useRef(null);
  const [activeEl, setActiveEl] = useState(null);
  const logoRef = useRef(null);

  const leftLinks = [
    { name: 'Language', path: '#', isDropdown: true },
    { name: 'FMT', path: '/find-my-teeth' },
    { name: 'Health', path: '/health' }
  ];

  const rightLinks = [
    { name: 'My Providers', path: '/my-providers' },
    { name: "Let's Talk", path: '/lets-talk' },
    ...(import.meta.env.DEV ? [{ name: 'Test', path: '/test' }] : []),
    { name: currentUser ? 'Logout' : 'Login', path: '/auth', action: currentUser ? logout : null }
  ];

  const languages = ['English', 'Spanish', 'French', 'German'];

  const [navbarColor, setNavbarColor] = useState(routeColors[location.pathname] || '#e08fff');

  // Update navbar color per route
  useEffect(() => {
    setNavbarColor(routeColors[location.pathname] || '#e08fff');
  }, [location]);

  // Track scroll for logo/nav animation
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = async (link) => {
    if (link.action) {
      try {
        await link.action();
        navigate('/auth');
      } catch (error) {
        console.error('Action failed', error);
      }
    } else if (!link.isDropdown) {
      navigate(link.path);
    }
  };

  const handleLanguageSelect = (lang) => {
    setLanguageDropdown(false);
    console.log('Selected language:', lang);
  };

// Increase this value to lower links; decrease it to raise them.
const NAV_LINK_VERTICAL_OFFSET = 45;

  // ===== Update nav link positions
  useEffect(() => {
    const updatePositions = () => {
      const logo = document.querySelector('.logo-container');
      const logoWidth = logo?.offsetWidth || 200;
      const logoX = window.innerWidth / 2 - logoWidth / 2;
      const logoRightX = logoX + logoWidth;
      const gap = 160;
      const middleGapFactor = 0.8;

      // Left links
      const visibleLeft = leftLinks.filter(link => !link.auth || currentUser);
      const leftRange = logoX * middleGapFactor;
      visibleLeft.forEach((link, i) => {
        const el = navRefs.current[i];
        if (!el) return;
        const spacing = leftRange / visibleLeft.length;
        const x = logoX - spacing * (visibleLeft.length - i);
        el.style.position = 'absolute';
        el.style.left = `${x}px`;
        const linkWidth = el.offsetWidth || 24;
        const linkHeight = el.offsetHeight || 24;
        const linkCenterX = x + linkWidth / 2;
        const yCurve = getCurveY(linkCenterX, window.innerWidth, NAVBAR_CURVE);
        const angle = getCurveAngle(linkCenterX, window.innerWidth, NAVBAR_CURVE);
        el.style.top = `${isScrolled
          ? 60
          : yCurve + NAVBAR_VERTICAL_SHIFT + NAV_LINK_VERTICAL_OFFSET - linkHeight / 2
        }px`;
        el.style.transform = isScrolled ? 'rotate(0rad)' : `rotate(${angle}rad)`;
        el.style.transition = 'top 0.2s ease, left 0.2s ease, transform 0.2s ease';
      });

      // Right links
      const visibleRight = rightLinks;
      const rightRange = window.innerWidth - logoRightX - gap;
      visibleRight.forEach((link, i) => {
        const el = navRefs.current[visibleLeft.length + i];
        if (!el) return;
        const spacing = rightRange / visibleRight.length;
        const x = logoRightX + spacing * (i + 1);
        el.style.position = 'absolute';
        el.style.left = `${x}px`;
        const linkWidth = el.offsetWidth || 24;
        const linkHeight = el.offsetHeight || 24;
        const linkCenterX = x + linkWidth / 2;
        const yCurve = getCurveY(linkCenterX, window.innerWidth, NAVBAR_CURVE);
        const angle = getCurveAngle(linkCenterX, window.innerWidth, NAVBAR_CURVE);
        el.style.top = `${isScrolled
          ? 60
          : yCurve + NAVBAR_VERTICAL_SHIFT + NAV_LINK_VERTICAL_OFFSET - linkHeight / 2
        }px`;
        el.style.transform = isScrolled ? 'rotate(0rad)' : `rotate(${angle}rad)`;
        el.style.transition = 'top 0.2s ease, left 0.2s ease, transform 0.2s ease';
      });
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, [isScrolled, currentUser, leftLinks.length, rightLinks.length]);

  // ===== Pill animation for hover + active route
  useEffect(() => {
    const pill = pillRef.current;
    if (!pill) return;

    // Determine active link based on route
    const allLinks = [...leftLinks.filter(link => !link.auth || currentUser), ...rightLinks];
    const activeIndex = allLinks.findIndex(link => link.path === location.pathname);
    const defaultActive = navRefs.current[activeIndex] || null;

    const targetEl = activeEl || defaultActive;
    if (!targetEl) {
      pill.style.opacity = 0;
      return;
    }

    const rect = targetEl.getBoundingClientRect();
    const navbarRect = pill.parentElement.getBoundingClientRect();

    pill.style.width = `${rect.width}px`;
    pill.style.height = `${rect.height}px`;
    pill.style.left = `${rect.left - navbarRect.left}px`;
    pill.style.top = `${rect.top - navbarRect.top}px`;
    pill.style.opacity = 1;
    pill.style.transform = targetEl.style.transform;
    pill.style.transition = 'all 0.2s ease';
  }, [activeEl, location.pathname, currentUser]);

  return (
    <>
      <style>{`
        .navbar-wrapper { position: relative; z-index: 1000; }
        .spacer { height: 0px; width: 100%; }

        .ribbon-container, .green-container {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          width: 100vw;
          overflow: hidden;
          z-index: 50;
          transition: top 0.6s ease;
        }
        .ribbon-container { height: 250px; top: ${NAVBAR_VERTICAL_SHIFT}px; }
        .green-container { height: 120px; top: ${NAVBAR_VERTICAL_SHIFT + 80}px; }
        .ribbon-container.scrolled, .green-container.scrolled { top: 0; }

        .svg-arch { 
  position: absolute; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%; 
  z-index: 1; 
  pointer-events: none;   /* ← ADD THIS */
  transition: all 0.3s ease-in-out; 
}

.svg-arch * {
  pointer-events: none;   /* ← ADD THIS TOO */
}

        .logo-container {
          position: fixed;
          top: ${NAVBAR_VERTICAL_SHIFT + 30}px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 200px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1005;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          background-color: ${navbarColor};
          border: 5px solid #ffffff;
          transition: all 0.6s ease;
          cursor: pointer;
        }
        .logo-container.scrolled { top: 30px; width: 220px; height: 220px; }

        .inner-circle { width: 180px; height: 180px; border-radius: 50%; background-color: white; display: flex; justify-content: center; align-items: center; transition: all 0.4s ease-in-out; }
        .logo-container.scrolled .inner-circle { width: 160px; height: 160px; }
        .logo-svg { height: 325px; width: auto; transform: translateY(10px); transition: all 0.6s ease; }
        .logo-container.scrolled .logo-svg { height: 250px; transform: translateY(0); }

        .nav-links { position: fixed; left: 0; top: 0; width: 100%; pointer-events: auto; }
        .nav-link { text-decoration: none; color: white; cursor: pointer; white-space: nowrap; pointer-events: auto; font-size: 1.25rem; font-weight: 500; transition: color 0.2s, top 0.6s ease, left 0.6s ease, transform 0.6s ease; }
        .nav-link.active, .nav-link:hover { color: #ffd700; }

        .dropdown { position: absolute; top: 1.5rem; left: 0; background: white; color: black; border-radius: 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); padding: 0.5rem 0; display: none; min-width: 120px; z-index: 2000; }
        .dropdown.visible { display: block; }
        .dropdown-item { padding: 0.5rem 1rem; cursor: pointer; }
        .dropdown-item:hover { background-color: #f0f0f0; }

        .navbar-pill {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          pointer-events: none;
          opacity: 0;
          z-index: 0;
          transition: all 0.2s ease;
        }
          
      `}</style>

      {/* ================= Navbar Wrapper ================= */}
{/* ================= Navbar Wrapper ================= */}
<div className="navbar-wrapper">
  {/* Ribbon background */}
  <div className={`ribbon-container ${isScrolled ? 'scrolled' : ''}`}>
    <svg className="svg-arch" viewBox="0 0 1000 650" preserveAspectRatio="none">
      <path
        fill={navbarColor}
        d={
          isScrolled
            ? 'M 0 0 Q 500 0 1000 0 L 1000 350 Q 500 300 0 350 Z'
            : 'M 0 400 Q 500 0 1100 450 L1100 700 Q 500 200 0 650 Z'
        }
      />
    </svg>
  </div>

  {/* Green container */}
  <div className={`green-container ${isScrolled ? 'scrolled' : ''}`}>
    <svg className="svg-arch" viewBox="0 0 1000 250" preserveAspectRatio="none">
      <path fill="transparent" d="M0,250 Q500,30 1000,250 L1000,250 L0,250 Z" />
    </svg>
  </div>

  {/* Nav Links */}
  <div className="nav-links">
    {leftLinks
      .filter(link => !link.auth || currentUser)
      .map((link, i) => (
        <div
          key={i}
          style={{ position: 'relative' }}
          ref={el => (navRefs.current[i] = el)}
          onMouseEnter={() => setActiveEl(navRefs.current[i])}
          onMouseLeave={() => setActiveEl(null)}
        >
          <a
            onClick={() =>
              link.isDropdown
                ? setLanguageDropdown(!languageDropdown)
                : handleLinkClick(link)
            }
            className="nav-link"
          >
            {link.name}
          </a>

          {link.isDropdown && (
            <div className={`dropdown ${languageDropdown ? 'visible' : ''}`}>
              {languages.map((lang, idx) => (
                <div
                  key={idx}
                  className="dropdown-item"
                  onClick={() => handleLanguageSelect(lang)}
                >
                  {lang}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

    {rightLinks.map((link, i) => (
      <a
        key={i}
        ref={el => (navRefs.current[leftLinks.length + i] = el)}
        onClick={() => handleLinkClick(link)}
        onMouseEnter={() => setActiveEl(navRefs.current[leftLinks.length + i])}
        onMouseLeave={() => setActiveEl(null)}
        className="nav-link"
      >
        {link.name}
      </a>
    ))}
  </div>
</div>

{/* ================= Logo ================= */}
<div
  className="logo-container"
  onClick={() => navigate('/')}
  ref={logoRef}
  style={{
    top: isScrolled ? '30px' : `${30 + NAVBAR_VERTICAL_SHIFT}px`,
    transition: 'top 0.6s ease',
    cursor: 'pointer'
  }}
>
  <div className="inner-circle" style={{ position: "relative" }}>

    {/* BLUE CROSSHAIR — marks the true center of the inner-circle container */}
    {/* DELETE these two divs when done aligning */}
    <div style={{
      position: "absolute",
      top: "50%",
      left: 0,
      width: "100%",
      height: "2px",
      background: "transparent",
      opacity: 0.8,
      pointerEvents: "none",
      zIndex: 9999,
      transform: "translateY(-50%)"
    }}/>
    <div style={{
      position: "absolute",
      left: "50%",
      top: 0,
      width: "2px",
      height: "100%",
      background: "transparent",
      opacity: 0.8,
      pointerEvents: "none",
      zIndex: 9999,
      transform: "translateX(-50%)"
    }}/>

    <LogoSpinner
      src={AtaataLogoImg}
      className="logo-svg"
    />
  </div>
</div>

{/* ================= Hero Section Wrapper ================= */}
<TabloidHero isScrolled={isScrolled} />
<div className="spacer"></div>
    </>
  );
};

export default Navbar;