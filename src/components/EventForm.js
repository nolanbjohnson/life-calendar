import React, { useState, useEffect } from 'react'
import { Form, FormSection, FormLabel, FormInput, FormTextArea, FormSubmit } from './FormElements'

const EventForm = ({ onSubmit, initialStartDate }) => {
	const [name, setName] = useState('')
	const [emoji, setEmoji] = useState('')
	const [startDate, setStartDate] = useState('')

	useEffect(() => {
		setStartDate(initialStartDate)
	}, [initialStartDate])

	console.log(initialStartDate)

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
		<Form onSubmit={ handleSubmit }>
			<FormSection>
				<FormLabel htmlFor="startDate">Date</FormLabel>
				<FormInput 
					name="startDate" 
					type="date" 
					value={startDate}
					onChange={e => setStartDate(e.target.value)}
				/>
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
			</FormSection>
			<FormSubmit 
				type="submit" 
				value="Add Event"
			/>
		</Form>
	)

}


export default EventForm