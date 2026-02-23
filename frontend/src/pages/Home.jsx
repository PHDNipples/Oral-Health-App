import React, { useRef, useState, useEffect, useMemo } from "react";
import { TiArrowForward } from "react-icons/ti";
import AppBanner from "../components/Banner.jsx";
import StickerPeel from "../components/StickerPeel"; 
import parentsLogo from "../images/parents-sticker.png"; 
import kiddiesLogo from "../images/kiddies-sticker.png"; 
import "./Home.css";

/* Social posts */
const socialPosts = [
  { title: "Healthy Smiles Tip", description: "Remember to brush twice a day!", img: "/images/post1.png" },
  { title: "Dental Fun", description: "Check out our latest fun dental activity.", img: "/images/post2.png" },
  { title: "Community Event", description: "We participated in a local health fair.", img: "/images/post3.png" }
];

const Home = () => {
  const containerRef = useRef(null);

  const [bookWidth, setBookWidth] = useState(300);
  const [bookHeight, setBookHeight] = useState(400);

  /* Dynamically resize flipbooks */
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const widthPerBook = containerWidth / 2 - 20; // spacing between books
        setBookWidth(widthPerBook);
        setBookHeight(Math.min(widthPerBook * 1.33, 500)); // maintain aspect ratio
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  /* Social carousel */
  const [index, setIndex] = useState(0);
  const startX = useRef(0);
  const startTime = useRef(0);

  const rotate = (step) => setIndex((prev) => (prev + step + socialPosts.length) % socialPosts.length);

  const offsetFromCenter = (i) => {
    let diff = i - index;
    const total = socialPosts.length;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  const onStart = (x) => { startX.current = x; startTime.current = Date.now(); };
  const onEnd = (x) => {
    const dx = x - startX.current;
    const dt = Date.now() - startTime.current;
    const velocity = Math.abs(dx / dt);
    if (Math.abs(dx) < 40) return;
    let steps = 1;
    if (velocity > 1.2) steps = 3;
    else if (velocity > 0.8) steps = 2;
    rotate(dx > 0 ? -steps : steps);
  };

  return (
    <main>
      {/* Announcement */}
      <section className="announcement-banner">
        <div className="announcement-content">
          <img src="/images/announcement-left.png" className="announcement-image" alt="Left Banner"/>
          <div className="announcement-text">
            <h2 className="announcement-title">Welcome</h2>
            <p>Welcome to the Ata'ata oral health programme.</p>
          </div>
          <img src="/images/announcement-right.png" className="announcement-image" alt="Right Banner"/>
        </div>
      </section>

      {/* Sticker Peel Section */}
<section className="broche-section">
  <div
    className="broche-container"
    ref={containerRef}
    style={{
      display: "flex",
      justifyContent: "space-between", 
      width: "100%",
      maxWidth: "1000px",
      margin: "0 auto",
      gap: "20px"
    }}
  >
    {/* Parents Sticker */}
    <StickerPeel
      imageSrc={parentsLogo}
      width={bookWidth * 1}
      rotate={5}
      peelBackHoverPct={15}
      peelBackActivePct={85}
      shadowIntensity={0.5}
      lightingIntensity={0.1}
      peelDirection={90}
      className="parents-sticker"
    />

    {/* Kiddies Sticker */}
    <StickerPeel
      imageSrc={kiddiesLogo}
      width={bookWidth * 1}
      rotate={-5}
      peelBackHoverPct={20}
      peelBackActivePct={85}
      shadowIntensity={0.6}
      lightingIntensity={0.15}
      peelDirection={-90}
      className="kiddies-sticker"
    />
  </div>
</section>

      {/* Social Section */}
      <section className="social-section">
        <div className="social-description">
          <h2>{socialPosts[index].title}</h2>
          <p>{socialPosts[index].description}</p>
        </div>

        <div
          className="social-rolodex"
          onMouseDown={(e) => onStart(e.clientX)}
          onMouseUp={(e) => onEnd(e.clientX)}
          onTouchStart={(e) => onStart(e.touches[0].clientX)}
          onTouchEnd={(e) => onEnd(e.changedTouches[0].clientX)}
        >
          <button className="rolodex-arrow left" onClick={() => rotate(-1)}>‹</button>
          <div className="rolodex-stage">
            {socialPosts.map((p, i) => {
              const offset = offsetFromCenter(i);
              return (
                <div
                  key={i}
                  className={`rolodex-card ${offset === 0 ? "active" : ""}`}
                  onClick={() => offset !== 0 && rotate(offset)}
                  style={{
                    transform: `translateX(${offset * 140}px) translateZ(${-Math.abs(offset) * 110}px) rotateY(${offset * -30}deg) scale(${offset === 0 ? 1 : 0.9})`,
                    zIndex: 10 - Math.abs(offset)
                  }}
                >
                  <img src={p.img} alt={p.title} />
                </div>
              );
            })}
          </div>
          <button className="rolodex-arrow right" onClick={() => rotate(1)}>›</button>
          <div className="rolodex-dots">
            {socialPosts.map((_, i) => (
              <span key={i} className={i === index ? "active" : ""} />
            ))}
          </div>
        </div>
      </section>

      {/* App Banner */}
      <AppBanner />
      
    </main>
  );
};

export default Home;
