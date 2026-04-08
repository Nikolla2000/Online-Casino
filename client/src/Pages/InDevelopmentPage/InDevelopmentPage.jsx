import { useEffect, useState } from "react";
import "./InDevelopmentStyles.scss";
import GoBackButtonV2 from "../../Components/GoBackButtonV2/GoBackButtonV2";

const SUITS = ["♠", "♥", "♦", "♣"];

const FloatingCard = ({ suit, style }) => (
  <div className="floating-card" style={style}>
    <span>{suit}</span>
  </div>
);

const InDevelopmentPage = () => {
  const [cards, setCards] = useState([]);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const generated = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      suit: SUITS[i % SUITS.length],
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 6}s`,
        animationDuration: `${6 + Math.random() * 6}s`,
        fontSize: `${1.2 + Math.random() * 2}rem`,
        opacity: 0.06 + Math.random() * 0.1,
      },
    }));
    setCards(generated);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="in-development">
      <div className="bg-cards">
        {cards.map((card) => (
          <FloatingCard key={card.id} suit={card.suit} style={card.style} />
        ))}
      </div>

      <div className="orb orb--gold" />
      <div className="orb orb--red" />

      <div className="content">
        <div className="icon-wrap">
          <div className="icon-ring" />
          <div className="icon-ring icon-ring--2" />
          <span className="icon-suit">♠</span>
        </div>

        <div className="badge">
          <span className="badge__dot" />
          Under Construction
        </div>

        <h1 className="title">
          Game in
          <br />
          <span className="title__accent">Development</span>
        </h1>

        <p className="subtitle">
          Our team is crafting an extraordinary experience for you
          <span className="dots">{dots}</span>
          <br />
          This game will be live soon. Stay tuned!
        </p>

        <div className="divider">
          <span className="divider__line" />
          <span className="divider__icon">♦</span>
          <span className="divider__line" />
        </div>

        <div className="chips">
          <div className="chip">
            <span className="chip__icon">🎰</span>
            <span>New Experience</span>
          </div>
          <div className="chip">
            <span className="chip__icon">🔒</span>
            <span>Provably Fair</span>
          </div>
          <div className="chip">
            <span className="chip__icon">⚡</span>
            <span>Coming Soon</span>
          </div>
        </div>

        <GoBackButtonV2/>
        
      </div>
    </div>
  );
};

export default InDevelopmentPage;