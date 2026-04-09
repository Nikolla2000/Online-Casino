import './FeatureCardStyles.scss';

const FeatureCard = ({ icon, title, desc, index }) => (
  <div className="feature-card" style={{ animationDelay: `${0.05 + index * 0.06}s` }}>
    <span className="feature-card__icon">{icon}</span>
    <h4 className="feature-card__title">{title}</h4>
    <p className="feature-card__desc">{desc}</p>
  </div>
);

export default FeatureCard;