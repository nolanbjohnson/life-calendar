import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Form, FormSection, FormLabel, FormInput, FormTextArea, FormSubmit } from '../FormElements'

const EventForm = ({ onSubmit, initialStartDate, initialEndDate, rangeMode, unsetSelect }) => {
	const [name, setName] = useState('')
	const [emoji, setEmoji] = useState('')
	const [hidden, setHidden] = useState(false)
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [eventType, setEventType] = useState('event')

	useEffect(() => {
		setStartDate(initialStartDate)
		setEndDate(initialEndDate)
	}, [initialStartDate, initialEndDate])

	useEffect(() => {
		setEventType(rangeMode ? 'home' : 'event')
	}, [rangeMode])

	const resetForm = () => {
		setName('')
		setEmoji('')
		// setStartDate('') // since this is set on click, don't reset in form
	}
	const handleSubmit = (e) => {
		e.preventDefault()
		onSubmit(e)
		resetForm()
	}

	return (
		<Form onSubmit={ handleSubmit } style={{ overflow: "auto" }}>
			<FormSection>
				<FormLabel 
					htmlFor="startDate"
				>
					<span 
						role="img" 
						aria-label="Set Start to Today" 
						onClick={ () => setStartDate(moment().format("YYYY-MM-DD"))}
					>
						📅
					</span>
					{ `${ rangeMode ? "Start " : "" }Date` }
				</FormLabel>
				<FormInput 
					name="startDate" 
					type="date" 
					value={startDate}
					onChange={e => setStartDate(e.target.value)}
				/>
				{
					rangeMode
					? (
						<React.Fragment>
						<FormLabel 
							htmlFor="endDate"
						>
							<span 
								role="img" 
								aria-label="Set End to Today" 
								onClick={ () => setEndDate(moment().format("YYYY-MM-DD"))}
							>
								📅
							</span>
							End Date
						</FormLabel>
						<FormInput 
							name="endDate" 
							type="date" 
							value={endDate}
							onChange={e => setEndDate(e.target.value)}
						/>
						</React.Fragment>
					  )
					: null
				}
				<FormLabel htmlFor="name">Event Name / Description</FormLabel>
				<FormTextArea 
					name="name" 
					type="text" 
					value={name} 
					onChange={e => setName(e.target.value)}
				/>
				<FormLabel htmlFor="emoji">Emoji <span className="normal black-60">(optional)</span></FormLabel>
				<FormInput 
					name="emoji" 
					type="text" 
					value={emoji} 
					onChange={e => setEmoji(e.target.value)} 
				/>
				<FormLabel htmlFor="hidden">
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


export default EventForm