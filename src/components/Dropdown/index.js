import React, { useState } from 'react'
import onClickOutside from 'react-onclickoutside'

const Dropdown = ({ buttonText, header, items, selectedItems, toggleSelection, beginOpen }) => {
	const [isOpen, setIsOpen] = useState(beginOpen || false)

	Dropdown.handleClickOutside = () => setIsOpen(false)
	return (
		<div className="relative flex flex-column">
			<button 
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="button-reset input-reset bg-transparent bw0 f3 focus"
			>
			{ buttonText }
			</button>
			{ isOpen && <div className="absolute z-999 top-2 flex flex-column w5 ma0 pa0 pb3 br2 bg-white shadow-1">
					<div className="ph3 pv3 f6 small-caps gray">{ header }</div>
					{
						items.map((item, index) => (
							<div key={`${item}-${index}`} className="ph3 pv2 hover-bg-light-gray" onClick={() => toggleSelection(item)} >
								{item}
								{
									selectedItems.indexOf(item) !== -1 && <span role="img" aria-label="checked"> ✔</span>
								}
							</div>
						))
					}
				</div>
			}
		</div>

	)
}

const clickOutsideConfig = {
  handleClickOutside: () => Dropdown.handleClickOutside
}

export default onClickOutside(Dropdown, clickOutsideConfig)