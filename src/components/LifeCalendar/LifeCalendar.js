import React from 'react';
import moment from 'moment'
import { range } from 'd3-array'

import LifeGrid from './LifeGrid'
import LifeLayer from './LifeLayer'

import { getWeekNumber } from '../../helpers/utils'
import { backgroundColorRandom } from '../../helpers/utils'
import '../../App.css';


const LifeCalendar = ({ birthDate }) => {

  // this would be the place to centralize a useReducer redux style state

  // configuration
  const margin = { top: 50, right: 50, bottom: 50, left: 50 }
  const rows = 91
  const width = 400 - margin.left - margin.right
  const paddingMinorHorizontal = 3
  const squareMargin = 1
  const squaresPerRow = 52
  const squareSize = Math.floor((width - (paddingMinorHorizontal * 3) - (squareMargin * squaresPerRow)) / squaresPerRow)
  const height = rows * (squareSize + squareMargin)

  const daysPerSquare = Math.floor(365/squaresPerRow)

  // create the dates array
  const dates = range(squaresPerRow * rows).map((n, i)=> {
    const date = moment.utc(birthDate).add(i % squaresPerRow * daysPerSquare, 'd').add(Math.floor(i/squaresPerRow), 'y')
    const obj = {
      startDate: date.format('YYYY-MM-DD'),
      endDate: date.add(daysPerSquare - 1,'d').format('YYYY-MM-DD'),
      row: Math.floor(i/squaresPerRow),
      column: i % squaresPerRow,
      data: {}
    }

    return { ...obj, id: `${obj.row}-${obj.column}`}
  })

  // TODO refactor this to work not just for weeks! 
  const weekNewYear = (52 - getWeekNumber(birthDate)[1]) % 52

	return (
		<svg 
			width={width + margin.left + margin.right} 
			height={height + margin.top + margin.bottom}
			// className="center"
      // className="debug-grid"
		>
			<g transform={`translate(${margin.left},${margin.top})`}>
				<LifeGrid 
					dates={ dates }
					config={ {squareSize, squareMargin, weekNewYear, paddingMinorHorizontal} }
					birthDate={ birthDate }
				/>
        <LifeLayer
          dates={ dates.slice(40,50) }
          config={ {squareSize, squareMargin, weekNewYear, paddingMinorHorizontal} }
        >
          <rect
            width={squareSize} 
            height={squareSize}
            style={{fill: "black", fillOpacity: "0.3"}}
          >
          </rect>
        </LifeLayer>
        <LifeLayer
          dates={ dates.slice(200,230) }
          config={ {squareSize, squareMargin, weekNewYear, paddingMinorHorizontal} }
        >
          <circle
            cx={squareSize/2}
            cy={squareSize/2}
            r={squareSize/2}
            style={{fill: "goldenrod", fillOpacity: "0.3"}}
          >
          </circle>
        </LifeLayer>
        <LifeLayer
          dates={ dates.slice(210,230) }
          config={ {squareSize, squareMargin, weekNewYear, paddingMinorHorizontal} }
        >
          <rect
            width={squareSize/2} 
            height={squareSize/2}
            style={{fill: "black", fillOpacity: "0.3"}}
            transform={`rotate(45)`}
            transformOrigin="center"
          >
          </rect>
        </LifeLayer>
			</g>
		</svg>
	)
}



export default LifeCalendar;
