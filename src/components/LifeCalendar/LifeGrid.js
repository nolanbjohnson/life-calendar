import React from 'react'
import moment from 'moment'
import LifeBox from './LifeBox'

const LifeGrid = ({ dates, config, weekNewYear, showYears }) => {
	
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
	              { /* left side age numbers */
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
								{ /* right side year numbers */
	                showYears && (parseInt(date.startDate.substring(0,4)) % 5 === 0 || date.row === 0) && date.column === 51
	                ? <text fontSize="0.5rem" 
	                        textAnchor="start" 
	                        alignmentBaseline="hanging" 
	                        transform={`translate(9,0)`}
	                        className="unselectable"
	                  > 
	                    { date.startDate.substring(0,4) } 
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