import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import moment from 'moment'


import { withFirebase } from '../Firebase'
import { AuthUserContext } from '../Session'


const EventListItem = styled.li.attrs({
	className: 'list pl0 mb2 f6 lh-copy tj nowrap'
})``


const EventList = props => {

	const authUser = useContext(AuthUserContext)

	const [events, setEvents] = useState([])
	const [loading, setLoading] = useState(true)

	const removeItem = eventId => {
		props.firebase.event(eventId).remove()
	}

	useEffect(() => {
		const eventsRef = props.firebase.userEvents(authUser.uid)

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
	          hidden: events[event].hidden ? true : false
	        });
	      }
	      
	      setEvents(eventsState.filter(event=> event.type === 'event' && !event.hidden))
	      setLoading(false)
	    });
	}, [])
	return (
		<div>
			<h2>Events</h2>
			{
			loading
			? <div>Loading...</div>
			: <ul className="pa0 pb2 overflow-x-scroll">
				{
					events
						.sort((a, b) => a.startDate > b.startDate ? 1 : -1 )
						.map(event => {
						return <EventListItem key={event.id}><button type="button" onClick={ ()=> removeItem(event.id) }>✖</button>{ `${moment.utc(event.startDate).format("MMM DD, YYYY")}: ${event.name} ${event.emoji}` }</EventListItem>
					})
				}
			</ul>
			}
		</div>
	)
}

export default withFirebase(EventList)