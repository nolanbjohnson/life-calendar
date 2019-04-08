import React from 'react'

const Svg = ({ width, height, children }) => {
	return (
		<svg width={`${width}px`} height={`${height}px`}>{ children }</svg>
	)
}	

export default Svg