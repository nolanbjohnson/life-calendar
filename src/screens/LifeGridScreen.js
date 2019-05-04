import React, { useState, useEffect, useContext } from 'react'

import { withFirebase } from '../components/Firebase'
import { AuthUserContext } from '../components/Session'
import LifeCalendar from '../components/LifeCalendar'
import EventList from '../components/EventList'
import EventForm from '../components/EventForm/'

export const ShowEventContext = React.createContext('')

const LifeGridScreen = props => {

	const authUser = useContext(AuthUserContext)


	const [events, setEvents] = useState([])
	const [showEvent, setShowEvent] = useState(null) 

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
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr minmax(30%,300px)", gridGap: "1rem"}}>
				<ShowEventContext.Provider value={showEvent}>
					<LifeCalendar 
						birthDate={ new Date(authUser.birthDate) }
						events={events}
						highlightEvent={showEvent}
					/>
			    	<EventForm />
					<EventList 
						showEvent={(event) => setShowEvent(event)}
					/>
				</ShowEventContext.Provider>
			</div>
		</div>
	)
}

export default withFirebase(LifeGridScreen)