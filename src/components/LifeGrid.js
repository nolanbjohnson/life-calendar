import React, { memo } from 'react'
import GridSquare from './GridSquare'
import moment from 'moment'

const parseDateID = (dateID) => dateID.split('-').map(number => parseInt(number))

const dateIDBetween = (dateID, startID, endID) => {

	if (dateID === '' || startID === '' || endID === '') return false

	const [row, column] = parseDateID(dateID)
	let [rowStart, columnStart] = parseDateID(startID)
	let [rowEnd, columnEnd] = parseDateID(endID)

	if ((rowStart * 1000 + columnStart) > (rowEnd * 1000 + columnEnd)) {
		let [rowStartB, columnStartB] = [rowStart, columnStart] // saving these for a second

		rowStart = rowEnd
		columnStart = columnEnd
		
		rowEnd = rowStartB
		columnEnd = columnStartB
	}

	if ((rowStart === row && row < rowEnd) && (columnStart <= column)) {
		return true
	} else if ((rowStart === row && row === rowEnd) && (columnStart <= column && column <= columnEnd)) {
		return true
	} else if ((rowStart < row && row === rowEnd) && (column <= columnEnd)) {
		return true
	} else if (rowStart < row && row < rowEnd) {
		return true
	} else {
		return false
	}

}

const LifeGrid = ({ dates, events, homes, config, onClick, onHover, onSelectStart, onSelectEnd, onSelectDrag, clicked, hovered, selectStart, selectEnd, selecting, birthDate }) => {
	
	const { squareSize, squareMargin, weekNewYear, paddingMinorHorizontal, rowHeight } = config

	const yourAge = (new Date() - birthDate) / 1000 / 86400 / 365

	const selectLabelStart = dates.find(date => date.id === selectStart) || {}
	const selectLabelEnd = dates.find(date => date.id === selectEnd) || {}

	return (
		dates.map((date,i) => {
	        const date_events = events.filter(event => event.startDate >= new Date(date.startDate) && event.startDate <= new Date(date.endDate))[0]
	        const date_homes = homes.find(home => (home.startDate <= new Date(date.startDate) && (home.endDate || new Date()) >= new Date(date.startDate))) || {}
	        return (
	            <g key={`${date.row}-${date.column}`}
	               transform={`translate(${squareSize * date.column + squareMargin * date.column + (date.column >= weekNewYear ? paddingMinorHorizontal : 0)}, ${date.row * rowHeight})`}
	               onClick={() => onClick(date.id)}
	               onMouseOver={() => onSelectDrag(date.id)}
	               onMouseDown={() => onSelectStart(date.id)}
	               onMouseUp={() => onSelectEnd(date.id)}
	            >
	              { 
	                date.row === 0
	                ? <text fontSize="0.5rem" 
	                        textAnchor="center" 
	                        alignmentBaseline="hanging" 
	                        transform={`translate(1,1)`}
	                        className="unselectable"
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
	                        className="unselectable"
	                  > 
	                    { date.row } 
	                  </text> 
	                : null 
	              }
	              <GridSquare
	              	highlighted={ date_events || (hovered === date.id) || dateIDBetween(date.id, selectStart, selectEnd) }
	              	clicked={ clicked === date.id }
	              	squareSize={ squareSize }
	              	date={ date }
	              	yourAge={ yourAge }
	              	date_events={ date_events }
	              	date_homes={ date_homes }
	              	selectEndPoint={ (date.id === selectStart || date.id === selectEnd) }
	              > 
	              </GridSquare>
	              {
	              	selecting && (date.id === selectStart)
	              	? (
	              		<React.Fragment>
		              		<text
			              		fontSize="2rem" 
			                    textAnchor={ date.column < 20 ? "start" : (date.column < 40 ? "middle" : "end") }
			                    alignmentBaseline={ "baseline" }
			                    transform={ `translate(0,-10)` }
			                    className="unselectable"
			                    style={{fontWeight: "bolder", stroke: "black", strokeWidth: "1px", fill: "white", strokeLinecap: "butt", strokeLinejoin: "miter", pointerEvents: "none"}}
		                  	> 
		                    	{ `${moment.utc(selectLabelStart.startDate).format("M/DD/YY")} - ${ moment.utc(selectLabelEnd.endDate).format("M/DD/YY") }` } 
		                  	</text>
		                </React.Fragment>
		              )
	                : null
	              }
	            </g>
	        )
	    })
	)
}

export default memo(LifeGrid)