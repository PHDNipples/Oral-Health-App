import React from 'react';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <section id="treatments">
          <h2>Treatments</h2>
          <ul>
            <li>Teeth Whitening</li>
            <li>Emergency Dental Care</li>
            <li>Dental Exam & X-Rays</li>
            <li>Hygiene Services & Dental Cleaning</li>
            <li>Dental Implants</li>
            <li>Tooth Fillings</li>
            <li>Invisalign®</li>
            <li>Partial & Full Dentures</li>
            <li>Root Canals</li>
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
        </section>
        <section id="reviews">
          <h2>Patient Reviews</h2>
          <blockquote>
            <p>"Had an appointment today to get a wire retainer put in and some fillings. The dentist did a great job - thank you!"</p>
            <footer>- Emma S, Patient</footer>
          </blockquote>
        </section>
        <section id="contact">
          <h2>Contact Us</h2>
          <p>Phone: 099507862</p>
          <p>Location: Level 1, AON Centre, 29 Customs St W, Auckland 1010</p>
        </section>
      </main>
    </div>
  );
}

export default App;
