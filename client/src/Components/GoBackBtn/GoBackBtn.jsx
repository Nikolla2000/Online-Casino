import {Link} from "react-router-dom";
import "./GoBackBtn.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

const GoBackBtn = ({ children, path }) => {
   return (
    <Link to={path} className="goback-btn">
        <div className="text">{children}</div>
        <div className="arrow-icon">
            <FontAwesomeIcon icon={faAngleRight} style={{color: "#f1f4f8",}} />
        </div>
    </Link>

   )
}

export default GoBackBtn;