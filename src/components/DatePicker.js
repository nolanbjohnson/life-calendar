import React, { useState, useEffect } from 'react'
import moment from 'moment'

const DatePicker = ({ initialDate, format, editMode, onSubmit, closeForm, openForm, inline }) => {
	const [date, setDate] = useState(initialDate)

	useEffect(() => {
		setDate(initialDate)
	}, [initialDate])
	
	const handleSubmit = (e) => {
		e.preventDefault()
		onSubmit(e)
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
					name="birthDate"
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
		: <span onClick={ openForm }>{ moment.utc(date).format(format) }</span>

	)
}

export default DatePicker