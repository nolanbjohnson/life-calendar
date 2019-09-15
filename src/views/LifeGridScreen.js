import React, { useState, useEffect, useContext } from 'react'
import _ from 'lodash'

import { withFirebase } from '../providers/Firebase'
import { AuthUserContext } from '../providers/Session'
import LifeCalendar from '../components/LifeCalendar'
import EventList from '../components/EventList'
import Modal from '../components/Modal'
import LayerForm from '../components/LayerForm'
import Dropdown, { Section as DropdownSection } from '../components/Dropdown'

const keyLocalStorageShowOptions = 'showOptions'
const keyLocalStorageLayerOptions = 'showLayers'

const LifeGridScreen = props => {

	const authUser = useContext(AuthUserContext)
	const optionNames = ["Show Events", "Show Now", "Show Future"]
	const [showEvents, showNow, showFuture] = optionNames

	const [events, setEvents] = useState([])
	const [showEvent, setShowEvent] = useState(null)
	const [loading, setLoading] = useState(true)
	const [layerNames, setLayerNames] = useState([])
	const [layerNamesSelected, setLayerNamesSelected] = useState([])
	const [optionNamesSelected, setOptionNamesSelected] = useState(JSON.parse(localStorage.getItem(keyLocalStorageShowOptions)) || optionNames)

	const [showModal, setShowModal] = useState(false)
	const [showDropDown, setShowDropDown] = useState(false)

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
					<Modal 
						isOpen = { showModal }
						handleClose = { () => setShowModal(false) }
					>
						<LayerForm 
							firebase={ props.firebase } 
							visible
						/>
					</Modal>
					<div className="self-end">
					<button 
						type="button"
						onClick={ () => setShowDropDown(true) }
						className="button-reset input-reset bg-transparent bw0 f3 focus"
					>
						...
					</button>
						<Dropdown 
							isOpen = {showDropDown}
							handleClose = { () => setShowDropDown(false) }
						>
							
							<DropdownSection
								header={ <React.Fragment>
											<span>Layers</span>
											<span className="w2 ml1" onClick= {() => { setShowModal(true); setShowDropDown(false) } } role="img" aria-label="edit">✏️</span> 
										</React.Fragment>}
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
						showFuture={ optionNamesSelected.indexOf(showFuture) !== -1 }
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