import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Import your components and data
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage'; // Make sure this path is correct
import { useAuth } from './context/useAuth';
import { caseStudies } from './data/case-studies';
import { treatments } from './data/treatments';

// Global variables for Firebase config and auth token (provided by the environment)
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Safely initialize Firebase to prevent the "duplicate app" error
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

const HomeContent = () => (
  <main>
    <section id="treatments">
      <h2>Treatments</h2>
      <ul className="treatments-list">
        {treatments.map((treatment, idx) => (
          <li key={idx} className="treatment-item">
            <img src={treatment.img} alt={treatment.name} width={40} height={40} style={{marginRight: '1rem', verticalAlign: 'middle'}} />
            {treatment.name}
          </li>
        ))}
      </ul>
    </section>
    <section id="who-we-are">
      <h2>Who We Are</h2>
      <p>Welcome to Oral Health App. We provide exceptional dental care with a friendly team and state-of-the-art equipment.</p>
    </section>
    <section id="offers">
      <h2>Offers & Promotions</h2>
      <ul>
        <li>18 Months Interest Free With Q Card</li>
        <li>ACC Dentists</li>
        <li>Afterpay</li>
        <li>Corporate Offers</li>
        <li>SuperGold Card</li>
      </ul>
    </section>
    <section id="team">
      <h2>Meet Our Team</h2>
      <p>Our warm and friendly team of highly-trained dentists, hygienists, and support staff are here to help you achieve the best for your oral health.</p>
    </section>
    <section id="payment">
      <h2>Payment Options</h2>
      <ul>
        <li>Afterpay</li>
        <li>Q Mastercard & Q Card</li>
        <li>Credit Card</li>
        <li>Eftpos / Cash</li>
      </ul>
    </section>
    <section id="case-studies">
      <h2>Case Studies</h2>
      <p>See before and after photos of our dental procedures and patient transformations.</p>
      <div className="case-studies-grid">
        {caseStudies.map((study, idx) => (
          <div key={idx} className="case-study">
            <h3>{study.title}</h3>
            <div className="case-images">
              <div>
                <img src={study.before} alt={study.title + ' before'} width={200} />
                <p>Before</p>
              </div>
              <div>
                <img src={study.after} alt={study.title + ' after'} width={200} />
                <p>After</p>
              </div>
            </div>
            <p>{study.description}</p>
          </div>
        ))}
      </div>
    </section>
    <section id="reviews">
      <h2>Patient Reviews</h2>
      <blockquote>
        <p>"Had an appointment today to get a wire retainer put in and some fillings. The dentist did a great job - thank you!"</p>
        <footer>- Grateful patient </footer>
      </blockquote>
    </section>
    <section id="contact">
      <h2>Contact Us</h2>
      <p>Phone: generic phone number</p>
      <p> Insert location here </p>
    </section>
  </main>
);

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  useEffect(() => {
    const signIn = async () => {
      if (loading || currentUser) return;
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Firebase Auth error:", error);
      }
    };
    signIn();
  }, [currentUser, loading]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Loading...</div>;
  }

  return currentUser ? children : <Navigate to="/auth" />;
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const onNavigateToHome = () => {
    navigate('/');
  };

  return (
    <div className="App">
      {location.pathname !== '/auth' && <Navbar />}
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<ProtectedRoute><HomeContent /></ProtectedRoute>} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage
                userId={currentUser?.uid || 'anonymous'}
                db={db}
                auth={auth}
                onNavigateToHome={onNavigateToHome}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
