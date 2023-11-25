import Breadcrumb from 'react-bootstrap/Breadcrumb';
import "./PageHeaderStyles.scss"
import { Link } from "react-router-dom";
import shapesData from "./shapesData";
import "animate.css"

const PageHeaderComponent = ({ heading }) => {
    return (
        <section className="page-header">
            <h1 className='animate__animated animate__fadeIn'>{heading.title}</h1>
            <Breadcrumb className='animate__animated animate__fadeIn'>
            <Breadcrumb.Item href="#"><Link to="/">Home</Link></Breadcrumb.Item>
            <Breadcrumb.Item>
                {heading.breadcrumb}
            </Breadcrumb.Item>
            </Breadcrumb>
            {shapesData.map((shape, index) => (
                <div className={`shape shape${index + 1}`} key={index + 1}>
                    <img src={shape.imgSrc}  alt="shape"/>
                </div>
            ))}
        </section>
    );
};

export default PageHeaderComponent;