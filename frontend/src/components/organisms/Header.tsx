import React from 'react'
import './Header.css'

const Header = () => {
    return (
        <div className='headcontent'>
            <img
                className="futurep"
                src="/Frame 3 1.png"
                alt="Logo Hotel Pairumani"
            />
            <div className='datcont'>
                <div className='ussrname'>
                    <p className='usnm'>ADMIN</p>
                    <p className='profile'>Mi Perfil</p>
                </div>
                <img
                    className="avatar"
                    src="/avatar.png"
                    alt="Logo Hotel Pairumani"
                />
            </div>
        </div>
    )
}

export default Header