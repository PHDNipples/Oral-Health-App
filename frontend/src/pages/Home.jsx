import React, { useRef, useState, useEffect, useMemo } from "react";
import HTMLFlipBook from "react-pageflip";
import { TiArrowForward } from "react-icons/ti";
import AppBanner from "../components/Banner.jsx";
import TabloidHero from "../components/TabloidHero/TabloidHero.jsx";
import "./Home.css";

/* Social posts */
const socialPosts = [
  { title: "Healthy Smiles Tip", description: "Remember to brush twice a day!", img: "/images/post1.png" },
  { title: "Dental Fun", description: "Check out our latest fun dental activity.", img: "/images/post2.png" },
  { title: "Community Event", description: "We participated in a local health fair.", img: "/images/post3.png" }
];

const Home = () => {
  const parentsBook = useRef(null);
  const kiddiesBook = useRef(null);
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

  /* Flipbook pages */
  const parentsPages = useMemo(() => [
    <div className="broche-cover modern-card" key="p1">For Parents</div>,
    <div className="broche-back modern-card" key="p2">
      <h3>Hello Parents!</h3>
      <p>It’s a team effort keeping your kiddies’ teeth happy and healthy — you are the captain of the ship!</p>
      <p>Explore oral health topics, common tooth situations, and treatment options.</p>
      <p>Create a family group, track progress, and earn points together.</p>
    </div>
  ], []);

  const kiddiesPages = useMemo(() => [
    <div className="broche-cover kiddies-cover modern-card" key="k1">For Children</div>,
    <div className="broche-back mirrored-page modern-card" key="k2">
      <h3>Hello Kiddies!</h3>
      <p>Ata'ata makes keeping your teeth healthy and happy EASY.</p>
      <p>Find your teeth, add them to your profile, and learn how to keep them clean.</p>
      <p>Get to know your dentist so it’s not awkward when you meet them.</p>
      <p>Ask questions anytime and track your smile journey!</p>
    </div>
  ], []);

  /* Flipbook controls */
  const flipParentsNext = () => parentsBook.current?.pageFlip()?.flipNext();
  const flipParentsPrev = () => parentsBook.current?.pageFlip()?.flipPrev();
  const flipKiddiesNext = () => kiddiesBook.current?.pageFlip()?.flipNext();
  const flipKiddiesPrev = () => kiddiesBook.current?.pageFlip()?.flipPrev();

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

      {/* Tabloid Hero with curved ATA letters */}
      <TabloidHero />

      {/* Flipbooks */}
      <section className="broche-section">
        <div className="broche-container" ref={containerRef}>
          {/* Parents */}
          <div className="broche-wrapper">
            <HTMLFlipBook
              width={bookWidth}
              height={bookHeight}
              className="broche-flipbook parents-flip"
              ref={parentsBook}
              flipOnClick
            >
              {parentsPages}
            </HTMLFlipBook>
            <button className="flipbook-page-button parents-page-prev" onClick={flipParentsNext}><TiArrowForward /></button>
            <button className="flipbook-page-button parents-page-next" onClick={flipParentsPrev}><TiArrowForward /></button>
          </div>

          {/* Kiddies */}
          <div className="broche-wrapper mirrored-book">
            <HTMLFlipBook
              width={bookWidth}
              height={bookHeight}
              className="broche-flipbook kiddies-flip"
              ref={kiddiesBook}
              flipOnClick={false}
              drawShadow={false}
              startPage={0}
            >
              {kiddiesPages}
            </HTMLFlipBook>
            <button className="flipbook-page-button kiddies-page-prev" onClick={flipKiddiesPrev}><TiArrowForward /></button>
            <button className="flipbook-page-button kiddies-page-next" onClick={flipKiddiesNext}><TiArrowForward /></button>
          </div>
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
