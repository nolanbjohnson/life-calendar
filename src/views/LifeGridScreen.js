import React, { useState, useEffect, useContext } from 'react'
import _ from 'lodash'

import { withFirebase } from '../providers/Firebase'
import { AuthUserContext } from '../providers/Session'
import LifeCalendar from '../components/LifeCalendar'
import EventList from '../components/EventList'
import Dropdown, { Section as DropdownSection } from '../components/Dropdown'

const keyLocalStorageShowOptions = 'showOptions'
const keyLocalStorageLayerOptions = 'showLayers'


const LifeGridScreen = props => {

	const authUser = useContext(AuthUserContext)
	const optionNames = ["Show Events", "Show Now"]
	const [showEvents, showNow] = optionNames

	const [events, setEvents] = useState([])
	const [showEvent, setShowEvent] = useState(null)
	const [loading, setLoading] = useState(true)
	const [layerNames, setLayerNames] = useState([])
	const [layerNamesSelected, setLayerNamesSelected] = useState([])
	const [optionNamesSelected, setOptionNamesSelected] = useState(JSON.parse(localStorage.getItem(keyLocalStorageShowOptions)) || optionNames)


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

	const toggleSelected = (name, state, setState) => {
		const index = state.indexOf(name)

		if (index === -1) {
			setState([...state, name])
		}
		else {
			setState([
				...state.slice(0, index),
				...state.slice(index + 1)
			])
		}
	}

	useEffect(() => {
		// if layerNames changes, arbitrarily choose the first layer to show
		setLayerNamesSelected(JSON.parse(localStorage.getItem(keyLocalStorageLayerOptions)) || layerNames.slice(0, 1))
	}, [layerNames])

	useEffect(() => {
		localStorage.setItem(keyLocalStorageShowOptions, JSON.stringify(optionNamesSelected))
	}, [optionNamesSelected])

	useEffect(() => {
		if (loading) return // this was getting set to [] before layers had a chance to Load, causing the default to show no layers
		localStorage.setItem(keyLocalStorageLayerOptions, JSON.stringify(layerNamesSelected))
	}, [layerNamesSelected])

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

	return (
		<div className="w-100 mw8 ph3 center">
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: "1rem"}}>
				<div className="relative center flex flex-column">
					<div className="self-end">
						<Dropdown 
							buttonText="..."
						>
							<DropdownSection
								header="Layers"
								items={ layerNames }
								selectedItems={ layerNamesSelected }
								toggleSelection={ name => toggleSelected(name, layerNamesSelected, setLayerNamesSelected) }
							/>
							<DropdownSection
								header="Events"
								items={ optionNames }
								selectedItems={ optionNamesSelected }
								toggleSelection={ name => toggleSelected(name, optionNamesSelected, setOptionNamesSelected) }
							/>
						</Dropdown>
					</div>
					<LifeCalendar 
						birthdate={ authUser.birthdate }
						events={ events }
						showEvent={ showEvent }
						showLayers={ layerNamesSelected }
						highlightEvents={ optionNamesSelected.indexOf(showEvents) !== -1 }
						highlightNow={ optionNamesSelected.indexOf(showNow) !== -1 }
					/>
					<div
						className="absolute bottom-2 w-100 bg--white h5 unselectable"
						style={{backgroundImage: "-webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0)), to(rgba(255, 255, 255, 1)))",
								pointerEvents: "none"}}
					>
					&nbsp;
					</div>
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