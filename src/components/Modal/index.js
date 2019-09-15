import React from 'react'
import onClickOutside from 'react-onclickoutside'

const Modal = ({ handleClose, isOpen, children }) => {

    Modal.handleClickOutside = handleClose

    const outsideClick = (event) => {
        event.preventDefault()
        if (event.target === event.currentTarget) handleClose()
    }
    
	return (
        !isOpen ? null :
            <div className="fixed flex justify-center item-start z-999 top-0 left-0 w-100 h-100 bg-black-60" onClick={ outsideClick }>
                <div className="mt6" onClick={ outsideClick }>
                    <div className="relative bg-white pa4">
                        { /* <div className="absolute top-0 right-0 white bg-dark-gray w2 pvs tc" onClick={ handleClose }>X</div> */ }
                        { children }
                    </div>
                </div>
		</div>

	)
}

const clickOutsideConfig = {
  handleClickOutside: () => Modal.handleClickOutside
}

export default onClickOutside(Modal, clickOutsideConfig)