import './SectionLabel.scss';

const SectionLabel = ({ children }) => (
  <div className="section-label">
    <span className="section-label__line" />
    <span className="section-label__text">{children}</span>
    <span className="section-label__line" />
  </div>
);

export default SectionLabel;