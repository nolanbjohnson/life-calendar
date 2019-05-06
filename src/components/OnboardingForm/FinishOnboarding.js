import React from 'react'


const FinishOnboarding = props => {

	return (
		<button 
			type="button" 
			title="finish" 
			className={`db b ph2 pv2 mt3 mb1 input-reset br2 bn bg-blue white f4 pointer grow`} 
			onClick={ props.onClick }
		>
			Finish Onboarding
		</button>
	)
}

export default FinishOnboarding