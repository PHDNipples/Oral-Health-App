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
        const widthPerBook = containerWidth / 1.6 - 20; 
        setBookWidth(widthPerBook);
        setBookHeight(Math.min(widthPerBook * 1.33, 500)); 
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
      justifyContent: "center",
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
      gap: "80px"
    }}
  >
{/* Parents Sticker with hidden message */}
<div className="sticker-wrapper" style={{ width: bookWidth }}>
  <div className="sticker-message parents-message">
    <h3 className="sticker-title">Hello parents!</h3>

    <div className="sticker-body">
      <p>
        It's a team effort keeping your kiddies' teeth happy and healthy,
        and you are the captain of our ship! Use our website (and app) to learn more about oral health.
      </p>

      <p>
        Have a look at common tooth situations and what the common treatment options are.
      </p>

      <p>
        Sign up and login to keep up with your own oral health because ultimately,
        children learn lifelong oral health habits from the example and guidance of their parents and caregiver.
      </p>

      <p>
        Feel free to create a family group so that you can help monitor and encourage
        your kiddy to reach their oral health goals. Together gain points to be in to win sweet prizes –
        who knows, it could be you guys pulling a mean pukana at the next Warriors game 😎
      </p>

      <p>
        Find your local provider and get to know more about what happens at your kids' yearly check-up.
      </p>

      <p>
        If there is anything we haven't covered, send a message to one of our dentists
        and we'll do our best to have your questions answered.
      </p>
    </div>
  </div>

  <StickerPeel
    imageSrc={parentsLogo}
    width={bookWidth}
    rotate={5}
    peelBackHoverPct={15}
    peelBackActivePct={85}
    shadowIntensity={0.5}
    lightingIntensity={0.1}
    peelDirection={90}
    className="parents-sticker"
  />
</div>
{/* Kiddies Sticker with hidden message */}
<div className="sticker-wrapper" style={{ width: bookWidth }}>
  <div className="sticker-message kiddies-message">
    <h3 className="sticker-title">Hello greatness!</h3>

    <div className="sticker-body">
      <p>
        Us at Ata'ata want to make keeping your teeth healthy and happy easy.
        Through this website and on our app you can find almost anything when it comes to teeth.
      </p>

      <p>
        Ever wonder if your teeth are normal? If there is anything you need to fix,
        find your teeth and add them to your profile.
      </p>

      <p>Explore how EASY it is to keep your teeth clean.</p>

      <p>
        Get to know your local dentist or oral health therapist so it's not so awkward when you meet them.
      </p>

      <p>
        Have any questions about your mouth? Flick a message through to one of our dentists and they'll get you sorted.
      </p>

      <p>Sign up and login to get your teeth on the right track.</p>
    </div>
  </div>

  <StickerPeel
    imageSrc={kiddiesLogo}
    width={bookWidth}
    rotate={-5}
    peelBackHoverPct={20}
    peelBackActivePct={85}
    shadowIntensity={0.6}
    lightingIntensity={0.15}
    peelDirection={-90}
    className="kiddies-sticker"
  />
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