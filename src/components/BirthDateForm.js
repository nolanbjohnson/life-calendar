import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Form, FormSection, FormLabel, FormInput, FormSubmit } from './FormElements'


const BirthDateForm = ({ onSubmit, open, closeForm }) => {
	const [birthEpoch, setBirthEpoch] = useState('26438400000')
	const [birthYear, setBirthYear] = useState('1985')
	const [birthDate, setBirthDate] = useState('1985-11-03')

	const handleSubmit = (e) => {
		e.preventDefault()
		onSubmit(e)
		closeForm()
	}
	const birthDay = moment.utc(parseInt(birthEpoch)).add(parseInt(birthYear) - 1970, 'y')

	return (
		<div className={ `fixed w-100 h-100 top-0 left-0 z-1 bg-animate ${open ? "db bg-black-40" : "dn bg-black-0"}` } >
			<div className="fixed w-30 bottom-0 pa5 black bg-near-white o-100">
				<span className="absolute top-0 right-0 w2 tc pointer" onClick={ closeForm } >&times;</span>
				<Form onSubmit={ handleSubmit } style={{ display: open ? 'block' : 'none' }}>
					<FormSection>
						<p>{ `Birth date: ${moment(birthDay).utc().format("M/DD/YY")}`}</p>
					</FormSection>
					<FormSection>
						<FormLabel htmlFor="birthDate">Enter your birthdate!</FormLabel>
						<FormInput 
				        	name="birthDate"
							type="date" 
							value={ birthDate } 
							onChange={ e => setBirthDate(e.target.value) } 
						/>
					</FormSection>
					<FormSubmit 
						type="submit" 
						value="Update"
					/>
				</Form>
			</div>
		</div>
	)

}


export default BirthDateForm