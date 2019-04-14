import React, { Component } from 'react';
import moment from 'moment'
import { range } from 'd3-array'
import firebase from './firebase'
import { getWeekNumber } from './helpers/utils'
import Svg from './components/Svg'
import EventForm from './components/EventForm'
import BirthDateForm from './components/BirthDateForm'
import DatePicker from './components/DatePicker'
import LifeGrid from './components/LifeGrid'
import EventsScreen from './screens/EventsScreen'
import './App.css';

class App extends Component {
  state = {
    birthEpoch: "26438400000",
    birthYear: "1985",
    birthDate: new Date("1985-11-03"),
    birthDateFormOpen: false,
    datePickerEditMode: false,
    school_and_work: [
      {startDate: new Date('1985-11-03'), endDate: new Date('1991-11-02'), name: "Baby/Toddler"},
    ],
    // trips_and_events: [
    //   {startDate: new Date('1985-11-03'), endDate: new Date('1985-11-03'), name: 'You were born!', emoji: '🎂'},
    //   {startDate: new Date('1991-05-01'), endDate: new Date('1991-05-01'), name: 'Moved to Arizona', emoji: '🌵'},
    //   {startDate: new Date('2014-08-01'), endDate: new Date('2014-08-01'), name: 'Move SDM to NYC', emoji: '🗽'},
    //   {startDate: new Date('2015-04-01'), endDate: new Date('2015-04-01'), name: 'Moved to NYC', emoji: '🗽'},
    //   {startDate: new Date('2011-02-05'), endDate: new Date('2011-02-11'), name: 'Moved to Madison, WI', emoji: '🧀'},
    // ],
    trips_and_events: [],
    homes: [
      {startDate: new Date('1985-11-03'), endDate: new Date('1991-05-01'), name: 'Canada', location: {lat: 52.136172, lon: -106.729138}}
    ],
    hovered: '',
    clicked: '',
  }

  componentDidMount() {
    const eventsRef = firebase.database().ref('events');
    eventsRef.on('value', snapshot => {
      let events = snapshot.val();
      let newState = [];
      for (let event in events) {
        newState.push({
          id: event,
          startDate: new Date(events[event].startDate),
          endDate: new Date(events[event].endDate) || null,
          name: events[event].name,
          emoji: events[event].emoji,
        });
      }
      this.setState({
        trips_and_events: newState
      });
    });
  }

  onClick = (dateID) => {
    this.setState(prevState => ({clicked: prevState.clicked === dateID ? '' : dateID}))
  }

  onHover = (dateID) => {
    this.setState({hovered: dateID})
  }

  handleBirthDateFormOpen = () => {
    this.setState({ birthDateFormOpen: true })
  }

  handleBirthDateFormClose = () => {
    this.setState({ birthDateFormOpen: false })
  }

  handleNewTripEvent = (e) => {
    e.preventDefault()

    const eventsRef = firebase.database().ref('events') // set ref to firebase db

    const form = e.target
    const data = new FormData(form)
    let event = {}

    for(let input of data.entries()) {
      event[input[0]] = input[0] === "startDate" ? moment.utc(input[1]).format("YYYY-MM-DD") : input[1]
    }

    if(! event.startDate instanceof Date) return
    if(event.name==="") return

    eventsRef.push(event) // send event to firebase db

    console.log(event)
    
    // this.setState(prevState => (
    //   { trips_and_events: [ ...prevState.trips_and_events,  event] }
    // ))
  }

  handleBirthDate = (e) => {
    e.preventDefault()
    const form = e.target
    const data = new FormData(form)
    let newState = {}

    for(let input of data.entries()) {
      newState[input[0]] = input[1]
    }

    console.log(newState)
    
    this.setState({
      birthDate: new Date(newState['birthDate']) 
    })
  }
  

