import React, { useState, useEffect, useContext } from 'react'
import moment from 'moment'
import styled from 'styled-components'

import { AuthUserContext } from '../Session'

import { Form, FormSection, FormInput } from '../FormElements'

const templateSchoolLayer = [
	{ name: "Kindergarten", startAge: 5, endAge: 6},
	{ name: "Elementary", startAge: 6, endAge: 11},
	{ name: "Middle", startAge: 11, endAge: 14},
	{ name: "High", startAge: 14, endAge: 18},
]

const Button = styled.button.attrs(({ showOnHover }) => ({
	className: `button-reset bw0 f5 grow-large pointer bg-transparent ${showOnHover ? 'child' : ''}`
}))``

const LayerItem = ({part, index, onChange, children}) => (
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
		{ children }
	</FormSection>
)

const LayerForm = props => {
	const authUser = useContext(AuthUserContext)

	console.log('layerform', authUser)

	const [layerName, setLayerName]	= useState('School')
	const [schoolLayer, setSchoolLayer] = useState([])
	const birthdate = new Date(authUser.birthdate)
	const birthYear = birthdate.getFullYear()


	useEffect(() => {
		resetForm()
	}, [authUser])
	
	const resetForm = () => {
		const schoolLayer = templateSchoolLayer.map(part => {
			return {
				name: part.name,
				startDate: moment.utc(Date.UTC(birthYear + part.startAge, 8, 1)).format("YYYY-MM-DD"), // typical start Sept 1
				endDate: moment.utc(Date.UTC(birthYear + part.endAge, 7, 31)).format("YYYY-MM-DD"), // typical end June 1
			}
		})
		setSchoolLayer(schoolLayer)
	}

	const addLayer = () => {
		setSchoolLayer([...schoolLayer, {name: '', startDate: '', endDate: ''}])
	}

	const removeLayer = (index) => {
		setSchoolLayer([
			...schoolLayer.slice(0, index),
			...schoolLayer.slice(index + 1),
		])
	}

	const handleLayerUpdate = (event, index) => {
		setSchoolLayer([
			...schoolLayer.slice(0, index),
			{ ...schoolLayer[index], [event.target.name]: event.target.value},
			...schoolLayer.slice(index + 1),
		])
	}

	const handleSubmit = (event, authUser) => {
		event.preventDefault()
		const eventsRef = props.firebase.events() // set ref to firebase db

		let newEvents = {}

		schoolLayer.forEach((layer, i) => {
			const key = eventsRef.push().key
			newEvents[key] = {
				...layer, 
				layerName, 
				userId: authUser.uid, 
				createdAt: props.firebase.serverValue.TIMESTAMP
			}
		})

		eventsRef.update(newEvents)
		props.next()
	}

	if (!props.visible) return null
	return (
		<Form onSubmit={ event => handleSubmit(event, authUser) } style={{ overflow: "auto", display: props.visible ? "block" : "none" }}>
			<p>Next let's add some details about you in the form of a Life Layer.</p>
			<FormSection>
			<label htmlFor="layer" className="f6 b db mb2 tl">
				Layer Name
			</label>
			<FormInput 
				name="layerName" 
				type="text"
				value={layerName}
				onChange={e => setLayerName(e.target.value)}
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
								<LayerItem part={part} index={i} onChange={handleLayerUpdate} >
									<Button 
										type="button" 
										title="remove"
										showOnHover 
										onClick={ ()=> removeLayer(i) }
									>
									✖
									</Button>
								</LayerItem>
							</React.Fragment>
					))
				}
				<button type="button" title="add a layer item" className={`self-end w2 h2 b pv2 tc mh1 input-reset ba b--black bg-transparent f5 pointer grow`} onClick={ addLayer }><span role="img" aria-label="add layer item">➕</span></button>
			</section>
			<button type="submit" className={`db b ph2 pv2 mt3 mb1 input-reset br2 bn bg-green white f4 pointer grow`} ><span role="img" aria-label="backpack">🎒</span> Add the Layer <span role="img" aria-label="backpack">🎒</span></button>
			<small>Layers represent the background color of your life grid - they shouldn't overlap</small>
		</Form>
	)
}

export default LayerForm