import React, { useState, useEffect } from 'react'
import moment from 'moment'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { Form, FormSection, FormLabel, FormInput, FormTextArea, FormSubmit } from './FormElements'

const EventForm = ({ onSubmit, initialStartDate }) => {
	const [name, setName] = useState('')
	const [emoji, setEmoji] = useState('')
	const [startDate, setStartDate] = useState('')
	const [showEmojiPicker, setShowEmojiPicker] = useState(false)

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

	const handleEmojiSelect = (emoji) => {
		setEmoji(emoji.native)
		setShowEmojiPicker(false)
	}

	return (
		<Form onSubmit={ handleSubmit } style={{ overflow: "auto" }}>
			<FormSection>
				<FormLabel htmlFor="startDate"><span role="img" aria-label="today" onClick={ () => setStartDate(moment().format("YYYY-MM-DD")) }>📅</span> Date</FormLabel>
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
				
				{ 
					showEmojiPicker
					? <Picker set='apple' onSelect={emoji => handleEmojiSelect(emoji) } />
					: (
						<FormInput 
						name="emoji" 
						type="text" 
						value={emoji} 
						onFocus={() => setShowEmojiPicker(true) }
						onChange={e => setEmoji(e.target.value)} 
						/>
					  )
				}
			</FormSection>
			<FormSubmit 
				type="submit" 
				value="Add Event"
			/>
		</Form>
	)

}


export default EventForm