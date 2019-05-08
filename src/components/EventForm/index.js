import React, { useState, useEffect, useContext } from 'react'
import { withFirebase } from '../../providers/Firebase'
import { AuthUserContext } from '../../providers/Session'

import moment from 'moment'
import { Form } from '../Utilities'

const EventForm = props => {

	const authUser = useContext(AuthUserContext)

	const { initialName, initialEmoji, initialStartDate, initialEndDate, rangeMode } = props
	
	const [name, setName] = useState('')
	const [emoji, setEmoji] = useState('')
	const [hidden, setHidden] = useState(false)
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [eventType, setEventType] = useState('event')

	useEffect(() => {
		setName(initialName || '')
		setEmoji(initialEmoji || '')
		setStartDate(initialStartDate || '')
		setEndDate(initialEndDate || '')
	}, [initialName, initialEmoji, initialStartDate, initialEndDate])

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
		<Form.Form onSubmit={ event => handleSubmit(event, authUser) } style={{ overflow: "auto" }}>
			<Form.Section>
				<Form.Label>
					<span 
						role="img" 
						aria-label="Set Start to Today" 
						onClick={ () => setStartDate(moment().format("YYYY-MM-DD"))}
					>
						📅
					</span>
					{ `${ rangeMode ? "Start " : "" }Date` }
					<Form.Input 
						name="startDate" 
						type="date" 
						value={startDate}
						onChange={e => setStartDate(e.target.value)}
					/>
				</Form.Label>
				{
					rangeMode
					? (
						<React.Fragment>
						<Form.Label>
							<span 
								role="img" 
								aria-label="Set End to Today" 
								onClick={ () => setEndDate(moment().format("YYYY-MM-DD"))}
							>
								📅
							</span>
							End Date
							<Form.Input 
								name="endDate" 
								type="date" 
								value={endDate}
								onChange={e => setEndDate(e.target.value)}
							/>
						</Form.Label>
						</React.Fragment>
					  )
					: null
				}
				<Form.Label>
					Event Name / Description
					<Form.TextArea 
						name="name" 
						type="text" 
						value={name} 
						onChange={e => setName(e.target.value)}
					/>
				</Form.Label>
				<Form.Label>
					Emoji <span className="normal black-60">(optional)</span>
					<Form.Input 
						name="emoji" 
						type="text" 
						value={emoji} 
						onChange={e => setEmoji(e.target.value)} 
					/>
				</Form.Label>
				<Form.Label>
					<input 
						name="hidden" 
						type="checkbox"
						checked={hidden}
						onChange={e => setHidden(e.target.checked)}
					/>
					<span> Hidden</span>
				</Form.Label>
				<input name="type" type="text" value={eventType} readOnly style={{display: "none"}}/>
			</Form.Section>
			<Form.Submit 
				type="submit" 
				value="Add Event"
			/>
		</Form.Form>
	)

}

export default withFirebase(EventForm)