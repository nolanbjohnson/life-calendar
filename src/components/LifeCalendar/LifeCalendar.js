import React, { useState, useEffect, useMemo } from 'react'
import _ from 'lodash'
import * as d3Time from 'd3-time'
import PropTypes from 'prop-types'
import { pure } from 'recompose'
import moment from 'moment'
import { range } from 'd3-array'

import LifeGrid from './LifeGrid'
import LifeLayer from './LifeLayer'

import { getWeekNumber } from '../../helpers/utils'
import '../../App.css'


const colorAssignment = {}

const randColor = (name) => {
  if (colorAssignment[name]) return colorAssignment[name]
  // TODO use d3 color mapping
  let newColor = ""
  switch (Object.keys(colorAssignment).length) {
    case 0:
      newColor = "rgba(155,90,90,0.5)"
      break
    case 1:
      newColor = "rgba(90,155,90,0.5)"
      break
    case 2:
      newColor = "rgba(90,90,155,0.5)"
      break
    case 3:
      newColor = "rgba(155,90,155,0.5)"
      break
    case 4:
      newColor = "rgba(155,155,90,0.5)"
      break
    case 5:
      newColor = "rgba(90,155,155,0.5)"
      break
    case 6:
      newColor = "rgba(90,90,90,0.5)"
      break
    case 7:
      newColor = "rgba(30,90,155,0.5)"
      break
    default:
      newColor = "#ebedf0"
      break
  }
  
  colorAssignment[name] = newColor
  return newColor
}

const eventWithinDateRange = (eventStart, eventEnd, dateStart, dateEnd, rangeTypeEvent) => {
  // console.log(eventStart, eventEnd, dateStart, dateEnd, rangeTypeEvent)
  if (eventStart >= dateEnd) return false // always outside

  const beganBefore = eventStart <= dateStart
  const endsAfter = eventEnd >= dateEnd
  const nowIsAfter = new Date() >= dateEnd

  const beganDuring = eventStart >= dateStart && eventStart <= dateEnd // always include
  const endsDuring = eventEnd >= dateStart && eventEnd <= dateEnd // always include

  if (beganDuring || endsDuring) return true // this is always within

  if (rangeTypeEvent && !eventEnd) {
    return beganBefore && (endsAfter || nowIsAfter) // assume end date is current date when not specified
  } else {
    return beganBefore && endsAfter
  }
}

const dateRangesOverlap = (start1, end1, start2, end2) => {
  // simplified De Morgan's Law https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
  return Math.max(start1, start2) < Math.min(end1, end2)
}

