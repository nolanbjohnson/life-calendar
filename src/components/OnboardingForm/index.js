import React, { useMemo, useContext } from 'react'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import { withFirebase } from '../../providers/Firebase'
import { AuthUserContext } from '../../providers/Session'
import FormSteps from './FormSteps'
import BirthdateForm, { BirthdateFormConfirmation } from './BirthdateForm'
import LayerForm from '../LayerForm'
import FinishOnboarding from './FinishOnboarding'
import EventForm from '../EventForm'

const templateSchoolLayer = [
	{ name: "Kindergarten", startAge: 5, endAge: 6},
	{ name: "Elementary", startAge: 6, endAge: 11},
	{ name: "Middle", startAge: 11, endAge: 14},
	{ name: "High", startAge: 14, endAge: 18},
]

const formSteps = 4

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

	const birthdate = useMemo(() => {
		return new Date(authUser.birthdate)
	}, [authUser])

	const templateLayer = useMemo(() => {
		return templateSchoolLayer.map(part => {
			return {
				name: part.name,
				startDate: moment.utc(Date.UTC(birthdate.getFullYear() + part.startAge, 8, 1)).format("YYYY-MM-DD"), // typical start Sept 1
				endDate: moment.utc(Date.UTC(birthdate.getFullYear() + part.endAge, 7, 31)).format("YYYY-MM-DD"), // typical end June 1
			}
		})
	}, [authUser])

	const schoolLayerNotPopulated = useMemo(() => props.layers.indexOf('School') === -1, [props.layers])
	console.log('school not populated', schoolLayerNotPopulated)
	return (
		<FormSteps
			minIndex={1}
			maxIndex={formSteps}
			render={({ currentIndex, incrementIndex, decrementIndex }) => {
				return (
					<div className="db">
						<div className="h-100 flex items-end justify-end">
							<button className={`${currentIndex===1 ? "o-0" : ""} dib b ph2 pv1 mh1 input-reset ba b--black bg-transparent f6 pointer grow`} onClick={ decrementIndex }>⬅</button>
							<button className={`${currentIndex===formSteps ? "o-0" : ""} ${currentIndex===(formSteps - 1) ? "shadow-1" : ""} dib b ph2 pv1 mh1 input-reset ba b--black bg-transparent f6 pointer grow`} onClick={ incrementIndex }>➡</button>
						</div>

						{ currentIndex === 1 && <BirthdateForm firebase={ props.firebase } visible={ currentIndex === 1 } /> }
						{ currentIndex === 1 && authUser.birthdate && <BirthdateFormConfirmation visible next={ incrementIndex } /> }
						{ currentIndex === 2 && (
							<React.Fragment>
								<p>Next let's add some details about you in the form of a Life Layer.</p>
								{ schoolLayerNotPopulated && <p>An example "School" layer has been pre-populated based on typical ages, but you can adjust to match your own.</p> }
								{ props.layers.length > 0 && <React.Fragment>
										<p>Your Layers</p>
										<ul>
											{ props.layers.map(layer => <li key={layer} className="list">{layer}</li>) }
										</ul>
									</React.Fragment>
								}
								<LayerForm 
									firebase={ props.firebase } 
									visible next={ incrementIndex } 
									{ ...schoolLayerNotPopulated && {templateLayer: templateLayer, templateName: "School"} }
								/>
								<small>Layers represent the background color of your life grid - they shouldn't overlap</small>
							</React.Fragment>)
						}
						{ currentIndex === 3 && 
							<div>
								<p>You're almost done! Add a few specific milestones.</p>
								<p>You can continue adding milestones and events. When you're done click next to finish up.</p>
								<EventForm 
									initialName='Started building my life calendar!'
									initialStartDate={ moment().format("YYYY-MM-DD") }
									initialEmoji='🚀'
								/>
							</div>
						}
						{ currentIndex===formSteps && (
							<div>
								<p>That's it for now; click "Finish Onboarding" and go to your new homepage.</p>
								<FinishOnboarding onClick={ handleCompletion }/>
							</div>
							)
						}
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