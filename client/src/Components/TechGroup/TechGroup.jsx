import './TechGroupStyles.scss';

const TechGroup = ({ category, color, items }) => (
  <div className={`tech-group tech-group--${color}`}>
    <div className="tech-group__header">
      <span className="tech-group__category">{category}</span>
    </div>
    <ul className="tech-group__list">
      {items.map((item) => (
        <li key={item.name} className="tech-item">
          <span className="tech-item__name">{item.name}</span>
          <p className="tech-item__desc">{item.desc}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default TechGroup;