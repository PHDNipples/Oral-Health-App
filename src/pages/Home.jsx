import React from 'react';
import { treatments } from '../data/treatments';

export default function Home() {
  return (
    <div className="treatments-grid">
      {treatments.map((treatment, idx) => (
        <div key={idx} className="treatment-card">
          <img src={treatment.img} alt={treatment.name} />
          <p>{treatment.name}</p>
        </div>
      ))}
    </div>
  );
}
