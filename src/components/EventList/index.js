import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'

import { withFirebase } from '../../providers/Firebase'
import { AuthUserContext } from '../../providers/Session'
import DatePicker from '../DatePicker/'
import TextEditor from '../TextEditor'
import EventForm from '../EventForm'


const EventListItemTag = styled.li.attrs({
	className: 'list pl0 pb2 f6 lh-copy tj nowrap hide-child'
})``

const Button = styled.button.attrs(({ showOnHover }) => ({
	className: `button-reset bw0 f5 grow-large pointer bg-transparent ${showOnHover ? 'child' : ''}`
}))``

const EventListItem = ({ event, onHover, handleDateUpdate, handleNameUpdate, ...props }) => {
	const [dateEditMode, setDateEditMode] = useState(false)
	const [textEditMode, setTextEditMode] = useState(false)

	const openDateEditor = () => {
		setDateEditMode(true)
		setTextEditMode(false)
	}

	const openTextEditor = () => {
		setDateEditMode(false)
		setTextEditMode(true)
	}
	
	// TODO date picker doesn't send an updated to firebase - it just looks cool
	return (
		<EventListItemTag onMouseOver={() => onHover(event)} onMouseOut={() => onHover('')}>
			{ props.children }
			<DatePicker
				initialDate={ new Date(event.startDate).toISOString().replace(/T.*/,"") }
				format="MMM DD, YYYY"
				editMode={ dateEditMode }
				closeForm={ () => setDateEditMode(false) }
				openForm={ openDateEditor }
				onSubmit={ handleDateUpdate }
				inline
	    />{': '}
			<TextEditor
				initialText={ event.name }
				editMode={ textEditMode }
				closeForm={ () => setTextEditMode(false) }
				openForm={ openTextEditor }
				onSubmit={ handleNameUpdate }
				inline
			/>
	    <span> { event.emoji } </span>
		</EventListItemTag>
	)
}


const EventList = props => {

	const authUser = useContext(AuthUserContext)
	const [events, setEvents] = useState([])
	const [showForm, setShowForm] = useState(false)

	const removeItem = eventId => {
		props.firebase.event(eventId).remove()
	}

	const updateItem = (eventId, fields) => {
		props.firebase.event(eventId).update(
			{
				...fields, 
				 updatedAt: props.firebase.serverValue.TIMESTAMP
			}, error => {
				if (error) {
					console.log(error)
				} else {
					console.log("Successful!")
				}
		})
	}

	useEffect(() => {
		if (props.events.length === 0) return
		setEvents(props.events.filter(event=> event.type === 'event' && !event.hidden))
	}, [props.events])

	// useEffect(() => {
	// 	const eventsRef = props.firebase.userEvents(authUser.uid)

	//     eventsRef.on('value', snapshot => {
	//       let events = snapshot.val();
	//       let eventsState = [];
	//       for (let event in events) {
	//         eventsState.push({
	//           id: event,
	//           startDate: new Date(events[event].startDate),
	//           endDate: !isNaN(new Date(events[event].endDate)) ? new Date(events[event].endDate) : null,
	//           name: events[event].name,
	//           emoji: events[event].emoji,
	//           type: events[event].type,
	//           hidden: events[event].hidden ? true : false
	//         });
	//       }
	      
	//       setEvents(eventsState.filter(event=> event.type === 'event' && !event.hidden))
	//       setLoading(false)
	//     });

	//     return () => eventsRef.off()
	// }, [])
	const eventListItems = events.sort((a, b) => a.startDate > b.startDate ? 1 : -1 )
								.map(event => (
									<EventListItem 
										id={event.uid} 
										key={event.uid} 
										event={event} 
										onHover={props.showEvent} 
										handleDateUpdate={ (startDate) => updateItem(event.uid, {startDate}) }
										handleNameUpdate={ (name) => updateItem(event.uid, {name}) }
									>
										<Button 
											type="button" 
											title="delete"
											showOnHover 
											onClick={ ()=> removeItem(event.uid) }
										>
											✖
										</Button>
									</EventListItem>
								))
	console.log('eventlist events', events)
	return (
		<div>
			<h2>
				Events
			<button type="button" title="add a new event" className={`w2 h2 b pv2 mh1 tc mh1 input-reset bn bg-transparent f5 pointer grow`} onClick={ () => setShowForm(!showForm) }><span role="img" aria-label="add a new event">{ showForm ? "➖" : "➕" }</span></button>
			{ showForm
				? <EventForm />
				: null
			}
			</h2>
			{
			props.loading
			? <div>Loading...</div>
			: <ul className="pa0 pb2 overflow-x-scroll">
				{	
					events.length>0
					? eventListItems
					: <li><em>No events yet</em></li>
				}
			</ul>
			}
		</div>
	)
}

export default withFirebase(EventList)