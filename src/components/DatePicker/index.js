import React, { useState, useEffect } from 'react'
import moment from 'moment'

const DatePicker = ({ initialDate, format, editMode, onSubmit, closeForm, openForm, inline }) => {
	const [date, setDate] = useState(initialDate)
	const [hovered, setHovered] = useState(false)

	useEffect(() => {
		setDate(initialDate)
	}, [initialDate])
	
	const handleSubmit = (e) => {
		e.preventDefault()
		onSubmit(date)
		closeForm()
	}

	const resetForm = () => {
		setDate(initialDate)
		closeForm()
	}

	return(
		editMode
		? (
			<form onSubmit={ handleSubmit } style={{ display: inline ? "inline-block" : "block", padding: "0", margin: "0" }}>
				<input 
					value={ date }
					type="date"
					name="date"
					className="input-reset black bw0"
					onChange={ (e) => setDate(e.target.value) } 
				/>
				<button 
					type="submit"
					className="button-reset bw0 f5 grow-large pointer bg-transparent" 
				>
					✔
				</button>
				<button 
					type="button" 
					className="button-reset bw0 f5 grow-large pointer bg-transparent" 
					onClick={ resetForm }
				>
					✖
				</button>
		  	</form>
		  )
		: <span onClick={ openForm } onMouseOver={() => setHovered(true) } onMouseOut={() => setHovered(false) } style={{ color: hovered ? "steelblue" : "inherit", cursor: "pointer" }}>{ moment.utc(date).format(format) }</span>

	)
}

export default DatePicker