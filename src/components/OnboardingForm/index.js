import React, { useState, useEffect, useContext } from 'react'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import { withFirebase } from '../Firebase'
import { AuthUserContext } from '../Session'
import { Form, FormSection, FormInput, FormSubmit } from '../FormElements'
import FormSteps from './FormSteps'

import * as ROUTES from '../../helpers/routes'


const templateSchoolLayer = [
	{ name: "Kindergarten", startAge: 5, endAge: 6},
	{ name: "Elementary", startAge: 6, endAge: 11},
	{ name: "Middle", startAge: 11, endAge: 14},
	{ name: "High", startAge: 14, endAge: 18},
]

const BirthdateForm = props => {
	const [birthdate, setBirthdate] = useState(props.authUser.birthdate || '')

	const resetForm = () => {
		setBirthdate('')
	}

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
		<Form onSubmit={ event => handleSubmit(props.authUser, event, birthdate) } style={{ overflow: "auto", display: props.visible ? "block" : "none" }}>
			<FormSection>
				<label className="f6 b db mb2 tl">
					We'll start with something simple - your birthdate!
				<input 
					name="birthdate" 
					type="date"
					className="mt3 input-reset f3 bg-transparent bn"
					value={birthdate}
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
	  		There's also a column of space that represents the New Year.
	  	</p>
	  	<button type="button" className={`di b ph2 pv1 mh1 input-reset bn bg-transparent f4 pointer grow-large`} onClick={ props.next }>Got it? <span role="img" aria-label="thumbs up">👍</span></button>
	</div>
)

const LayerItem = ({part, index, onChange}) => (
	<FormSection
		key={index}
		className="flex items-baseline justify-between mv1 db"
	>	
		<input 
			key={`name-${index}`}
			name="name"
			className="input-reset ba b--near-white pv2 ph1 mh1 f6"
			type="text"
			value={part.name}
			onChange={e => onChange(e,index)}
		/>
		<input 
			key={`startDate-${index}`}
			name="startDate" 
			className="input-reset ba b--near-white pv2 ph1 mh1 f7 w4"
			type="date"
			value={part.startDate}
			onChange={e => onChange(e,index)}
		/>
		<input 
			key={`endDate-${index}`}
			name="endDate" 
			className="input-reset ba b--near-white pv2 ph1 mh1 f7 w4"
			type="date"
			value={part.endDate}
			onChange={e => onChange(e,index)}
		/>
	</FormSection>
)

const FirstLayerForm = props => {
	const [value, setValue]	= useState('School')
	const [schoolLayer, setSchoolLayer] = useState([])
	const birthdate = new Date(props.authUser.birthdate)
	const birthYear = birthdate.getFullYear()

	useEffect(() => {
		const schoolLayer = templateSchoolLayer.map(part => {
			return {
				name: part.name,
				startDate: moment.utc(Date.UTC(birthYear + part.startAge, 8, 1)).format("YYYY-MM-DD"), // typical start Sept 1
				endDate: moment.utc(Date.UTC(birthYear + part.endAge, 5, 1)).format("YYYY-MM-DD"), // typical end June 1
			}
		})
		setSchoolLayer(schoolLayer)
	}, [])

	console.log(schoolLayer)
	
	const resetForm = () => {

	}

	const addLayer = () => {
		setSchoolLayer([...schoolLayer, {name: '', startDate: '', endDate: ''}])
	}

	const handleLayerUpdate = (event, index) => {
		setSchoolLayer([
			...schoolLayer.slice(0, index),
			{ ...schoolLayer[index], [event.target.name]: event.target.value},
			...schoolLayer.slice(index + 1),
		])
	}

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

	if (!props.visible) return null
	return (
		<Form onSubmit={ event => handleSubmit(props.authUser, event, birthdate) } style={{ overflow: "auto", display: props.visible ? "block" : "none" }}>
			<p>Next let's add some details about you in the form of a Life Layer.</p>
			<FormSection>
			<label htmlFor="layer" className="f6 b db mb2 tl">
				Layer Name
			</label>
			<FormInput 
				name="layer" 
				type="text"
				value={value}
				onChange={e => setValue(e.target.value)}
			/>
			<small><span role="img" aria-label="point up">👆</span> you can change the name of the layer</small>
			</FormSection>
			<section className="mv3 mh1 flex flex-column">
				<ul className="pa1 ma1 w-100 flex justify-around">
					<li className="list"><small>Name</small></li>
					<li className="list"><small>Start Date</small></li>
					<li className="list"><small>End Date</small></li>
				</ul>
				{
					schoolLayer.map((part, i) => (
							<React.Fragment key={i}>
								{ i > 0 ? <hr className="mh2 mv1 pa0 near-white" /> : null }
								<LayerItem part={part} index={i} onChange={handleLayerUpdate} />
							</React.Fragment>
					))
				}
				<button className={`dib b ph2 pv1 mh1 input-reset ba b--black bg-transparent f6 pointer grow`} onClick={ addLayer }>➕</button>
			</section>
			<button type="submit" className={`db b ph2 pv2 mt3 mb1 input-reset br2 bn bg-green white f4 pointer grow`} ><span role="img" aria-label="backpack">🎒</span> Add the Layer <span role="img" aria-label="backpack">🎒</span></button>
			<small>Layers represent the background color of your life grid - they shouldn't overlap</small>
		</Form>
	)
}

const OnboardingFormBase = props => {

	const authUser = useContext(AuthUserContext)
	console.log('user: ', authUser)

	return (
		<FormSteps
			minIndex={1}
			maxIndex={2}
			render={({ currentIndex, incrementIndex, decrementIndex }) => {
				return (
					<div className="db">
						<div className="h-100 flex items-end justify-end">
							<button className={`${currentIndex===1 ? "o-0" : ""} dib b ph2 pv1 mh1 input-reset ba b--black bg-transparent f6 pointer grow`} onClick={ decrementIndex }>⬅</button>
							<button className={`${currentIndex===2 ? "o-0" : ""} dib b ph2 pv1 mh1 input-reset ba b--black bg-transparent f6 pointer grow`} onClick={ incrementIndex }>➡</button>
						</div>

						<BirthdateForm authUser={ authUser } firebase={ props.firebase } visible={ currentIndex === 1 } />
						<BirthdateFormConfirmation visible={ currentIndex === 1 && authUser.birthdate } next={ incrementIndex } />
						<FirstLayerForm authUser={ authUser } firebase={ props.firebase } visible={ currentIndex === 2 } />
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