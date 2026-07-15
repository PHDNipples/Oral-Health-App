// src/components/AppBanner/AppBanner.jsx
import "./Banner.css";

const AppBanner = () => {
  return (
    <section className="app-banner">
      <div className="app-banner-inner">
        {/* Wordmark */}
        <div className="app-wordmark">
          <span>A T A</span>
          <span>A T A</span>
          <span>O H P</span>
        </div>

        {/* Links */}
        <div className="app-links">
          <ul>
            <li>FIND MY TEETH</li>
            <li>MY PROVIDERS</li>
          </ul>
          <ul>
            <li>LET’S TALK</li>
            <li>HEALTH</li>
          </ul>
        </div>

        {/* QR */}
        <div className="app-qr">
          <img
            src="/images/app-qr.png"
            alt="Download Ata'ata App"
          />
          <p>Download the App</p>
        </div>

        {/* Logo */}
        <div className="app-logo">
          <img
            src="/images/app-logo.png"
            alt="Ata'ata Logo"
          />
        </div>

        {/* Contact */}
        <div className="app-contact">
          <h4>CONTACT US</h4>
          <a href="ataata@gmail.com">EMAIL</a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
          >
            INSTA
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noreferrer"
          >
            TIKTOK
          </a>
        </div>
      </div>
    </section>
  );
};

export default AppBanner;
