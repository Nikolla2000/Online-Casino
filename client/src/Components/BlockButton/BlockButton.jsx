import './ButtonStyles.scss';

const BlockButton = ({ setShowBlockConfirm }) => {

  const handleOpenBlock = () => {
    setShowBlockConfirm(true);
  }

  return (
    <button className="action-btn-badge block" onClick={handleOpenBlock}>
      <span>Block</span>
    </button>
  )
}

export default BlockButton