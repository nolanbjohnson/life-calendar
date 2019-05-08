import React, { useState, useEffect, useContext } from 'react'
import _ from 'lodash'

import { withFirebase } from '../components/Firebase'
import { AuthUserContext } from '../components/Session'
import LifeCalendar from '../components/LifeCalendar'
import EventList from '../components/EventList'
import EventForm from '../components/EventForm/'

const LifeGridScreen = props => {

	const authUser = useContext(AuthUserContext)

	const [events, setEvents] = useState([])
	const [showEvent, setShowEvent] = useState(null) 

	const handleEventHover = event => {
		console.log('** handleEventHover **')
		setShowEvent(event)
	}

	const handleEventHoverThrottled = _.throttle(handleEventHover, 1000, {leading: true})

	useEffect(() => {
		const eventsRef = props.firebase.userEvents(authUser.uid)

	    eventsRef.on('value', snapshot => {
	      	let eventsObj = snapshot.val();
	      
	      	if (eventsObj) {
				let events = Object.keys(eventsObj).map(key => ({
					...eventsObj[key],
					uid: key
				}))
			    setEvents(events)
	      	} else {
	      		setEvents([])
	      	}

	    });
	}, [])

	return (
		<div className="w-100 mw8 ph3 center">
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: "1rem"}}>
				<LifeCalendar 
					birthdate={ authUser.birthdate }
					events={ events }
					showEvent={ showEvent }
				/>
				<EventList
					events={ events }
					showEvent={ handleEventHoverThrottled }
				/>
			</div>
		</div>
	)
}

export default withFirebase(LifeGridScreen)