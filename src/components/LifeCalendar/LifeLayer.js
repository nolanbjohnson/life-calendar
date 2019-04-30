import React from 'react'

// A life layer is a render props that takes a date and provides X and Y positions within the SVG

//.... wait that sounds like d3.domain / d3.range - maybe that's what I should be using....

const LifeLayer = ({ dates, config, children }) => {

	const { squareSize, squareMargin, weekNewYear, paddingMinorHorizontal } = config

	return (
		dates.map((date,i) => (
			<g
				transform={`translate(${((squareSize + squareMargin) * date.column) + (date.column >= weekNewYear ? paddingMinorHorizontal : 0)}, ${date.row * (squareSize + squareMargin)})`}
			>
				{/* this rect portion would be the render props -- you get to say, "put this SVG into a <g> at a specific location" */}
				
				{ children }
			</g>
		))

	)
}

export default LifeLayer