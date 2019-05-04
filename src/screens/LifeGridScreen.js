import React, { useState, useEffect, useContext } from 'react'

import { withFirebase } from '../components/Firebase'
import { AuthUserContext } from '../components/Session'
import LifeCalendar from '../components/LifeCalendar'
import EventList from '../components/EventList'
import EventForm from '../components/EventForm/'

const LifeGridScreen = props => {

	const authUser = useContext(AuthUserContext)

	const [events, setEvents] = useState([])

	useEffect(() => {
		const eventsRef = props.firebase.userEvents(authUser.uid)

	    eventsRef.on('value', snapshot => {
	      let eventsObj = snapshot.val();
	      
	      let events = Object.keys(eventsObj).map(key => ({
	      	...eventsObj[key],
	      	uid: key
	      }))
	      
	      setEvents(events)

	    });
	}, [])

	return (
		<div className="w-100 mw8 ph3 center">
			<div style={{ display: "grid", gridTemplateColumns: "minmax(30%,300px) 1fr 1fr", gridGap: "1rem"}}>
				<EventList 
					events={events}
				/>
				<LifeCalendar 
					birthDate={ new Date(authUser.birthDate) }
					events={events}
				/>
		    	<EventForm />
			</div>
		</div>
	)
}

export default withFirebase(LifeGridScreen)