const LifeCalendar = ({ birthdate, events, showEvent, showLayers, highlightEvents, highlightNow }) => {
  // TODO take some pointers from this for formatting: https://observablehq.com/@d3/calendar-view
  // TODO also maybe d3.time can help with the time-related magic I'm trying to do: https://github.com/d3/d3-time
  console.log(' ***** life calendar - render ***** ')

  const [displayLayer, setDisplayLayer] = useState(null)
  const [dates, setDates] = useState([])
  const [highlightDate, setHighlightDate] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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

  // const dates = useMemo( 
  //   () => {
  //     console.log(showLayers)
  //     const defaultBirthdate = new Date(birthdate).toISOString() === new Date(Date.UTC(new Date().getFullYear(),0,1)).toISOString()
      
  //     const datesArray = range(squaresPerRow * rows).map((n, i)=> {
  //       // TODO this misses some days because it assumes years have 52*7=364 days. Maybe include "nextStartDate" in each event?
  //       // and endDate is nextStartDate - 1, which would add the extra day to the end.
  //       // TODO also leap years...Feb 29 is an issue for the following week, which is missing a day. All this only matters if
  //       // an event occurs on that specific date that falls between two squares
  //       const startDate = moment.utc(birthdate).add(i % squaresPerRow * daysPerSquare, 'd').add(Math.floor(i/squaresPerRow), 'y')
  //       const endDate = moment.utc(startDate).add(daysPerSquare - 1,'d')

  //       const eventsData = events.filter(event => eventWithinDateRange(new Date(event.startDate), event.endDate ? new Date(event.endDate) : undefined, startDate, moment.utc(endDate).add(1,'d'), !(event.type && event.type==='event')))

  //       const obj = {
  //         startDate: startDate.format("YYYY-MM-DD"),
  //         startDateLocaleFormat: startDate.format("M/DD/YY"),
  //         endDate: endDate.format("YYYY-MM-DD"),
  //         endDateLocaleFormat: endDate.format("M/DD/YY"),
  //         row: Math.floor(i/squaresPerRow),
  //         column: i % squaresPerRow,
  //         current: defaultBirthdate ? false : startDate <= nowDate && endDate.add(1, 'd') >= nowDate,
  //         data: {
  //           events: eventsData.filter(event => event.type === 'event'),
  //           homes: eventsData.filter(event => event.type === 'home'),
  //           [showLayers[0]]: eventsData.filter(event => event.layerName === showLayers[0]),
  //         },
  //         eventIds: eventsData.filter(event => event.type === 'event').map(event => event.uid)
  //       }

  //       return { 
  //         ...obj, 
  //         id: `${obj.row}-${obj.column}`,
  //       }
  //     })
  //     console.log(datesArray)
  //     return datesArray
  //   }, [events, showLayers, birthdate])

  useEffect(() => {
    const dtBirthdate = new Date(birthdate)
    const birthdayEachYear = offset => new Date(Date.UTC(dtBirthdate.getUTCFullYear() + offset, dtBirthdate.getUTCMonth(), dtBirthdate.getUTCDate()))
    console.log(birthdate, dtBirthdate, birthdayEachYear(0))
    const years = Array(rows).fill('').map((_, i) => birthdayEachYear(i))
    const years_weeks = years
      .map(year => d3Time.utcDay.range(year, d3Time.utcYear.offset(year), 7)) // create weeks for each year
      .map((year, i) => [ ...year.slice(0, year.length-1)]) // remove last week of year - penultimate week will span through birthdate

    console.log(years_weeks.reduce((weeks, year) => [...weeks, ...year], []))
  }, [])

  const defaultBirthdate = new Date(birthdate).toISOString() === new Date(Date.UTC(new Date().getFullYear(),0,1)).toISOString()
  
  useEffect(() => {
    const datesArray = range(squaresPerRow * rows).map((n, i)=> {
      // TODO this misses some days because it assumes years have 52*7=364 days. Maybe include "nextStartDate" in each event?
      // and endDate is nextStartDate - 1, which would add the extra day to the end.
      // TODO also leap years...Feb 29 is an issue for the following week, which is missing a day. All this only matters if
      // an event occurs on that specific date that falls between two squares
      const startDate = moment.utc(birthdate).add(i % squaresPerRow * daysPerSquare, 'd').add(Math.floor(i/squaresPerRow), 'y')
      const endDate = moment.utc(startDate).add(daysPerSquare - 1,'d')

      // const eventsData = events.filter(event => eventWithinDateRange(new Date(event.startDate), new Date(event.endDate), startDate, endDate, !event.type==='event'))
      const eventsData = events.filter(event => event.type==='event' 
                                        ? startDate <= new Date(event.startDate) && new Date(event.startDate) <= endDate
                                        : dateRangesOverlap(new Date(event.startDate), new Date(event.endDate || Date.now()), startDate, endDate))

      const layers = showLayers.map(layer => eventsData.find(event => event.layerName === layer) || {})

      // if (layers.length > 0 && layers[0].hasOwnProperty('name')) console.log(layers)

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
          layers
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
      setIsLoading(false)
    }

  }, [events, showLayers, birthdate])

  useEffect(() => {
    if (showEvent) {
      setHighlightDate(Array(dates.find(date => date.eventIds.indexOf(showEvent.uid) !== -1)))
    } else {
      setHighlightDate([])
    }
  }, [showEvent])

  const layers = useMemo(() => {
    // const layersObj = showLayers.map(layer => ({name: layer, dates: dates}))
    const layers = showLayers.reduce((layers, layer) => {
      const layerItems = events.filter(event => event.layerName === layer)
      const layerDates = layerItems
                            .map(layerItem => ({
                                ...layerItem,
                                fillColor: randColor(layerItem.name),
                                dates: dates.filter(date => (
                                  new Date(layerItem.startDate) <= new Date(date.endDate) 
                                  && new Date(layerItem.endDate || nowDate) >= new Date(date.endDate)
                                  // eventWithinDateRange(new Date(layerItem.startDate), 
                                  //                      new Date(layerItem.endDate), 
                                  //                      new Date(date.startDate), 
                                  //                      new Date(date.endDate), 
                                  //                      true)
                                ))
                              }))
      return [...layers, ...layerDates]
    }, [])
    return layers
  }, [showLayers, events])
  
  console.log('lifecal/layers: ', layers)
  
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

        {
          !isLoading && <LifeGrid 
  					dates={ dates }
  					config={ config }
            birthdate={ birthdate }
            weekNewYear={ weekNewYear }
            showLayers={ showLayers }
            showYears={ !defaultBirthdate }
				  />
        }

        { 
          showLayers.length > 0 && (
            layers.map(layer => (
              <LifeLayer
                key={ layer.uid }
                dates={ layer.dates }
                config={{squareSize, squareMargin, weekNewYear, paddingMinorHorizontal}}
              >
                <rect
                  width={squareSize} 
                  height={squareSize}
                  style={{fill: layer.fillColor, pointerEvents: "none"}}
                >
                </rect>
              </LifeLayer>
            ))
          )
       }

      { 
          highlightEvents && (
            <LifeLayer
              dates={ dates.filter(date => date.data.events.length > 0) }
              config={{squareSize, squareMargin, weekNewYear, paddingMinorHorizontal}}
            >
              <rect
                width={squareSize}
                height={squareSize}
                style={{ fill: "transparent", strokeWidth:  1, stroke: "darkgrey" }}
              >
              </rect>
            </LifeLayer>
          )
       }

      { 
          highlightNow && (
            <LifeLayer
              dates={ dates.filter(date => date.current) }
              config={{squareSize, squareMargin, weekNewYear, paddingMinorHorizontal}}
            >
              <rect
                width={squareSize}
                height={squareSize}
                style={{ fill: "transparent", strokeWidth:  1, stroke: "steelblue" }}
              >
              </rect>
            </LifeLayer>
          )
       }


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
  showLayers: PropTypes.array,
  highlightEvent: PropTypes.bool,
  highlightNow: PropTypes.bool,
}

LifeCalendar.defaultProps = {
  birthdate: new Date(Date.UTC(new Date().getFullYear(),0,1)).toISOString().replace(/T.*/,""),
  events: [],
  showLayers: [],
  highlightEvents: true,
  highlightNow: true
}

LifeCalendar.whyDidYouRender = true

export default pure(LifeCalendar)

