import React from 'react';
import "./SectionStyles.scss"

const InstroductionSection = () => {
  return (
    <section className='introduction-section-wrapper'>
      <div className='image-wrapper'>
        <img src="../../../src/assets/images/cards-and-chips.png" alt="Cards and Chips" />
      </div>
      <div className="text-wrapper">
        <h3>The best platform for playing games online</h3>
        <p>Hundreds of people already joined us and play with their friends. Play slots or roullete from any part of the world.</p>
      </div>
    </section>
  );
}

export default InstroductionSection;