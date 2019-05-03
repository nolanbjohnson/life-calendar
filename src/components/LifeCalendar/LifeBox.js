import React, { useState } from 'react'
import { pure } from 'recompose'
import moment from 'moment'

import { colorSwitch, backgroundColorRandom } from '../../helpers/utils'


const borderRadius = 2

const dateBetween = (date, start, end) => {
	return date >= start && date <= end
}

const LifeBoxBase = ({ squareSize, startDate, endDate, nowBox }) => {

	const [clicked, setClicked] = useState(false)
	const [hovered, setHovered] = useState(false)

	const start = moment.utc(startDate)
	const end = moment.utc(endDate)
	// const nowBox = dateBetween(moment.utc(), start, moment.utc(endDate).add(1, 'd'))
	return (
		<g key={startDate}>
			<rect width={squareSize} 
		          height={squareSize}
		          className="square"
		          // rx={borderRadius}
		          // ry={borderRadius}
		          style={{ 
		          			...{fill: clicked || hovered ? "steelblue" : "#ebedf0"},
		          		  	...(nowBox ? { strokeWidth:  1, stroke: "steelblue" } : {})
		          		}}
		          onClick={ () => setClicked(!clicked) }
		          onMouseEnter={ () => setHovered(true) }
		          onMouseOut={ () => setHovered(false) }
		    >
				<title style={{fontSize: "3em"}}>
				  { `${start.format("M/DD/YY")} - ${end.format("M/DD/YY")}` }
				</title>
			</rect>
		</g>
	)
}

const LifeBox = pure(LifeBoxBase)

LifeBox.whyDidYouRender = true

export default LifeBox