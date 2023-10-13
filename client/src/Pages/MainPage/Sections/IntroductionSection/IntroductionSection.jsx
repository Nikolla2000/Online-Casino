import React from 'react';
import "./SectionStyles.scss"
import TrackVisibility from 'react-on-screen';
import 'animate.css';

const IntroductionSection = () => {
  return (
      <section className='introduction-section-wrapper'>
      <TrackVisibility>
        {({ isVisible }) => (
        <div className={`image-wrapper ${isVisible && 'animate__animated animate__fadeInLeft'}`}>
          <img src="../../../src/assets/images/cards-and-chips.png" alt="Cards and Chips" />
        </div>
        )}
      </TrackVisibility>
      <TrackVisibility>
      {({ isVisible }) => (
        <div className={`text-wrapper ${isVisible && 'animate__animated animate__fadeInRight'}`}>
          <h3>The best platform for playing games online</h3>
          <p>Hundreds of people already joined us and play with their friends. Play slots or roullete from any part of the world.</p>
        </div>
      )}
        </TrackVisibility>
      </section>
  );
}

export default IntroductionSection;