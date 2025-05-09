import './Header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Header = ({title, description, action, onBack}) => {
    // Centrado solo si el título es 'Products' (vista Politica)
    const isPolitica = title === 'Products';
    return (
        <div className="header" style={isPolitica ? { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' } : {}}>
            <div className="header-main" style={isPolitica ? { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' } : {}}>
                <div style={isPolitica ? { textAlign: 'center', width: '100%', position: 'relative' } : { position: 'relative' }}>
                    {onBack && (
                        <button
                            className="main-btn back-btn"
                            onClick={onBack}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} size="1x" />
                        </button>
                    )}
                    <h1 style={isPolitica ? { margin: 0 } : {}}>{title}</h1>
                    <p>{description}</p>
                </div>
                {action && (
                  <div className="header-action">{action}</div>
                )}
            </div>
        </div>
    )
}

export default Header;