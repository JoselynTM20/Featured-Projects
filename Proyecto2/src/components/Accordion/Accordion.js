import { useState } from "react";
import "./Accordion.css";

const Accordion = ({title, children}) => {

    const [isOpen, setIsOpen] = useState(false);

    console.log(isOpen);
    
    
    const openHandler = (text)=> {
        console.log(text);
        setIsOpen(!isOpen)
    }

    return (
        <div className="accordion">
            <div 
                className={`accordion__title ${isOpen ? "open" : ""}`} 
                onClick={()=>openHandler("clicked!")}
            >
                {title}
            </div>
            <div className={`accordion__item ${!isOpen ? "collapsed" : ""}`}>
                <div className="accordion__content">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Accordion;