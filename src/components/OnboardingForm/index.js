import React, { useContext } from 'react'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import { withFirebase } from '../Firebase'
import { AuthUserContext } from '../Session'
import { Form, FormSection, FormInput, FormSubmit } from '../FormElements'
import FormSteps from './FormSteps'
import BirthdateForm, { BirthdateFormConfirmation } from './BirthdateForm'
import LayerForm from './LayerForm'
import FinishOnboarding from './FinishOnboarding'
import EventForm from '../EventForm'

import * as ROUTES from '../../helpers/routes'


const OnboardingFormBase = props => {

	const authUser = useContext(AuthUserContext)
	console.log('user: ', authUser)

	const handleCompletion = async (event) => {
		
		const userRef = props.firebase.user(authUser.uid)

		userRef.update({
			onboardingCompleted: props.firebase.serverValue.TIMESTAMP
		}, error => {
			if (error) {
				console.log(error)
			} else {
				console.log("Successful!")
			}
		})
	}

	const formSteps = 4

	return (
		<FormSteps
			minIndex={1}
			maxIndex={formSteps}
			render={({ currentIndex, incrementIndex, decrementIndex }) => {
				return (
					<div className="db">
						<div className="h-100 flex items-end justify-end">
							<button className={`${currentIndex===1 ? "o-0" : ""} dib b ph2 pv1 mh1 input-reset ba b--black bg-transparent f6 pointer grow`} onClick={ decrementIndex }>⬅</button>
							<button className={`${currentIndex===formSteps ? "o-0" : ""} dib b ph2 pv1 mh1 input-reset ba b--black bg-transparent f6 pointer grow`} onClick={ incrementIndex }>➡</button>
						</div>

						<BirthdateForm authUser={ authUser } firebase={ props.firebase } visible={ currentIndex === 1 } />
						<BirthdateFormConfirmation visible={ currentIndex === 1 && authUser.birthdate } next={ incrementIndex } />
						<LayerForm authUser={ authUser } firebase={ props.firebase } visible={ currentIndex === 2 } next={ incrementIndex } />
						{ currentIndex === 3 
							? <div>
								<p></p>
								<EventForm 
									initialName='Started building my life calendar!'
									initialStartDate={ moment().format("YYYY-MM-DD") }
									initialEmoji='🚀'
								/>
							  </div>
							: null 
						}
						<div style={{display: currentIndex===formSteps ? "block" : "none"}}>
							That's it for now!
							<FinishOnboarding onClick={ handleCompletion }/> 
						</div>
					</div>
				)
			}}
		/>
	)
}

const OnboardingForm = compose(
  withRouter,
  withFirebase,
)(OnboardingFormBase)

export default OnboardingForm