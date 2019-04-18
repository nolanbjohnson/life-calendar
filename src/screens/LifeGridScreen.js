import React from 'react'
import Placeholder from '../components/Placeholder'


const events = { 
	trips_and_events: [
      {startDate: new Date('1985-11-03'), endDate: new Date('1985-11-03'), name: 'You were born!', emoji: '🎂'},
      {startDate: new Date('1991-05-01'), endDate: new Date('1991-05-01'), name: 'Moved to Arizona', emoji: '🌵'},
      {startDate: new Date('2014-08-01'), endDate: new Date('2014-08-01'), name: 'Move SDM to NYC', emoji: '🗽'},
      {startDate: new Date('2015-04-01'), endDate: new Date('2015-04-01'), name: 'Moved to NYC', emoji: '🗽'},
      {startDate: new Date('2011-02-05'), endDate: new Date('2011-02-11'), name: 'Moved to Madison, WI', emoji: '🧀'},
    ]
}

const LifeGridScreen = (props) => (
    <React.Fragment>
	    <Placeholder title="Intro">
	    	<h2>Life Calendar</h2>
	    	<p>Some introductory text</p>
	    	<p>This is my take on the post <a href="https://waitbutwhy.com/2014/05/life-weeks.html" target="_blank">Your Life in Weeks</a> by Tim Urban of Wait But Why. Thanks, Tim, for this hugely influential concept (though most people I share it with find it at least a bit macabre).</p>
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
)

export default LifeGridScreen