import React from 'react'
import onClickOutside from 'react-onclickoutside'


// TODO instead of two separate components, maybe this is a Compound Components pattern? https://github.com/kentcdodds/advanced-react-patterns-v2/blob/master/src/exercises-final/03.js
const Section = ({header, items, selectedItems, toggleSelection}) => (
	<div>
		<div className="ph3 pv1 f6 small-caps gray">{ header }</div>
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
)

const Dropdown = ({ isOpen, handleClose, children }) => {

	Dropdown.handleClickOutside = handleClose
	return (
		<div className="relative flex flex-column">
			
			{ isOpen && 
				<div className="absolute z-999 flex flex-column w5 ma0 ph0 pv3 br2 bg-white shadow-1">
					{ 
						children.map((child, index) => (
							[
								index > 0 && <hr className="w-100 bt br-0 bb-0 bl-0 b--light-gray" />,
								child
							]
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

export { Dropdown, Section }

export default onClickOutside(Dropdown, clickOutsideConfig)