// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import AtaataLogoImg from '../Logo/Ataata.svg';
import TabloidHero from './TabloidHero/TabloidHero';
import '../index.css';

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

// Amount to lower the navbar visually
const NAVBAR_VERTICAL_SHIFT = 90;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const navRefs = useRef([]);

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

  useEffect(() => {
    setNavbarColor(routeColors[location.pathname] || '#e08fff');
  }, [location]);

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

  // ===== Nav positioning along curve
  useEffect(() => {
    const updatePositions = () => {
      const P0 = { x: 0, y: 250 };
      const P1 = { x: 500, y: 100 };
      const P2 = { x: 1000, y: 250 };
      const verticalOffset = 10;
      const rotationFactor = 0.4;
      const uniformYOffset = 30;

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
        const t = x / window.innerWidth;
        const yCurve = (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t ** 2 * P2.y;
        const angle = Math.atan2(
          2 * (1 - t) * (P1.y - P0.y) + 2 * t * (P2.y - P1.y),
          2 * (1 - t) * (P1.x - P0.x) + 2 * t * (P2.x - P1.x)
        ) * rotationFactor;

        el.style.position = 'absolute';
        el.style.left = `${x}px`;
        el.style.top = `${isScrolled
          ? 60
          : yCurve - (el.offsetHeight || 24) - verticalOffset - uniformYOffset + NAVBAR_VERTICAL_SHIFT
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
        const t = x / window.innerWidth;
        const yCurve = (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t ** 2 * P2.y;
        const angle = Math.atan2(
          2 * (1 - t) * (P1.y - P0.y) + 2 * t * (P2.y - P1.y),
          2 * (1 - t) * (P1.x - P0.x) + 2 * t * (P2.x - P1.x)
        ) * rotationFactor;

        el.style.position = 'absolute';
        el.style.left = `${x}px`;
        el.style.top = `${isScrolled
          ? 60
          : yCurve - (el.offsetHeight || 24) - verticalOffset - uniformYOffset + NAVBAR_VERTICAL_SHIFT
        }px`;
        el.style.transform = isScrolled ? 'rotate(0rad)' : `rotate(${angle}rad)`;
        el.style.transition = 'top 0.2s ease, left 0.2s ease, transform 0.2s ease';
      });
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, [isScrolled, currentUser, leftLinks.length, rightLinks.length]);

  return (
    <>
      <style>{`
        .navbar-wrapper { position: relative; z-index: 1000; }
        .spacer { height: 300px; width: 100%; }

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

        .svg-arch { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; transition: all 0.3s ease-in-out; }
        .svg-arch path { transition: d 0.3s ease-in-out; }

        /* ===== Logo */
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

        /* ===== Nav links */
        .nav-links { position: fixed; left: 0; top: 0; width: 100%; pointer-events: none; }
        .nav-link { text-decoration: none; color: white; cursor: pointer; white-space: nowrap; pointer-events: auto; font-size: 1.25rem; font-weight: 500; transition: color 0.2s, top 0.6s ease, left 0.6s ease, transform 0.6s ease; }
        .nav-link.active, .nav-link:hover { color: #ffd700; }

        .dropdown { position: absolute; top: 1.5rem; left: 0; background: white; color: black; border-radius: 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); padding: 0.5rem 0; display: none; min-width: 120px; z-index: 2000; }
        .dropdown.visible { display: block; }
        .dropdown-item { padding: 0.5rem 1rem; cursor: pointer; }
        .dropdown-item:hover { background-color: #f0f0f0; }
      `}</style>

      <div className="navbar-wrapper">
        <div className={`ribbon-container ${isScrolled ? 'scrolled' : ''}`}>
          <svg className="svg-arch" viewBox="0 0 1000 650" preserveAspectRatio="none">
            <path
              fill={navbarColor}
              d={
                isScrolled
                  ? 'M 0 0 Q 500 0 1000 0 L 1000 350 Q 500 300 0 350 Z'
                  : 'M 0 400 Q 500 0 1100 450 L 1100 700 Q 500 200 0 650 Z'
              }
            />
          </svg>
        </div>

        <TabloidHero />

        <div className={`green-container ${isScrolled ? 'scrolled' : ''}`}>
          <svg className="svg-arch" viewBox="0 0 1000 250" preserveAspectRatio="none">
            <path fill="transparent" d="M0,250 Q500,30 1000,250 L1000,250 L0,250 Z" />
          </svg>
        </div>

        <div className="nav-links">
          {leftLinks.filter(link => !link.auth || currentUser).map((link, i) => (
            <div key={i} style={{ position: 'relative' }} ref={el => (navRefs.current[i] = el)}>
              <a
                onClick={() => link.isDropdown ? setLanguageDropdown(!languageDropdown) : handleLinkClick(link)}
                className="nav-link"
              >
                {link.name}
              </a>
              {link.isDropdown && (
                <div className={`dropdown ${languageDropdown ? 'visible' : ''}`}>
                  {languages.map((lang, idx) => (
                    <div key={idx} className="dropdown-item" onClick={() => handleLanguageSelect(lang)}>
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
              className="nav-link"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div
  className="logo-container"
  onClick={() => navigate('/')}
  style={{
    top: isScrolled
      ? '30px' // original top when scrolled
      : `${30 + NAVBAR_VERTICAL_SHIFT}px`, // lowered along with navbar
    transition: 'top 0.6s ease'
  }}
>
  <div className="inner-circle">
    <img
      src={AtaataLogoImg}
      alt="Ataata Logo"
      className="logo-svg"
      style={{ transform: 'translateY(0)', transition: 'transform 0.2s ease' }}
    />
  </div>
</div>

      </div>

      <div className="spacer"></div>
    </>
  );
};

export default Navbar;
