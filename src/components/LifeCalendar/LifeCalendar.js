import React, { useState } from 'react';
import moment from 'moment'
import { range } from 'd3-array'

import LifeGrid from './LifeGrid'
import LifeLayer from './LifeLayer'

import { getWeekNumber } from '../../helpers/utils'
import { backgroundColorRandom } from '../../helpers/utils'
import '../../App.css';

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


const nowDate = moment.utc()

const config = {squareSize, squareMargin, paddingMinorHorizontal}


const LifeCalendar = ({ birthDate }) => {

  const [displayLayer, setDisplayLayer] = useState(null)

  // this would be the place to centralize a useReducer redux style state

  // TODO refactor this to work not just for weeks! 

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

    return { ...obj, id: `${obj.row}-${obj.column}`, current: moment.utc(obj.startDate) <= nowDate && moment.utc(obj.endDate).add(1, 'd') >= nowDate }
  })
  
  const weekNewYear = (52 - getWeekNumber(birthDate)[1]) % 52

	return (
		<svg 
			width={width + margin.left + margin.right} 
			height={height + margin.top + margin.bottom}
			// className="center"
      // className="debug-grid"
		>
			<g transform={`translate(${margin.left},${margin.top})`}>
        <text 
          transform={`translate(0,0)`}
          onMouseEnter={ () => setDisplayLayer(1)} 
          onMouseOut={ () => setDisplayLayer(null) }
        >
          🐙
        </text>
        <text 
          transform={`translate(20,0)`}
          onMouseEnter={ () => setDisplayLayer(2)} 
          onMouseOut={ () => setDisplayLayer(null) } 
        >
          🐙
        </text>
        <text 
          transform={`translate(40,0)`}
          onMouseEnter={ () => setDisplayLayer(3)} 
          onMouseOut={ () => setDisplayLayer(null) } 
        >
          🐙
        </text>
        <text 
          transform={`translate(60,0)`}
          onMouseEnter={ () => setDisplayLayer(4)} 
          onMouseOut={ () => setDisplayLayer(null) } 
        >
          🐙
        </text>
				<LifeGrid 
					dates={ dates }
					config={ config }
					birthDate={ birthDate }
          weekNewYear={ weekNewYear }
				/>
        { /* <LifeLayer
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
          <text
            fontSize="0.3rem"
            style={{fillOpacity: "0.5"}}
            textAnchor="start"
            alignmentBaseline="middle" 
            onClick={(e) => console.log(e.target)}
          >
            😀
          </text>
        </LifeLayer>
        */ }
        <LifeLayer
          className={ displayLayer === 1 ? "" : "dn" }
          dates={ dates.filter(date => date.startDate < '1991-05-03') }
          config={ {squareSize, squareMargin, weekNewYear, paddingMinorHorizontal} }
        >
          <rect
            width={squareSize} 
            height={squareSize}
            style={{fill: "blue", fillOpacity: "0.3"}}
          >
          </rect>
        </LifeLayer>
        <LifeLayer
          className={ displayLayer === 2 ? "" : "dn" }
          dates={ dates.slice(300,600) }
          config={ {squareSize, squareMargin, weekNewYear, paddingMinorHorizontal} }
        >
          <rect
            width={squareSize} 
            height={squareSize}
            style={{fill: "red", fillOpacity: "0.3"}}
          >
          </rect>
        </LifeLayer>
        <LifeLayer
          className={ displayLayer === 3 ? "" : "dn" }
          dates={ dates.slice(600,1200) }
          config={ {squareSize, squareMargin, weekNewYear, paddingMinorHorizontal} }
        >
          <rect
            width={squareSize} 
            height={squareSize}
            style={{fill: "green", fillOpacity: "0.3"}}
          >
          </rect>
        </LifeLayer>
        <LifeLayer
          className={ displayLayer === 4 ? "" : "dn" }
          dates={ dates.slice(1200,2500) }
          config={ {squareSize, squareMargin, weekNewYear, paddingMinorHorizontal} }
        >
          <rect
            width={squareSize} 
            height={squareSize}
            style={{fill: "purple", fillOpacity: "0.3"}}
          >
          </rect>
        </LifeLayer>
			</g>
		</svg>
	)
}



export default LifeCalendar;
