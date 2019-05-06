import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'


const getCurrentIndex = (location, queryKey) => {
	const { search = '' } = location

	if(! search.includes(queryKey)) return

	const queryList = search.replace("?","").split('&')
	// console.log(queryList)

	const queries = queryList
						.reduce((queryObj, query) => {
									const [key, value] = query.split('=')
									queryObj[key] = value
									return queryObj
								}
								, {})

	return queries[queryKey]
}

const updateHistory = (history, key, value) => {
	const { push, location } = history
	const { pathname } = location

	push(`${pathname}?${key}=${value}`)
}


const FormSteps = props => {

	const queryKey = "step"

	const [currentIndex, setCurrentIndex] = useState(parseInt(getCurrentIndex(props.location, queryKey)) || (props.minIndex || 0))	

	const switchIndex = async index => {
		await setCurrentIndex(parseInt(index))
	}

	const incrementIndex = () => switchIndex(props.maxIndex !== undefined && currentIndex < props.maxIndex ? currentIndex + 1 : props.maxIndex)

	const decrementIndex = () => switchIndex(props.minIndex !== undefined && currentIndex > props.minIndex ? currentIndex - 1 : props.minIndex)

	useEffect(() => {
		const index = parseInt(getCurrentIndex(props.location, queryKey)) || (props.minIndex || 0)
		if(index !== currentIndex) setCurrentIndex(parseInt(index))
	}, [props.location])

	useEffect(() => {
		updateHistory(props.history, queryKey, currentIndex)
	}, [currentIndex])

	

	const renderProps = {
		currentIndex: currentIndex,
		switchIndex: switchIndex,
		incrementIndex: incrementIndex,
		decrementIndex: decrementIndex,
	}

	return props.render(renderProps)
}

export default withRouter(FormSteps)
