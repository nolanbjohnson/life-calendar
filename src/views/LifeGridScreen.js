import React, { useState, useEffect, useContext } from 'react'
import _ from 'lodash'

import { withFirebase } from '../providers/Firebase'
import { AuthUserContext } from '../providers/Session'
import LifeCalendar from '../components/LifeCalendar'
import EventList from '../components/EventList'
import EventForm from '../components/EventForm/'
import Dropdown from '../components/Dropdown'

const LifeGridScreen = props => {

	const authUser = useContext(AuthUserContext)

	const [events, setEvents] = useState([])
	const [showEvent, setShowEvent] = useState(null)
	const [loading, setLoading] = useState(true)
	const [layerNames, setLayerNames] = useState([])
	const [layerNamesSelected, setLayerNamesSelected] = useState([])

	const handleEventHover = event => {
		console.log('** handleEventHover **')
		setShowEvent(event)
	}

	const extractLayerNames = events => {
		const layers = events.reduce((names, event) => {
			    	if (event.layerName) {
			    		names[event.layerName] = ''
			    	}
			    	return names
			    }, {})

		return Object.keys(layers)
	}

	const toggleLayerSelected = layer => {
		const index = layerNamesSelected.indexOf(layer)

		if (index === -1) {
			setLayerNamesSelected([...layerNamesSelected, layer])
		}
		else {
			setLayerNamesSelected([
				...layerNamesSelected.slice(0, index),
				...layerNamesSelected.slice(index + 1)
			])
		}
	}

	const handleEventHoverThrottled = _.throttle(handleEventHover, 1000, {leading: true})

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
			    setLayerNames(extractLayerNames(events))
	      	} else {
	      		setEvents([])
	      		setLayerNames([])
	      	}
			setLoading(false)
	    }, err => {
	    	console.log(err)
	    	setLoading(false)
	    });

	}, [])

	useEffect(() => {
		// if layerNames changes, arbitrarily choose the first layer to show
		setLayerNamesSelected(layerNames.slice(0, 1))
	}, [layerNames])

	return (
		<div className="w-100 mw8 ph3 center">
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: "1rem"}}>
				<div className="center flex flex-column">
					<div className="self-end">
						<Dropdown 
							buttonText="..."
							header="Layers"
							items={ layerNames }
							selectedItems={ layerNamesSelected }
							toggleSelection={ toggleLayerSelected }
						/>
					</div>
					<LifeCalendar 
						birthdate={ authUser.birthdate }
						events={ events }
						showEvent={ showEvent }
						showLayers={ layerNamesSelected }
					/>
				</div>
				<EventList
					events={ events }
					loading={ loading }
					showEvent={ handleEventHoverThrottled }
				/>
			</div>
		</div>
	)
}

export default withFirebase(LifeGridScreen)