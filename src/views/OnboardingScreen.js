import React, { useState, useEffect, useMemo, useContext } from 'react'

import { withAuthorization, AuthUserContext } from '../providers/Session'
import OnboardingForm from '../components/OnboardingForm'
import LifeCalendar from '../components/LifeCalendar'

const Onboarding = (props) => {
	const authUser = useContext(AuthUserContext)

	const [events, setEvents] = useState([])

	const extractLayerNames = events => {
		const layers = events.reduce((names, event) => {
			    	if (event.layerName) {
			    		names[event.layerName] = ''
			    	}
			    	return names
			    }, {})

		return Object.keys(layers)
	}
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

	const layers = useMemo(() => {
		return extractLayerNames(events)
	}, [events])

	console.log('layers: ', layers)
	console.log('events: ', events)

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
		    		<OnboardingForm 
						events={ events }
						layers={ layers }
					/>
		    	</div>
		    	<div className="center">
		    		<LifeCalendar 
		    			{ ...(authUser.birthdate && { birthdate: authUser.birthdate }) }
						events={ events }
						showLayers={ layers }
		    		/>
		    	</div>
		    </div>
		</div>
	)
}

const condition = authUser => !!authUser

export default withAuthorization(condition)(Onboarding)