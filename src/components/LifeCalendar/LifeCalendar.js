import React, { useState, useEffect } from 'react';
import moment from 'moment'
import { range } from 'd3-array'

import LifeGrid from './LifeGrid'
import LifeLayer from './LifeLayer'

import { getWeekNumber } from '../../helpers/utils'
import '../../App.css';



const LifeCalendar = ({ birthDate, events, highlightEvent }) => {

  const [displayLayer, setDisplayLayer] = useState(null)
  const [dates, setDates] = useState([])

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

  // this would be the place to centralize a useReducer redux style state

  // TODO refactor this to work not just for weeks! 

  // create the dates array

  useEffect(() => {
    const datesArray = range(squaresPerRow * rows).map((n, i)=> {
      const startDate = moment.utc(birthDate).add(i % squaresPerRow * daysPerSquare, 'd').add(Math.floor(i/squaresPerRow), 'y')
      const endDate = moment.utc(startDate).add(daysPerSquare - 1,'d')

      const eventsData = events.filter(event =>
                                        (
                                          (moment.utc(event.startDate) <= startDate && moment.utc(event.endDate || nowDate) >= moment.utc(startDate)) ||
                                          (moment.utc(event.startDate) >= startDate && moment.utc(event.startDate) <= moment.utc(endDate))
                                        ))

      const obj = {
        startDate: startDate.format("YYYY-MM-DD"),
        startDateLocaleFormat: startDate.format("M/DD/YY"),
        endDate: endDate.format("YYYY-MM-DD"),
        endDateLocaleFormat: endDate.format("M/DD/YY"),
        row: Math.floor(i/squaresPerRow),
        column: i % squaresPerRow,
        current: startDate <= nowDate && endDate.add(1, 'd') >= nowDate,
        data: {
          events: eventsData.filter(event => event.type === 'event'),
          homes: eventsData.filter(event => event.type === 'home')
        },
        eventIds: eventsData.filter(event => event.type === 'event').map(event => event.uid)
      }

      return { 
        ...obj, 
        id: `${obj.row}-${obj.column}`,
      }
    })
    setDates(datesArray)
  }, [events])
  
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
          transform={`translate(0,-10)`}
          onMouseEnter={ () => setDisplayLayer(1)} 
          onMouseOut={ () => setDisplayLayer(null) }
        >
          🐙
        </text>
        <text 
          transform={`translate(20,-10)`}
          onMouseEnter={ () => setDisplayLayer(2)} 
          onMouseOut={ () => setDisplayLayer(null) } 
        >
          🐙
        </text>
        <text 
          transform={`translate(40,-10)`}
          onMouseEnter={ () => setDisplayLayer(3)} 
          onMouseOut={ () => setDisplayLayer(null) } 
        >
          🐙
        </text>
        <text 
          transform={`translate(60,-10)`}
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
        { highlightEvent 
          ? <LifeLayer
              dates={ Array(dates.find(date => date.eventIds.indexOf(highlightEvent.id) !== -1)) || [] }
              config={ {squareSize, squareMargin, weekNewYear, paddingMinorHorizontal} }
            >
              <rect
                width={squareSize * 2} 
                height={squareSize * 2}
                transform={`translate(${-squareSize/2},${-squareSize/2})`}
                style={{fill: "none", stroke: "black", strokeWidth: "2px"}}
              >
              </rect>
            </LifeLayer>
          : null
        }
			</g>
		</svg>
	)
}

export default LifeCalendar;
