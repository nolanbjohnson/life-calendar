import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import moment from 'moment'


import { withFirebase } from '../Firebase'
import { AuthUserContext } from '../Session'
import DatePicker from '../DatePicker/'


const EventListItemTag = styled.li.attrs({
	className: 'list pl0 mb2 f6 lh-copy tj nowrap hide-child'
})``

const Button = styled.button.attrs(({ showOnHover }) => ({
	className: `button-reset bw0 f5 grow-large pointer bg-transparent ${showOnHover ? 'child' : ''}`
}))``

const EventListItem = ({ event, ...props }) => {
	const [dateEditMode, setDateEditMode] = useState(false)

	// TODO date picker doesn't send an updated to firebase - it just looks cool
	return (
		<EventListItemTag>
			{ props.children }
			<DatePicker
	          initialDate={ event.startDate.toISOString().replace(/T.*/,"") }
	          format="MMM DD, YYYY"
	          editMode={ dateEditMode }
	          closeForm={ () => setDateEditMode(false) }
	          openForm={ () => setDateEditMode(true) }
	          onSubmit={ (e) => console.log(e.target.value) }
	          inline
	        />
	        <span>
			{ `: ${event.name} ${event.emoji}` }
			</span>
		</EventListItemTag>
	)
}


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
						return (
							<EventListItem event={event} key={event.id}>
								<Button 
									type="button" 
									title="delete"
									showOnHover 
									onClick={ ()=> removeItem(event.id) }
								>
									✖
								</Button>
							</EventListItem>
						)
					})
				}
			</ul>
			}
		</div>
	)
}

export default withFirebase(EventList)