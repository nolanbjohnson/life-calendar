import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import moment from 'moment'


import { withFirebase } from '../Firebase'


const EventListItem = styled.li.attrs({
	className: 'list pl0 mb2 f6 lh-copy tj nowrap'
})``


const EventList = props => {
	const [events, setEvents] = useState([])

	useEffect(() => {
		const eventsRef = props.firebase.events()
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
	    });
	}, [])
	return (
		<div>
			<h2>Events</h2>
			<ul className="pa0 pb2 overflow-x-scroll">
				{
					events
						.sort((a, b) => a.startDate > b.startDate ? 1 : -1 )
						.map(event => {
						return <EventListItem key={event.id}>{ `${moment.utc(event.startDate).format("MMM DD, YYYY")}: ${event.name} ${event.emoji}` }</EventListItem>
					})
				}
			</ul>
		</div>
	)
}

export default withFirebase(EventList)