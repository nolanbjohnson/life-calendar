import React, { useState, useEffect, useContext } from 'react'
import { withFirebase } from '../Firebase'
import { AuthUserContext } from '../Session'

import moment from 'moment'
import { Form, FormSection, FormLabel, FormInput, FormTextArea, FormSubmit } from '../FormElements'

const EventForm = props => {

	const authUser = useContext(AuthUserContext)

	const { initialStartDate, initialEndDate, rangeMode } = props
	
	const [name, setName] = useState('')
	const [emoji, setEmoji] = useState('')
	const [hidden, setHidden] = useState(false)
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [eventType, setEventType] = useState('event')

	useEffect(() => {
		setStartDate(initialStartDate || '')
		setEndDate(initialEndDate || '')
	}, [initialStartDate, initialEndDate])

	useEffect(() => {
		setEventType(rangeMode ? 'home' : 'event')
	}, [rangeMode])

	const resetForm = () => {
		setName('')
		setEmoji('')
		setHidden(false)
		// setStartDate('') // since this is set on click, don't reset in form
	}
	const handleSubmit = (event, authUser) => {
		event.preventDefault()
		const eventsRef = props.firebase.events() // set ref to firebase db

	    const form = event.target
	    const data = new FormData(form)
	    let newEvent = {}

	    for(let input of data.entries()) {
	      newEvent[input[0]] = input[0] === "startDate" ? moment.utc(input[1]).format("YYYY-MM-DD") : input[1]
	    }

	    if(! newEvent.startDate instanceof Date) return
	    if(newEvent.name==="") return

	    newEvent = { ...newEvent, userId: authUser.uid, createdAt: props.firebase.serverValue.TIMESTAMP }

	    eventsRef.push(newEvent) // send event to firebase db

	    console.log(newEvent)

		resetForm()
	}

	return (
		<Form onSubmit={ event => handleSubmit(event, authUser) } style={{ overflow: "auto" }}>
			<h2>New Event</h2>
			<FormSection>
				<FormLabel>
					<span 
						role="img" 
						aria-label="Set Start to Today" 
						onClick={ () => setStartDate(moment().format("YYYY-MM-DD"))}
					>
						📅
					</span>
					{ `${ rangeMode ? "Start " : "" }Date` }
					<FormInput 
						name="startDate" 
						type="date" 
						value={startDate}
						onChange={e => setStartDate(e.target.value)}
					/>
				</FormLabel>
				{
					rangeMode
					? (
						<React.Fragment>
						<FormLabel>
							<span 
								role="img" 
								aria-label="Set End to Today" 
								onClick={ () => setEndDate(moment().format("YYYY-MM-DD"))}
							>
								📅
							</span>
							End Date
							<FormInput 
								name="endDate" 
								type="date" 
								value={endDate}
								onChange={e => setEndDate(e.target.value)}
							/>
						</FormLabel>
						</React.Fragment>
					  )
					: null
				}
				<FormLabel>
					Event Name / Description
					<FormTextArea 
						name="name" 
						type="text" 
						value={name} 
						onChange={e => setName(e.target.value)}
					/>
				</FormLabel>
				<FormLabel>
					Emoji <span className="normal black-60">(optional)</span>
					<FormInput 
						name="emoji" 
						type="text" 
						value={emoji} 
						onChange={e => setEmoji(e.target.value)} 
					/>
				</FormLabel>
				<FormLabel>
					<input 
						name="hidden" 
						type="checkbox"
						checked={hidden}
						onChange={e => setHidden(e.target.checked)}
					/>
					<span> Hidden</span>
				</FormLabel>
				<input name="type" type="text" value={eventType} readOnly style={{display: "none"}}/>
			</FormSection>
			<FormSubmit 
				type="submit" 
				value="Add Event"
			/>
		</Form>
	)

}

export default withFirebase(EventForm)