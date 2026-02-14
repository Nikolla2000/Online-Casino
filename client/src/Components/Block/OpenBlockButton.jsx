import './ButtonStyles.scss';

const OpenBlockButton = ({ setShowBlockConfirm, isBlocked }) => {

  const handleOpenBlock = () => {
    setShowBlockConfirm(true);
  }

  return (
    <button className={`action-btn-badge ${isBlocked ? 'unblock' : 'block'}`} onClick={handleOpenBlock}>
      <span>{isBlocked ? 'Unblock' : 'Block'}</span>
    </button>
  )
}

export default OpenBlockButton