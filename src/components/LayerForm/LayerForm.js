import React, { useState, useEffect, useContext } from 'react'
import moment from 'moment'
import styled from 'styled-components'

import { AuthUserContext } from '../../providers/Session'

import { Form } from '../Utilities'

const Button = styled.button.attrs(({ showOnHover }) => ({
	className: `button-reset bw0 f5 grow-large pointer bg-transparent ${showOnHover ? 'child' : ''}`
}))``

const LayerItem = ({part, index, onChange, children}) => (
	<Form.Section
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
	</Form.Section>
)

const LayerForm = props => {
	const authUser = useContext(AuthUserContext)

	console.log('layerform', authUser)

	const [layerName, setLayerName]	= useState(props.templateName || "")
	const [layers, setLayers] = useState(props.templateLayer || [])

	useEffect(() => {
		if (props.templateName && props.templateLayer) {
			setLayerName(props.templateName)
			setLayers(props.templateLayer)
		} else {
			resetForm()
		}
	}, [props.templateName, props.templateLayer])
	
	const resetForm = () => {
		setLayers([{name: '', startDate: '', endDate: ''}])
		setLayerName('')
	}

	const addLayer = () => {
		setLayers([...layers, {name: '', startDate: '', endDate: ''}])
	}

	const removeLayer = (index) => {
		setLayers([
			...layers.slice(0, index),
			...layers.slice(index + 1),
		])
	}

	const handleLayerUpdate = (event, index) => {
		setLayers([
			...layers.slice(0, index),
			{ ...layers[index], [event.target.name]: event.target.value},
			...layers.slice(index + 1),
		])
	}

	const handleSubmit = (event, authUser) => {
		console.log('submitting...')
		event.preventDefault()
		const eventsRef = props.firebase.events() // set ref to firebase db

		let newEvents = {}

		console.log(layers)

		layers.forEach((layer, i) => {
			const key = eventsRef.push().key
			newEvents[key] = {
				...layer, 
				layerName,
				type: 'layer',
				userId: authUser.uid, 
				createdAt: props.firebase.serverValue.TIMESTAMP
			}
		})

		eventsRef.update(newEvents)

		resetForm()

		if (props.next) props.next()
	}

	if (!props.visible) return null
	return (
		<Form.Form onSubmit={ event => handleSubmit(event, authUser) } style={{ overflow: "auto", display: props.visible ? "block" : "none" }}>
			<Form.Section>
			<label htmlFor="layer" className="f6 b db mb2 tl">
				Layer Name
			</label>
			<Form.Input 
				name="layerName" 
				type="text"
				placeholder="Add a name for the layer"
				value={layerName}
				onChange={e => setLayerName(e.target.value)}
			/>
			<small><span role="img" aria-label="point up">👆</span> you can change the name of the layer</small>
			</Form.Section>
			<section className="mv3 mh1 flex flex-column">
				<ul className="pa1 ma1 w-100 flex justify-around">
					<li className="list"><small>Name</small></li>
					<li className="list"><small>Start Date</small></li>
					<li className="list"><small>End Date</small></li>
				</ul>
				{
					layers.map((part, i) => (
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
			<button onClick={ event => handleSubmit(event, authUser) } type="submit" className={`db b ph2 pv2 mt3 mb1 input-reset br2 bn bg-green white f4 pointer grow`} ><span role="img" aria-label="backpack">🎒</span> Add the Layer <span role="img" aria-label="backpack">🎒</span></button>
		</Form.Form>
	)
}

export default LayerForm