  render() {
    const { birthEpoch, birthYear, birthDate, trips_and_events, hovered, clicked, birthDateFormOpen, datePickerEditMode } = this.state
    const birthDay = new Date(parseInt(birthEpoch))
    const svgWidth = 1000
    const margin = { top: 50, right: 50, bottom: 50, left: 50 }
    const paddingMinorHorizontal = 3
    const squareMargin = 3
    const squaresPerRow = 52
    const squareSize = (svgWidth - (margin.left + margin.right) - (paddingMinorHorizontal * 3) - (squareMargin * squaresPerRow)) / squaresPerRow
    const rowHeight = squareSize + squareMargin
    const rows = 70
    const daysPerSquare = Math.floor(365/squaresPerRow)

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

    const selectedDate = dates.filter(date => date.id === clicked)[0] || {}
    const selectedEvents = trips_and_events.filter(event => event.startDate >= new Date(selectedDate.startDate) && event.startDate <= new Date(selectedDate.endDate)) || []
    const weekNewYear = (52 - getWeekNumber(birthDate)[1]) % 52

    console.log(getWeekNumber(birthDate)[1], weekNewYear)

    return (
      <div className="App mh3 mv4" style={{ minWidth: "950px" }} >
        <BirthDateForm
          onSubmit={ this.handleBirthDate }
          closeForm={ this.handleBirthDateFormClose }
          open={ birthDateFormOpen }
        />
        <div className="Header">
          
          <h2 className="lh-copy">
            Your birthday is&nbsp;
            <DatePicker
              initialDate={ moment.utc(birthDate).format("YYYY-MM-DD") }
              format="MMMM DD, YYYY"
              editMode={ datePickerEditMode }
              closeForm={ () => this.setState({ datePickerEditMode: false }) }
              openForm={ () => this.setState({ datePickerEditMode: true }) }
              onSubmit={ this.handleBirthDate }
              inline
            />
          </h2>
          <p>To change it, click the <span role="img" aria-label="birthday cake" onClick={ this.handleBirthDateFormOpen }>🎂</span>icon in the grid below.</p>
          <p>Weeks are aligned to your birth date rather than the typical start day (Sun or Mon). This way, the first block in each row is your birthday! <span role="img" aria-label="party">🎉</span></p>
          <p>This is my take on the post <a href="https://waitbutwhy.com/2014/05/life-weeks.html">Your Life in Weeks</a> by Tim Urban of Wait But Why. Thanks, Tim, for this hugely influential concept (though most people I share it with find it at least a bit macabre).</p>
        </div>
        <div className="Main">
          <EventsScreen events={trips_and_events} />
          <div className="fixed top-5 right-1 shadow-2 ba bg-white-70">
            <EventForm 
              onSubmit={ this.handleNewTripEvent }
              initialStartDate={ clicked ? selectedDate.startDate : '' }
            />
            <hr />
            <div className="pa2">
              <h2>Info:</h2>
              {
                clicked
                ? (
                    <div>
                      <p>{ `Age ${selectedDate.row}`}</p>
                      <p>{ `${moment.utc(selectedDate.startDate).format("MM/DD")}-${moment.utc(selectedDate.endDate).format("MM/DD/YY")}` }</p>
                    <ul>
                      {
                        selectedEvents.map((event, i) => <li key={i} className="list">{ `${event.name} ${event.emoji}` }</li>)
                      }
                    </ul>
                    </div>
                  )
                : (<p>Click a square to see details</p>)
              }
            </div>
          </div>
          <svg 
            width={svgWidth} 
            height={rows * (squareSize + squareMargin) + margin.top * 2}
            className="center"
          >
          <g transform={`translate(${margin.left},${margin.top})`}>
          <text 
            fontSize="2rem"
            textAnchor="end" alignmentBaseline="baseline" 
            fontVariant="small-caps"
            onClick={ this.handleBirthDateFormOpen }
          >
              🎂
          </text>
          <text fontSize="0.8rem"
                transform={`translate(${weekNewYear * (squareSize + squareMargin) + (squareSize * 0.5)}, -10)`}
                fontVariant="small-caps">
              January 1
          </text>
          <text fontSize="0.8rem"
                transform={`translate(${(weekNewYear + 26)%52 * (squareSize + squareMargin) + (squareSize * 0.5)}, -10)`}
                fontVariant="small-caps">

              July 1
          </text>
          {
            <LifeGrid 
              dates={ dates }
              events={ trips_and_events }
              config={ {squareSize, squareMargin, weekNewYear, paddingMinorHorizontal, rowHeight} }
              onClick={ this.onClick }
              onHover={ this.onHover }
              clicked={ clicked }
              hovered={ hovered }
              birthDate={ birthDate }
            /> 
          } 
          </g>
          </svg>
        </div>
      </div>
    );
  }
}



export default App;
