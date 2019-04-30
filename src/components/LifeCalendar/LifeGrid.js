import React, { memo } from 'react'
import LifeBox from './LifeBox'
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

const LifeGrid = ({ dates, birthDate, config }) => {
	
	const { squareSize, squareMargin, weekNewYear, paddingMinorHorizontal } = config

	const rowHeight = squareSize + squareMargin

	const yourAge = (new Date() - birthDate) / 1000 / 86400 / 365

	return (
		dates.map((date,i) => {
	        return (
	            <g key={`${date.row}-${date.column}`}
	               transform={`translate(${((squareSize + squareMargin) * date.column) + (date.column >= weekNewYear ? paddingMinorHorizontal : 0)}, ${date.row * rowHeight})`}
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
	              	startDate={ date.startDate }
	              	endDate={ date.endDate }
	              > 
	              </LifeBox>
	            </g>
	        )
	    })
	)
}

export default LifeGrid