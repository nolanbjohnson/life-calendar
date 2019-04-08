import React, { Component } from 'react';
import styled from 'styled-components'
import moment from 'moment'
import { range } from 'd3-array'
import { getWeekNumber } from './helpers/utils'
import Svg from './components/Svg'
import './App.css';

class App extends Component {
  state = {
    birthEpoch: "26438400000",
    birthYear: "1985",
    layers: {
      school_and_work: [
        {startDate: new Date('1985-11-03'), endDate: new Date('1991-11-02'), name: "Baby/Toddler"},
      ],
      trips_and_events: [
        {startDate: new Date('2014-08-01'), endDate: new Date('2014-08-01'), name: 'Move SDM to NYC', emoji: '🗽'},
      ],
      homes: [
        {startDate: new Date('1985-11-03'), endDate: new Date('1991-05-01'), name: 'Canada', location: {lat: 52.136172, lon: -106.729138}}
      ]
    },
    hover: null
  }

  onHover(d) {
    this.setState({hover: d})
  }
  

  render() {
    const { birthEpoch, birthYear, layers, hover } = this.state
    const birthDay = new Date(parseInt(birthEpoch))
    const svgWidth = 1000
    const margin = { top: 50, right: 50, bottom: 50, left: 50 }
    const paddingMinorHorizontal = 3
    const squareMargin = 3
    const squaresPerRow = 52
    const squareSize = (svgWidth - (margin.left + margin.right) - (paddingMinorHorizontal * 3) - (squareMargin * squaresPerRow)) / squaresPerRow
    const rowHeight = squareSize + squareMargin
    const rows = 90
    const aLife = squaresPerRow * rows

    const birthDate = new Date(new Date(`${birthYear}-01-01`) * 1 + parseInt(birthEpoch))

    const yourAge = (new Date() - birthDate) / 1000 / 86400 / 365


    console.log(yourAge)
    console.log(birthDate*1)

    //const dates = Array(52).fill(new Date(birthDate)).map((date, i) => moment.utc(date).add(i * 7, 'd')).reduce((prev, curr) => ({...prev, [curr.format('YYYY-MM-DD')]: {date: curr}}), {})

    const dates = range(squaresPerRow * rows).map((n, i)=> {
      const date = moment.utc(birthDate).add(i % squaresPerRow * 7, 'd').add(Math.floor(i/squaresPerRow), 'y')
      const obj = {
        startDate: date.format('x'),
        endDate: date.add(6,'d').format('x'),
        row: Math.floor(i/squaresPerRow),
        column: i % squaresPerRow,
        data: {}
      }

      return { ...obj, id: `${obj.row}-${obj.column}`}
    })
    // console.log(dates)

    const selectedDate = dates.filter(date => date.id === this.state.hover)[0] || {}
    const selectedEvents = layers["trips_and_events"].filter(event => event.startDate >= new Date(parseInt(selectedDate.startDate)) && event.startDate <= new Date(parseInt(selectedDate.endDate))) || []
    const weekNewYear = (52 - getWeekNumber(birthDay)[1] + 1) % 52

    const colorSwitch = (index, row, opacity) => {
      return "rgba(255,255,255,1)"
      if(index === 0 && row === 0) { return `rgba(100,149,237,1)` } else 
      if(row < 6) { return `rgba(100,237,237,${opacity})` } else 
      if(row < 11) { return `rgba(50,100,237,${opacity})` } else 
      if(row < 14) { return `rgba(205,92,92,${opacity})` } else
      if(row < 18) { return `rgba(92,205,92,${opacity})` } else
      if(row < 22) { return `rgba(205,92,205,${opacity})` } else
      // if(index < parseInt(52 * yourAge)) { return `rgba(205,92,205,0.3)` } else
      if(row < yourAge || (index < Math.floor((yourAge % 1) * 52) && row < yourAge + 1)) { return `hsla(${index*row / 2},100%,50%,${opacity})` } else 
      return `rgba(255,255,255,${opacity})`
    }

    const weekDate = (index, row) => {
      // const addDays = (index % 52 * 7)
      // const new Date(birthDate.setDate( * 1 + ( + (Math.trunc( index / 52 ) * 1000 * 86400 * 365))

      return moment(birthDate).utc()
              .add(index * 7, 'd')
              .add(row, 'y')
    }

    console.log(getWeekNumber(birthDay)[1], weekNewYear)

    const squares = dates.map((date,i) => {
        const date_events = layers["trips_and_events"].filter(event => event.startDate >= new Date(parseInt(date.startDate)) && event.startDate <= new Date(parseInt(date.endDate)))[0]
        return (
            <g key={`${date.row}-${date.column}`}
               transform={`translate(${squareSize * date.column + squareMargin * date.column + (date.column >= weekNewYear ? paddingMinorHorizontal : 0)}, ${date.row * rowHeight})`}
               onClick={() => this.setState({hover: date.id})}
            >
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
                       
              <rect width={squareSize} 
                    height={squareSize}
                    className="date"
                    rx={2}
                    ry={2}
                    style={{fill: this.state.hover === date.id ? 'black' : colorSwitch(date.column, date.row, 0.5), strokeWidth: date_events ? "2" : "1", stroke: "rgba(150,150,150)"}}
              >

                <title style={{fontSize: "3em"}}
                >
                  { moment.utc(parseInt(date.startDate)).format("M/DD/YY") }
                  {
                    date_events
                    ? (
                        <p>
                          <span role="img">{ date_events.emoji }</span>
                          { date_events.name }
                        </p>
                      )
                    : null
                  }
                </title> 
              </rect>
              
            </g>
        )
    })

    console.log(selectedDate)

    return (
      <div className="App mh3 mv4" style={{ minWidth: "950px" }} >
        <div className="tooltip fixed top-0 right-0 ba pa2">
          <h2>Info:</h2>
          {
            hover
            ? (
                <div>
                  <p>{ `Age ${selectedDate.row}`}</p>
                  <p>{ `${moment.utc(parseInt(selectedDate.startDate)).format("MM/DD")}-${moment.utc(parseInt(selectedDate.endDate)).format("MM/DD/YY")}` }</p>
                <ul>
                  {
                    selectedEvents.map(event => <li>{ `${event.name} ${event.emoji}` }</li>)
                  }
                </ul>
                </div>
              )
            : (<p>Click a square</p>)
          }
        </div>
        <p>Weeks are aligned to your birth date rather than the typical start day (Sun or Mon). This way, the first block in each row is your birthday! 🎉</p>
        <input type="range" 
               value={ birthEpoch } 
               onChange={ e => this.setState({ birthEpoch: e.target.value }) } 
               min={ 0 }
               max={ 60*60*24*364*1000 }
               step={ 60*60*24*1000 }
               style={{display: "block", width: "40%", margin: "auto"}}
        />
        <input type="number" value={ birthYear } onChange={ e => this.setState({ birthYear: e.target.value }) } />
        <p>{ `Birth date: ${moment(birthDay).utc().format("M/DD")}`}</p>
        
        <Svg width={svgWidth} height={rows * (squareSize + squareMargin) + margin.top * 2}>
        <g transform={`translate(${margin.left},${margin.top})`}>
        <text fontSize="2rem"
              textAnchor="end" alignmentBaseline="baseline" 
              fontVariant="small-caps">
            🎂
        </text>
        <text fontSize="0.8rem"
              transform={`translate(${weekNewYear * (squareSize + squareMargin) + (squareSize * 0.5)}, -10)`}
              fontVariant="small-caps">
            January 1
        </text>
        <text fontSize="0.8rem"
              transform={`translate(${(weekNewYear + 26)%52 * (squareSize + squareMargin) + margin.left + (squareSize * 0.3)}, -10)`}
              fontVariant="small-caps">

            July 1
        </text>

        {/*
          range(rows).map((row,i) => (
            // row group
            <g key={`row-${i}`}
               transform={`translate(0, ${i * rowHeight})`}
            >
            { i % 5 === 0 && i !== 0
              ? <text fontSize="0.8rem" textAnchor="end" alignmentBaseline="hanging" transform={`translate(-5,0)`}> { i } </text> 
              : null }
              { 
                range(squaresPerRow).map((square,i) => (
                  // single square group
                  <g key={`row-${i}-square-${i}`}
                     transform={`translate(${squareSize * i + squareMargin * i + (i >= weekNewYear ? paddingMinorHorizontal : 0)},0)`}
                     onClick={() => this.setState({hover: (row+1)*1000 + i})}
                  >
                    <rect width={squareSize} 
                          height={squareSize}
                          rx={2}
                          ry={2}
                          style={{fill: this.state.hover === (row+1)*1000 + i ? 'black' : backgroundColor(i, row), strokeWidth: "1", stroke: "rgb(150,150,150)"}}
                    >
                    <title>{moment.utc(weekDate(i, row)).format("M/DD/YY")}</title>
                    </rect>
                  </g>
                ))
              }
            </g>
          ))
        */}

        {
          squares
        } 
        </g>
        { /*
          Array(aLife).fill(0).map((square, i) => (
            <g key={i} 
               transform={
                  `translate(
                          ${(squareSize * (i % 52)) + (squareMargin * (i % 52)) + margin.left + (paddingMinorHorizontal * ((i % 52) >= weekNewYear))}, 
                          ${((squareSize + squareMargin) * Math.floor(i / squaresPerRow)) + margin.top}
                          )`}
            >
            { i % 52 === 0 && Math.floor(i / squaresPerRow) % 5 === 0 && i !== 0
              ? <text fontSize="0.8rem" textAnchor="end" alignmentBaseline="hanging" transform={`translate(-5,0)`}> { Math.floor(i / squaresPerRow) } </text> 
              : null }
            <rect 
                  className='week-cell'
                  width={squareSize} 
                  height={squareSize} 
                  data-index={i}
                  data-week-date={moment(weekDate(i)).utc()}
                  style={{fill: backgroundColor(i), strokeWidth: "1", stroke: "rgb(150,150,150)"}}>
                  <title>{moment(weekDate(i)).utc().format("M/DD/YY")}</title>
            </rect>
            </g>
            ))
          */
        }
        </Svg>
      </div>
    );
  }
}



export default App;
