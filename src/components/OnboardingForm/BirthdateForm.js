import React, { useState, useContext } from 'react'

import { AuthUserContext } from '../Session'
import { Form, FormSection } from '../FormElements'

const BirthdateForm = props => {
	const authUser = useContext(AuthUserContext)

	const [birthdate, setBirthdate] = useState(authUser.birthdate || '')

	const handleSubmit = async (authUser, event, birthdate) => {
		
		const userRef = props.firebase.user(authUser.uid)

		userRef.update({
			birthdate: birthdate
		}, error => {
			if (error) {
				console.log(error)
			} else {
				console.log("Successful!")
			}
		})

		event.preventDefault()
	}

	return (
		<Form onSubmit={ event => handleSubmit(authUser, event, birthdate) } style={{ overflow: "auto", display: props.visible ? "block" : "none" }}>
			<FormSection>
				<label className="f6 b db mb2 tl">
					We'll start with something simple - your birthdate!
				<input 
					name="birthdate" 
					type="date"
					className="mt3 input-reset f3 bg-transparent bn"
					value={birthdate.replace(/T.*/,'')}
					onChange={e => setBirthdate(e.target.value)}
				/>
				</label>
			</FormSection>
			<button type="submit" className={`db b ph2 pv2 mt3 mb1 input-reset br2 bn bg-blue white f4 pointer grow`} ><span role="img" aria-label="party popper">🎉</span> Add Your Birthdate <span role="img" aria-label="party popper">🎉</span></button>
			<small>This will be the first box in your life calendar</small>
		</Form>
	)
}

const BirthdateFormConfirmation = props => (
	<div style={{display: props.visible ? "block" : "none"}}>
		<p>Great!</p>
	  	<p>
	  		Now the top-leftmost box represents your birth and the square with the blue outline represents this week. 
	  		There's also a column of space that represents the New Year, unless you're among the <a href="https://github.com/fivethirtyeight/data/tree/master/births" target="_blank">1.5% of people</a> born in the first week of the year. 
	  	</p>
	  	<button type="button" className={`di b ph2 pv1 mh1 input-reset bn bg-transparent f4 pointer grow-large`} onClick={ props.next }>Got it? <span role="img" aria-label="thumbs up">👍</span></button>
	</div>
)

export { BirthdateFormConfirmation }

export default BirthdateForm