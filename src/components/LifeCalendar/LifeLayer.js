import React from 'react'

// A life layer is a render props that takes a date and provides X and Y positions within the SVG

//.... wait that sounds like d3.domain / d3.range - maybe that's what I should be using....

const LifeLayer = ({ dates, config, children, className }) => {

	const { squareSize, squareMargin, weekNewYear, paddingMinorHorizontal } = config

	return (
		<g className={className}>
			{
			dates.map((date,i) => (
				<g
					key={`${date.column}-${date.row}`}
					transform={`translate(${((squareSize + squareMargin) * date.column) + (date.column >= weekNewYear ? paddingMinorHorizontal : 0)}, ${date.row * (squareSize + squareMargin)})`}
				>
					{/* this rect portion would be the render props -- you get to say, "put this SVG into a <g> at a specific location" */}
					
					{ children }
				</g>
			))
			}
		</g>

	)
}

export default LifeLayer