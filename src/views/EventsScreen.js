import React from 'react'
import moment from 'moment'

const EventsScreen = ({ events }) => {
	return (
		<div>
			<h2>Events</h2>
			<ul>
				{
					events
						.sort((a, b) => a.startDate > b.startDate ? 1 : -1 )
						.map(event => {
						return <li key={event.id} className="list">{ `${moment.utc(event.startDate).format("MMM DD, YYYY")}: ${event.name} ${event.emoji}` }</li>
					})
				}
			</ul>
		</div>
	)
}

export default EventsScreen