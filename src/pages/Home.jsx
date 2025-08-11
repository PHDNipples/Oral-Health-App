import React from 'react';
import { caseStudies } from '../data/case-studies';
import { treatments } from '../data/treatments';

export default function Home() {
  return (
    // The main container for the page, setting a light gray background and padding
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      {/* Centering the content and adding a maximum width */}
      <main className="max-w-4xl mx-auto space-y-8">
        <section id="treatments">
          {/* Main section heading with bold font and bottom margin */}
          <h2 className="text-2xl font-bold mb-4">Our Treatments</h2>
          {/* A responsive grid for the treatment items */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {treatments.map((treatment, idx) => (
              <li key={idx} className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <img 
                  src={treatment.img} 
                  alt={treatment.name} 
                  // Tailwind classes for image size and margin
                  className="w-12 h-12 mr-4 rounded-full" 
                />
                <span className="text-lg font-medium">{treatment.name}</span>
              </li>
            ))}
          </ul>
        </section>
        
        <section id="who-we-are">
          <h2 className="text-2xl font-bold mb-2">Who We Are</h2>
          <p className="text-gray-700">Welcome to Oral Health App. We provide exceptional dental care with a friendly team and state-of-the-art equipment.</p>
        </section>
        
        <section id="offers">
          <h2 className="text-2xl font-bold mb-2">Offers & Promotions</h2>
          {/* Using a custom list style from Tailwind */}
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>18 Months Interest Free With Q Card</li>
            <li>ACC Dentists</li>
            <li>Afterpay</li>
            <li>Corporate Offers</li>
            <li>SuperGold Card</li>
          </ul>
        </section>
        
        <section id="team">
          <h2 className="text-2xl font-bold mb-2">Meet Our Team</h2>
          <p className="text-gray-700">Our warm and friendly team of highly-trained dentists, hygienists, and support staff are here to help you achieve the best for your oral health.</p>
        </section>
        
        <section id="payment">
          <h2 className="text-2xl font-bold mb-2">Payment Options</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Afterpay</li>
            <li>Q Mastercard & Q Card</li>
            <li>Credit Card</li>
            <li>Eftpos / Cash</li>
          </ul>
        </section>
        
        <section id="case-studies">
          <h2 className="text-2xl font-bold mb-2">Case Studies</h2>
          <p className="text-gray-700 mb-4">See before and after photos of our dental procedures and patient transformations.</p>
          {/* A responsive grid for the case studies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudies.map((study, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-center">{study.title}</h3>
                <div className="flex justify-around items-center space-x-4">
                  <div className="text-center">
                    <img src={study.before} alt={study.title + ' before'} className="w-full max-w-[200px] rounded-lg mx-auto" />
                    <p className="mt-2 text-sm text-gray-600">Before</p>
                  </div>
                  <div className="text-center">
                    <img src={study.after} alt={study.title + ' after'} className="w-full max-w-[200px] rounded-lg mx-auto" />
                    <p className="mt-2 text-sm text-gray-600">After</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-4">{study.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section id="reviews">
          <h2 className="text-2xl font-bold mb-2">Patient Reviews</h2>
          <blockquote className="italic border-l-4 border-gray-400 pl-4 text-gray-700">
            <p>"Had an appointment today to get a wire retainer put in and some fillings. The dentist did a great job - thank you!"</p>
            <footer className="mt-2 text-sm text-gray-500">- Grateful patient</footer>
          </blockquote>
        </section>
        
        <section id="contact">
          <h2 className="text-2xl font-bold mb-2">Contact Us</h2>
          <p className="text-gray-700">Phone: generic phone number</p>
          <p className="text-gray-700">Insert location here</p>
        </section>
      </main>
    </div>
  );
}
