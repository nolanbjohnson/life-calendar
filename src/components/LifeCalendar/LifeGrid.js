import React from 'react'
import moment from 'moment'
import LifeBox from './LifeBox'

const LifeGrid = ({ dates, birthdate, config, weekNewYear, showLayers }) => {
	
	const { squareSize, squareMargin, paddingMinorHorizontal } = config

	const rowHeight = squareSize + squareMargin

	return (
		dates.map((date,i) => {
	        return (
	            <g key={`${date.row}-${date.column}`}
	               transform={`translate(${((squareSize + squareMargin) * date.column) + (date.column >= weekNewYear ? paddingMinorHorizontal : 0)}, ${date.row * rowHeight})`}
	               onClick={ () => console.log(date) }
	            >
	              { /*
	                date.row === 0
	                ? <text fontSize="0.5rem" 
	                        textAnchor="middle"
	                        alignmentBaseline="middle"
	                        transform={`translate(${squareSize / 2},${squareSize / 2})`}
	                        className="unselectable"
	                  > 
	                    { date.column }
	                  </text> 
	                : null 
	               */ }
	              { 
	                date.row % 5 === 0 && date.column === 0 && date.row !== 0
	                ? <text fontSize="0.5rem" 
	                        textAnchor="end" 
	                        alignmentBaseline="hanging" 
	                        transform={`translate(-5,0)`}
	                        className="unselectable"
	                  > 
	                    { date.row } 
	                  </text> 
	                : null 
	              }
	              <LifeBox
	              	squareSize={ squareSize }
	              	nowBox={ date.current }
	              	title={ `${date.startDateLocaleFormat} - ${date.endDateLocaleFormat} (Age ${date.row})` }
	              	startDate={ date.startDate }
	              	endDate={ date.endDate }
	              	hasLayer={ date.data.layers.length > 0
	              				? (date.data.layers.find(layer => layer.hasOwnProperty('name')) || {name: ''}).name
	              				: '' }
	              	hasEvent={ date.data.events.length > 0 
	              				? `${moment.utc(date.data.events[0].startDate).format("MMM DD, YYYY")}: ${date.data.events[0].emoji || ''} ${date.data.events[0].name}` 
	              				: '' }
	              > 
	              </LifeBox>
	            </g>
	        )
	    })
	)
}

export default LifeGrid