import React, { useState } from 'react'
import _ from 'lodash'
import { pure } from 'recompose'

const colorAssignment = {}

const randColor = (name) => {
	if (colorAssignment[name]) return colorAssignment[name]
	
	let newColor = ""
	switch (Math.floor(Math.random() * 8)) {
		case 0:
			newColor = "rgba(155,90,90,0.5)"
			break
		case 1:
			newColor = "rgba(90,155,90,0.5)"
			break
		case 2:
			newColor = "rgba(90,90,155,0.5)"
			break
		case 3:
			newColor = "rgba(155,90,155,0.5)"
			break
		case 4:
			newColor = "rgba(155,155,90,0.5)"
			break
		case 5:
			newColor = "rgba(90,155,155,0.5)"
			break
		case 6:
			newColor = "rgba(90,90,90,0.5)"
			break
		case 7:
			newColor = "rgba(30,90,155,0.5)"
			break
		default:
			newColor = "#ebedf0"
			break
	}
 	
 	colorAssignment[name] = newColor
 	return newColor
}

const LifeBoxBase = ({ squareSize, nowBox, title, hasLayer, hasEvent }) => {

	const [clicked, setClicked] = useState(false)
	const [hovered, setHovered] = useState(false)
	const [layerName, setLayerName] = useState('')

	const onHover = (layer) => {
		// TODO throttle this or debounce - whichever means that it stays rendered longer and evaluates less often
		
		setHovered(true)
		if (layer) {
			if (layer && layer !== layerName) {
				setLayerName(layer)
			}
		}
	}


	const offHover = () => {
		setHovered(false)
		setLayerName('')
	}

	const onHoverThrottled = _.debounce(onHover, 2000, {leading: true})
	const offHoverThrottled = _.debounce(offHover, 2000, {leading: true})

	return (
		<g key={title}>
			{ 
				layerName 
				? <text
					textAnchor="middle"
					style={{ fontSize: "1.5rem", fontWeight: "bolder", stroke: "black", strokeWidth: "1px",  fill: randColor(hasLayer) }}
				  >{ layerName }</text>
				: null
			}
			<rect width={squareSize} 
		          height={squareSize}
		          className="square"
		          style={{ 
		          			...{fill: clicked || hovered ? "steelblue" : hasLayer ? randColor(hasLayer) : "#ebedf0"},
		          		  	...(nowBox ? { strokeWidth:  1, stroke: "steelblue" } 
		          		  		: hasEvent ? { strokeWidth:  1, stroke: "silver" } 
		          		  		: {})
		          		}}
		          onClick={ () => setClicked(!clicked) }
		          onMouseEnter={ () => onHoverThrottled(hasLayer) }
		          onMouseOut={ offHoverThrottled }
		    >
				<title style={{fontWeight: "bolder"}}>
				  {title}
				  {
				  	hasEvent 
				  	? `\n${hasEvent}`
				  	: ''
				  }
				</title>
			</rect>
		</g>
	)
}

const LifeBox = pure(LifeBoxBase)

LifeBox.whyDidYouRender = true

export default LifeBox