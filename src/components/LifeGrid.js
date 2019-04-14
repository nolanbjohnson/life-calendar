import React, { memo } from 'react'
import GridSquare from './GridSquare'
import moment from 'moment'



const LifeGrid = ({ dates, events, config, onClick, onHover, clicked, hovered, birthDate }) => {
	
	const { squareSize, squareMargin, weekNewYear, paddingMinorHorizontal, rowHeight } = config

	console.log(config)

	const yourAge = (new Date() - birthDate) / 1000 / 86400 / 365

	return (
		dates.map((date,i) => {
	        const date_events = events.filter(event => event.startDate >= new Date(date.startDate) && event.startDate <= new Date(date.endDate))[0]
	        return (
	            <g key={`${date.row}-${date.column}`}
	               transform={`translate(${squareSize * date.column + squareMargin * date.column + (date.column >= weekNewYear ? paddingMinorHorizontal : 0)}, ${date.row * rowHeight})`}
	               onClick={() => onClick(date.id)}
	               // onMouseOver={() => onHover(date.id)}
	            >
	              { 
	                date.row === 0
	                ? <text fontSize="0.5rem" 
	                        textAnchor="center" 
	                        alignmentBaseline="hanging" 
	                        transform={`translate(1,1)`}
	                  > 
	                    { date.column } 
	                  </text> 
	                : null 
	              }
	              { 
	                date.row % 5 === 0 && date.column === 0 && date.row !== 0
	                ? <text fontSize="0.8rem" 
	                        textAnchor="end" 
	                        alignmentBaseline="hanging" 
	                        transform={`translate(-5,0)`}
	                  > 
	                    { date.row } 
	                  </text> 
	                : null 
	              }
	              <GridSquare
	              	highlighted={ date_events || (hovered === date.id) }
	              	clicked={ clicked === date.id }
	              	squareSize={ squareSize }
	              	date={ date }
	              	yourAge={ yourAge }
	              	date_events={ date_events }
	              > 
	              </GridSquare>
	            </g>
	        )
	    })
	)
}

export default memo(LifeGrid)