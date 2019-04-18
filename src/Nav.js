import React from 'react'
import { Link } from 'react-router-dom'

const Nav = (props) => {
	return (
		<ul style={{ display: "flex", flexDirection: "row", width: "50vw", justifyContent: "space-around", alignItems: "center", flexWrap: "nowrap", listStyle: "none"}}>
			<li>
				<Link to="/">
					Life Grid		
				</Link>
			</li>
			<li>
				<Link to="/events">
					Life Events
				</Link>
			</li>
			<li>
				<Link to="/stages">
					Life Stages
				</Link>
			</li>
			<li>
				<Link to="/explore">
					Explore
				</Link>
			</li>
			<li>
				<Link to="/impossibleyou">
					Impossible You!
				</Link>
			</li>
		</ul>
	)
}

export default Nav