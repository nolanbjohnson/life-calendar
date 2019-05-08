import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { pure } from 'recompose'
import moment from 'moment'
import { range } from 'd3-array'

import LifeGrid from './LifeGrid'
import LifeLayer from './LifeLayer'

import { getWeekNumber } from '../../helpers/utils'
import '../../App.css'

const eventWithinDateRange = (eventStart, eventEnd, dateStart, dateEnd, rangeTypeEvent) => {
  // console.log(eventStart, eventEnd, dateStart, dateEnd, rangeTypeEvent)
  if (eventStart >= dateEnd) return false // always outside

  const beganBefore = eventStart <= dateStart
  const endsAfter = eventEnd >= dateEnd
  const nowIsAfter = new Date() >= dateEnd

  const beganDuring = eventStart >= dateStart && eventStart <= dateEnd // always include
  const endsDuring = eventEnd >= dateStart && eventEnd <= dateEnd // always include

  if (beganDuring || endsDuring) return true // this is always within

  if (rangeTypeEvent && !dateEnd) {
    return beganBefore && (endsAfter || nowIsAfter) // assume end date is current date when not specified
  } else {
    return beganBefore && endsAfter
  }
}

const LifeCalendar = ({ birthdate, events, showEvent }) => {

  console.log(' ***** life calendar - render ***** ')

  const [displayLayer, setDisplayLayer] = useState(null)
  const [dates, setDates] = useState([])
  const [highlightDate, setHighlightDate] = useState([])

  // configuration
  const margin = { top: 50, right: 50, bottom: 50, left: 50 }
  const rows = 91
  const width = 400 - margin.left - margin.right
  const paddingMinorHorizontal = 3
  const squareMargin = 1
  const squaresPerRow = 52
  const squareSize = Math.round(100*(width - (paddingMinorHorizontal) - (squareMargin * squaresPerRow)) / squaresPerRow)/100
  const height = rows * (squareSize + squareMargin)

  const daysPerSquare = Math.floor(365/squaresPerRow)

  const config = {squareSize, squareMargin, paddingMinorHorizontal}

  const nowDate = moment.utc()
  const weekNewYear = (53 - getWeekNumber(new Date(birthdate))[1]) % 52
  // this would be the place to centralize a useReducer redux style state

  // TODO refactor this to work not just for weeks! 

  // create the dates array

  useEffect(() => {
    const defaultBirthdate = new Date(birthdate).toISOString() === new Date(Date.UTC(new Date().getFullYear(),0,1)).toISOString()

    const datesArray = range(squaresPerRow * rows).map((n, i)=> {
      // TODO this misses some days because it assumes years have 52*7=364 days. Maybe include "nextStartDate" in each event?
      // and endDate is nextStartDate - 1, which would add the extra day to the end.
      // TODO also leap years...Feb 29 is an issue for the following week, which is missing a day. All this only matters if
      // an event occurs on that specific date that falls between two squares
      const startDate = moment.utc(birthdate).add(i % squaresPerRow * daysPerSquare, 'd').add(Math.floor(i/squaresPerRow), 'y')
      const endDate = moment.utc(startDate).add(daysPerSquare - 1,'d')

      const eventsData = events.filter(event => eventWithinDateRange(new Date(event.startDate), new Date(event.endDate), startDate, endDate, !event.type==='event'))

      const obj = {
        startDate: startDate.format("YYYY-MM-DD"),
        startDateLocaleFormat: startDate.format("M/DD/YY"),
        endDate: endDate.format("YYYY-MM-DD"),
        endDateLocaleFormat: endDate.format("M/DD/YY"),
        row: Math.floor(i/squaresPerRow),
        column: i % squaresPerRow,
        current: defaultBirthdate ? false : startDate <= nowDate && endDate.add(1, 'd') >= nowDate,
        data: {
          events: eventsData.filter(event => event.type === 'event'),
          homes: eventsData.filter(event => event.type === 'home'),
          schools: eventsData.filter(event => event.layerName === 'School'), 
        },
        eventIds: eventsData.filter(event => event.type === 'event').map(event => event.uid)
      }

      return { 
        ...obj, 
        id: `${obj.row}-${obj.column}`,
      }
    })

    if (!_.isEqual(datesArray, dates)) {
      setDates(datesArray)
    }

  }, [events, birthdate])

  useEffect(() => {
    if (showEvent) {
      setHighlightDate(Array(dates.find(date => date.eventIds.indexOf(showEvent.uid) !== -1)))
    } else {
      setHighlightDate([])
    }
  }, [showEvent])

	return (
		<svg 
			width={ width + margin.left + margin.right } 
			height={ height + margin.top + margin.bottom }
		>
			<g transform={`translate(${margin.left},${margin.top})`}>
        <text
          transform={`translate(${width/2},-10)`}
          textAnchor="middle"
          alignmentBaseline="baseline"
        >
          Your Life Calendar
        </text>
        <LifeGrid 
					dates={ dates }
					config={ config }
					birthdate={ birthdate }
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
    { /*
      events.length > 0
      ? (
        <React.Fragment>
        <path 
          d={`M0 0 
              H ${52 * (squareSize + squareMargin) + paddingMinorHorizontal} 
              V ${3 * (squareSize + squareMargin)} 
              H ${30 * (squareSize + squareMargin) + paddingMinorHorizontal} 
              V ${4 * (squareSize + squareMargin)} 
              H ${0 * (squareSize + squareMargin)} 
              Z`} 
          style={{fill: "rgba(100,170,180,0.3)", pointerEvents: "none"}}
        />
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
          </React.Fragment>
        )
        : null
      )*/}
        { showEvent 
          ? <LifeLayer
              dates={ highlightDate }
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

LifeCalendar.propTypes = {
  birthdate: PropTypes.string,
  events: PropTypes.array,
}

LifeCalendar.defaultProps = {
  birthdate: new Date(Date.UTC(new Date().getFullYear(),0,1)).toISOString().replace(/T.*/,""),
  events: []
}

LifeCalendar.whyDidYouRender = true

export default pure(LifeCalendar)

