import React, { useRef, useEffect, useState } from 'react';
import "./SectionStyles.scss";

const IntroductionSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3, rootMargin: '-50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className='introduction-section-wrapper' ref={sectionRef}>
      <div className={`image-wrapper ${isVisible ? 'animate-in' : ''}`}>
        <img src="/images/cards-and-chips.png" alt="Cards and Chips" />
        <div className="floating-chips">
          <div className="chip chip-1"></div>
          <div className="chip chip-2"></div>
          <div className="chip chip-3"></div>
        </div>
      </div>
      
      <div className={`text-wrapper ${isVisible ? 'animate-in' : ''}`}>
        <div className="text-content">
          <h3>
            <span className="gradient-text">The Ultimate</span>
            <span className="block">Gaming Experience</span>
          </h3>
          <p>
            Join thousands of players worldwide in our immersive casino platform. 
            Enjoy thrilling slots, classic roulette, and exciting table games from 
            the comfort of your home.
          </p>
          <div className="features">
            <div className="feature">
              <span className="feature-icon">🎰</span>
              <span>100+ Games</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🌎</span>
              <span>Global Players</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🛡️</span>
              <span>Secure Platform</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IntroductionSection;