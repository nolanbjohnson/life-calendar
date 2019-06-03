import React, { useState, useEffect } from 'react'

const TextEditor = ({ initialText, editMode, onSubmit, closeForm, openForm, inline }) => {
	const [text, setText] = useState(initialText)
	const [hovered, setHovered] = useState(false)

	useEffect(() => {
		setText(initialText)
	}, [initialText])
	
	const handleSubmit = (e) => {
		e.preventDefault()
		onSubmit(text)
		closeForm()
	}

	const resetForm = () => {
		setText(initialText)
		closeForm()
	}

	return(
		editMode
		? (
			<form onSubmit={ handleSubmit } style={{ display: inline ? "inline-block" : "block", padding: "0", margin: "0" }}>
				<input 
					value={ text }
					type="text"
					name="text"
					className="input-reset black bw0"
					onChange={ (e) => setText(e.target.value) } 
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
		: <span onClick={ openForm } onMouseOver={() => setHovered(true) } onMouseOut={() => setHovered(false) } style={{ color: hovered ? "steelblue" : "inherit", cursor: "pointer" }}>{ text }</span>

	)
}

export default TextEditor