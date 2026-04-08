import './GoBackButtonV2Styles.scss';


const GoBackButtonV2 = ({ onBack }) => {

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            window.history.back();
        }
    }

    return (
        <button className="btn-back" onClick={handleBack}>
            <span className="btn-back__arrow">←</span>
            <span className="btn-back-text">Back</span> 
        </button>
    )
}

export default GoBackButtonV2;