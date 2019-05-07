import React, { useState, useEffect, useContext } from 'react'

import { withAuthorization, AuthUserContext } from '../components/Session'
import OnboardingForm from '../components/OnboardingForm'
import LifeCalendar from '../components/LifeCalendar'

const Onboarding = (props) => {
	const authUser = useContext(AuthUserContext)

	const [events, setEvents] = useState([])

	// TODO repeated this entire thing from LifeGridScreen - should move up in the tree
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

	    return () => eventsRef.off()
	}, [authUser])

	return (
		<div className="w-100 mw8 ph3 center">
			<h2>Welcome</h2>
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: "1rem"}}>
		    	<div>
			    	<p>
			    		Welcome to your Life Calendar! Right now your calendar is blank - let's take care of that!
			    	</p>
			    	<p>
			    		Add some of your life's details to fill in your history.
			    	</p>
		    		<OnboardingForm />
		    	</div>
		    	<div className="center">
		    		<LifeCalendar 
		    			{ ...(authUser.birthdate && { birthdate: new Date(authUser.birthdate) }) }
		    			events={events}
		    		/>
		    	</div>
		    </div>
		</div>
	)
}

const condition = authUser => !!authUser

export default withAuthorization(condition)(Onboarding)