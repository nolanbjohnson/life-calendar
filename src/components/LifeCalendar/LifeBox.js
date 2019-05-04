import React, { useState } from 'react'
import { pure } from 'recompose'

const colorAssignment = {}

const randColor = (name) => {
	if (colorAssignment[name]) return colorAssignment[name]
	
	let newColor = ""
	switch (Math.floor(Math.random() * 8)) {
		case 0:
			newColor = "goldenrod"
			break
		case 1:
			newColor = "mistyrose"
			break
		case 2:
			newColor = "indianred"
			break
		case 3:
			newColor = "grey"
			break
		case 4:
			newColor = "green"
			break
		case 5:
			newColor = "red"
			break
		case 6:
			newColor = "purple"
			break
		case 7:
			newColor = "blue"
			break
		default:
			newColor = "#ebedf0"
			break
	}
 	
 	colorAssignment[name] = newColor
 	return newColor
}

const LifeBoxBase = ({ squareSize, nowBox, title, hasEvents }) => {

	const [clicked, setClicked] = useState(false)
	const [hovered, setHovered] = useState(false)

	// const nowBox = dateBetween(moment.utc(), start, moment.utc(endDate).add(1, 'd'))
	return (
		<g key={title}>
			<rect width={squareSize} 
		          height={squareSize}
		          className="square"
		          style={{ 
		          			...{fill: clicked || hovered ? "steelblue" : hasEvents ? randColor(hasEvents) : "#ebedf0"},
		          		  	...(nowBox ? { strokeWidth:  1, stroke: "steelblue" } : {})
		          		}}
		          onClick={ () => setClicked(!clicked) }
		          onMouseEnter={ () => setHovered(true) }
		          onMouseOut={ () => setHovered(false) }
		    >
				<title style={{fontSize: "3em"}}>
				  { title }
				</title>
			</rect>
		</g>
	)
}

const LifeBox = pure(LifeBoxBase)

LifeBox.whyDidYouRender = true

export default LifeBox