import React from 'react'

const SVG = (props) => (
	<svg role="img" viewBox="0 0 30 30" aria-label="LifeGrid" style={{styleheight: "30px", width: "30px"}}>
		<g>
		    <rect x="1.5" y="1.5" rx="1" ry="1" width="5.5" height="5.5" fill="rgba(100,237,237,1)" stroke="none" strokeWidth="0.5px"></rect>
		    <rect x="8.5" y="1.5" rx="1" ry="1" width="5.5" height="5.5" fill="rgba(100,237,237,1)" stroke="none" strokeWidth="0.5px"></rect>
		    <rect x="15.5" y="1.5" rx="1" ry="1" width="5.5" height="5.5" fill="rgba(100,237,237,1)" stroke="none" strokeWidth="0.5px"></rect>
		    <rect x="22.5" y="1.5" rx="1" ry="1" width="5.5" height="5.5" fill="rgba(50,100,237,1)" stroke="none" strokeWidth="0.5px"></rect>
		    <rect x="1.5" y="8.5" rx="1" ry="1" width="5.5" height="5.5" fill="rgba(50,100,237,1)" stroke="none" strokeWidth="0.5px"></rect>
		    <rect x="8.5" y="8.5" rx="1" ry="1" width="5.5" height="5.5" fill="rgba(50,100,237,1)" stroke="none" strokeWidth="0.5px"></rect>
		    <rect x="15.5" y="8.5" rx="1" ry="1" width="5.5" height="5.5" fill="rgba(50,100,237,1)" stroke="none" strokeWidth="0.5px"></rect>
		    <rect x="22.5" y="8.5" rx="1" ry="1" width="5.5" height="5.5" fill="rgba(205,92,92,1)" stroke="none" strokeWidth="0.5px"></rect>
		    <rect x="1.5" y="15.5" rx="1" ry="1" width="5.5" height="5.5" fill="rgba(205,92,92,1)" stroke="none" strokeWidth="0.5px"></rect>
		    <rect x="8.5" y="15.5" rx="1" ry="1" width="5.5" height="5.5" fill="rgba(205,92,92,1)" stroke="none" strokeWidth="0.5px"></rect>
		    <rect x="15.5" y="15.5" rx="1" ry="1" width="5.5" height="5.5" fill="white" stroke="none" strokeWidth="0.5px"></rect>
		    <rect x="22.5" y="15.5" rx="1" ry="1" width="5.5" height="5.5" fill="white" stroke="none" strokeWidth="0.5px"></rect>
		    <rect x="1.5" y="22.5" rx="1" ry="1" width="5.5" height="5.5" fill="white" stroke="none" strokeWidth="0.5px"></rect>
		    <rect x="8.5" y="22.5" rx="1" ry="1" width="5.5" height="5.5" fill="white" stroke="none" strokeWidth="0.5px"></rect>
		    <rect x="15.5" y="22.5" rx="1" ry="1" width="5.5" height="5.5" fill="white" stroke="none" strokeWidth="0.5px"></rect>
		    <rect x="22.5" y="22.5" rx="1" ry="1" width="5.5" height="5.5" fill="white" stroke="none" strokeWidth="0.5px"></rect>
		</g>
	</svg>
)

export default SVG


// <svg role="img" viewBox="0 0 30 30" aria-label="LifeGrid" style={{height: "30px", width: "30px"}}>
// 	{ 
// 		Array(4*4).fill(0).map((square, index) => {
// 			return (<rect 
// 						x={index % 4 * 7 + 1.5} 
// 						y={Math.floor(index / 4) * 7 + 1.5} 
// 						rx={1}
//   						ry={1}
// 						width={5.5} 
// 						height={5.5} 
// 						fill={
// 							(index < 3) ? "rgba(100,237,237,0.6)"
// 							: (index < 7) ? "rgba(50,100,237,0.6)"
// 							: (index < 10) ? "rgba(205,92,92,0.6)"
// 							: "white"
// 						}
// 						stroke="grey"
// 						strokeWidth="0.5px"
// 					/>)
// 		})
// 	}
// </svg>