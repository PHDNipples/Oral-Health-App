import React from 'react';
import Navbar from './components/Navbar';
import { caseStudies } from './data/case-studies';
import { treatments } from './data/treatments';

function App() {
  return (
    <div className="App">
      <Navbar />
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
    </div>
  );
}

export default App;
