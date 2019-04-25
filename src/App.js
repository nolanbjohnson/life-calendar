import React, { Component } from 'react';
import moment from 'moment'
import { range } from 'd3-array'

import { withFirebase } from './components/Firebase'
import { getWeekNumber } from './helpers/utils'
import EventsScreen from './screens/EventsScreen'
import Svg from './components/Svg'
import EventForm from './components/EventForm'
import BirthDateForm from './components/BirthDateForm'
import DatePicker from './components/DatePicker'
import LifeGrid from './components/LifeGrid'
import { backgroundColorRandom } from './helpers/utils'
import './App.css';

//scaffolding
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'


import { AuthUserContext } from './components/Session';
import Navigation from './Navigation'
import LifeGridScreen from './screens/LifeGridScreen'
import LifeEventsScreen from './screens/LifeEventsScreen'
import SignUp from './components/SignUp'
import SignIn from './components/SignIn'
import * as ROUTES from './helpers/routes'


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
    homes: [], // {startDate: new Date('1985-11-03'), endDate: new Date('1991-05-01'), name: 'Canada', location: {lat: 52.136172, lon: -106.729138}}
    hovered: '',
    clicked: '',
    selectStart: '',
    selectEnd: '',
    selecting: false,


    authUser: null,
  }

  componentDidMount() {

    this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null })
    })

    const eventsRef = this.props.firebase.events()
    eventsRef.on('value', snapshot => {
      let events = snapshot.val();
      let eventsState = [];
      for (let event in events) {
        eventsState.push({
          id: event,
          startDate: new Date(events[event].startDate),
          endDate: !isNaN(new Date(events[event].endDate)) ? new Date(events[event].endDate) : null,
          name: events[event].name,
          emoji: events[event].emoji,
          type: events[event].type,
        });
      }
      this.setState({
        trips_and_events: eventsState.filter(event=> event.type === 'event'),
        homes: eventsState.filter(event=> event.type === 'home').map(home => ({ ...home, color: backgroundColorRandom() })),
      })
    });
  }

  componentWillUnmount() {
    this.listener()
  }

  onClick = (dateID) => {
    this.setState(prevState => ({clicked: prevState.clicked === dateID ? '' : dateID, selectStart: '', selectEnd: '', selecting: false}))
  }

  onHover = (dateID) => {
    this.setState({hovered: dateID})
  }

  onSelectStart = (dateID) => {
    this.setState({selecting: true, selectStart: dateID, selectEnd: dateID, clicked: ''})
  }

  onSelectEnd = (dateID) => {
    this.setState({selectEnd: dateID, selecting: false})
  }

  selectTimeout = null

  onSelectDrag = (dateID) => {
    if (! this.state.selecting) return
    if (this.selectTimeout) clearTimeout(this.selectTimeout)
    const selectTimeout = setTimeout(this.setState({selectEnd: dateID}), 250)
  }

  unsetSelect = () => {
    this.setState({clicked: '', selectStart: '', selectEnd: '', selecting: false})
  }

  handleBirthDateFormOpen = () => {
    this.setState({ birthDateFormOpen: true })
  }

  handleBirthDateFormClose = () => {
    this.setState({ birthDateFormOpen: false })
  }

  handleNewTripEvent = (e) => {
    e.preventDefault()

    const eventsRef = this.props.firebase.events() // set ref to firebase db

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

    return (
      <AuthUserContext.Provider value={this.state.authUser}>
        <Router>
          <div className="min-vh-100">
            <header className="z-3 bg-white top-0 bb b--white relative"> {/*style={{ display: "grid", gridTemplateColumns: "1fr 10fr", justifyContent: "space-evenly" }}>*/}
              <Navigation/>
            </header>
            <div style={{flex: "1 1 0%"}}>
              <Switch>
                <Route path={ ROUTES.LANDING } exact component={ LifeGridScreen }/>
                <Route path={ ROUTES.EVENTS } exact component={ LifeEventsScreen }/>
                <Route path={ ROUTES.STAGES } exact render={() => <h2 style={{padding: "100px"}}>stages</h2>}/>
                <Route path={ ROUTES.EXPLORE } exact render={() => <h2 style={{padding: "100px"}}>explore</h2>}/>
                <Route path={ ROUTES.IMPOSSIBLE } exact render={() => <h2 style={{padding: "100px"}}>Impossible You!</h2>}/>
                <Route path={ ROUTES.SIGNUP } exact component={ SignUp }/>
                <Route path={ ROUTES.SIGNIN } exact component={ SignIn }/>
                <Route render={() => <h2 style={{padding: "100px"}}>No Match</h2>}/>
              </Switch>
            </div>
            <footer>
              <div class="w-100 mw8 ph3 center pt4 pb4">
                <p>© Some footer text</p>
              </div>
            </footer>
          </div>
        </Router>
      </AuthUserContext.Provider>

    )



    const { birthEpoch, birthYear, birthDate, trips_and_events, homes, hovered, clicked, birthDateFormOpen, datePickerEditMode, selectStart, selectEnd, selecting } = this.state
    const birthDay = new Date(parseInt(birthEpoch))
    const svgWidth = 1000
    const margin = { top: 50, right: 50, bottom: 50, left: 50 }
    const paddingMinorHorizontal = 3
    const squareMargin = 3
    const squaresPerRow = 52
    const squareSize = (svgWidth - (margin.left + margin.right) - (paddingMinorHorizontal * 3) - (squareMargin * squaresPerRow)) / squaresPerRow
    const rowHeight = squareSize + squareMargin
    const rows = 91
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

    const selectedDate = dates.find(date => date.id === (clicked || selectStart)) || {}
    const selectedEndDate = dates.find(date => date.id === selectEnd) || {}
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
          <p>This is my take on the post <a href="https://waitbutwhy.com/2014/05/life-weeks.html" target="_blank">Your Life in Weeks</a> by Tim Urban of Wait But Why. Thanks, Tim, for this hugely influential concept (though most people I share it with find it at least a bit macabre).</p>
        </div>
        <div className="Main">
          <EventsScreen events={trips_and_events} />
          <div className="fixed bottom-1 right-1 shadow-2 ba bg-white-70">
            <EventForm 
              onSubmit={ this.handleNewTripEvent }
              initialStartDate={ (clicked || (!selecting && selectStart)) ? selectedDate.startDate : '' }
              initialEndDate={ (!selecting && selectEnd) ? selectedEndDate.endDate : '' }
              rangeMode={ selecting || selectStart }
              unsetSelect={ this.unsetSelect }
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
                        selectedEvents.map((event, i) => <li key={i} className="list">{ `${event.emoji} ${event.name}` }</li>)
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
              className="unselectable"
              onClick={ this.handleBirthDateFormOpen }
            >
                🎂
            </text>
            <text fontSize="0.8rem"
                  transform={`translate(${weekNewYear * (squareSize + squareMargin) + (squareSize * 0.5)}, -10)`}
                  fontVariant="small-caps"
                  className="unselectable"
            >
                January 1
            </text>
            <text fontSize="0.8rem"
                  transform={`translate(${(weekNewYear + 26)%52 * (squareSize + squareMargin) + (squareSize * 0.5)}, -10)`}
                  fontVariant="small-caps"
                  className="unselectable"
            >

                July 1
            </text>
            {
              <LifeGrid 
                dates={ dates }
                events={ trips_and_events }
                homes={ homes }
                config={ {squareSize, squareMargin, weekNewYear, paddingMinorHorizontal, rowHeight} }
                onClick={ this.onClick }
                onHover={ this.onHover }
                onSelectStart={ this.onSelectStart }
                onSelectEnd={ this.onSelectEnd }
                onSelectDrag={ this.onSelectDrag }
                clicked={ clicked }
                hovered={ hovered }
                birthDate={ birthDate }
                selectStart={ selectStart }
                selectEnd={ selectEnd }
                selecting={ selecting }
              /> 
            } 
            </g>
          </svg>
        </div>
      </div>
    );
  }
}



export default withFirebase(App);
