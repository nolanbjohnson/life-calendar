import React, { useContext } from 'react'

import { AuthUserContext } from '../components/Session'
import Placeholder from '../components/Placeholder'
import LifeCalendar from '../components/LifeCalendar'
import EventList from '../components/EventList'
import EventForm from '../components/EventForm/'


const events = { 
	trips_and_events: [
      {startDate: new Date('1985-11-03'), endDate: new Date('1985-11-03'), name: 'You were born!', emoji: '🎂'},
      {startDate: new Date('1991-05-01'), endDate: new Date('1991-05-01'), name: 'Moved to Arizona', emoji: '🌵'},
      {startDate: new Date('2014-08-01'), endDate: new Date('2014-08-01'), name: 'Move SDM to NYC', emoji: '🗽'},
      {startDate: new Date('2015-04-01'), endDate: new Date('2015-04-01'), name: 'Moved to NYC', emoji: '🗽'},
      {startDate: new Date('2011-02-05'), endDate: new Date('2011-02-11'), name: 'Moved to Madison, WI', emoji: '🧀'},
    ]
}

const LifeGridScreen = props => {
	
	const authUser = useContext(AuthUserContext)

	return (
		<div className="w-100 mw8 ph3 center">
			{ authUser
			? 	<div style={{ display: "grid", gridTemplateColumns: "minmax(30%,300px) 1fr 1fr", gridGap: "1rem"}}>
					<EventList />
					<LifeCalendar 
						birthDate={ new Date(authUser.birthDate) }
					/>
			    	<EventForm />
				</div>
		    :  	<React.Fragment>
			    	<Placeholder title="Intro">
				    	<h2>Life Calendar</h2>
				    	<p>
				    		This is my take on the post <a href="https://waitbutwhy.com/2014/05/life-weeks.html" target="_blank">Your Life in Weeks</a> by 
				    		Tim Urban of Wait But Why. If you haven't read it yet, take the next 10 minutes and do yourself a huge favor. Your future self 
				    		will thank you! 
				    	</p>
				    	<p>
				    		Also, they sell a <a href="https://store.waitbutwhy.com/collections/life-calendars" target="_blank">physical "Life Calendar"</a> that you can fill in however you want <strong>IRL</strong>. I own one and it will continue 
				    		to exist long after this website disappears, after the whole internet is gone, and after our cat-alien overlords enslave us all 
				    		into a life of pet-servitude. So go <a href="https://waitbutwhy.com/2014/05/life-weeks.html" target="_blank">check it out!</a>
				    	</p>
				    	<p>
				    		Okay, you're back? Great! Let's get started.
				    	</p>

				    	<h3>What's a life calendar?</h3>
				    	<p>
				    		It helps you make sense of this crazy precious gift we've all been given, and hopefully help you make better choices about 
				    		how to use it.
				    	</p>

				    	<h3>But how...? 🤔</h3>
				    	<p>
				    		Life is both long and far too short; you need perspective. To quote Tim Urban in <a href="https://waitbutwhy.com/2014/05/life-weeks.html" target="_blank">the article you just read</a> (right?!)

				    		<blockquote>One of the ways we end up in NeitherLand* is by not thinking about things hard enough—so one of the most critical skills is continual reflection and self-awareness.</blockquote>
				    		
				    		The Life Calendar is a tool that helps you do that more easily and actually enjoy doing it.

				    	</p>
				    	<small>*Neitherland is where you're neither enjoying the now nor setting yourself up to enjoy the future more.</small>

				    </Placeholder>
			    	<Placeholder title="Container">
			    		<div style={{ display: "grid", gridTemplateColumns: "3fr 1fr"}}>
					    	<Placeholder title="LifeGrid" props={ events }>
					    	</Placeholder>
					    	<Placeholder title="EventForm">
					    		<form style={{ display: "grid", direction: "column", rowGap: "0.5rem" }}>
					    			<label htmlFor="name">Name</label>
					    			<input name="name" type="text"/>
					    			<label htmlFor="date">Date</label>
					    			<input name="date" type="date"/>
					    			<label htmlFor="description">Description</label>
					    			<textarea name="description">
					    			</textarea>
					    		</form>
					    	</Placeholder>
				    	</div>
					</Placeholder>
				</React.Fragment>
			}
		</div>
	)
}

export default LifeGridScreen