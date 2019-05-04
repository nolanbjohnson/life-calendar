import React, { useState, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import { withFirebase } from '../Firebase'
import { AuthUserContext } from '../Session'
import { Form, FormSection, FormLabel, FormInput, FormSubmit } from '../FormElements'

import * as ROUTES from '../../helpers/routes'

const OnboardingFormBase = props => {

	const authUser = useContext(AuthUserContext)

	const [birthDate, setBirthDate] = useState('')

	const resetForm = () => {
		setBirthDate('')
	}

	const handleSubmit = async (event, authUser) => {
		
		const userRef = props.firebase.user(authUser.uid)

		userRef.update({
			birthDate: birthDate
		}, error => {
			if (error) {
				console.log(error)
			} else {
				console.log("Successful!")
				resetForm()
				props.history.push(ROUTES.HOME);
			}
		})

		event.preventDefault()
	}

	return (
		<Form onSubmit={ event => handleSubmit(event, authUser) } style={{ overflow: "auto" }}>
			<FormSection>
				<FormLabel 
					htmlFor="birthDtae"
				>
					Birth Date
				</FormLabel>
				<FormInput 
					name="birthDate" 
					type="date" 
					value={birthDate}
					onChange={e => setBirthDate(e.target.value)}
				/>
			</FormSection>
			<FormSubmit 
				type="submit" 
				value="Add Event"
			/>
		</Form>
	)
}

const OnboardingForm = compose(
  withRouter,
  withFirebase,
)(OnboardingFormBase)

export default OnboardingForm