import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { AuthUserContext } from '../Session'
import { withFirebase } from '../Firebase'
import SignOut from '../SignOut'
import * as ROUTES from '../../helpers/routes'
import * as ROLES from '../../helpers/roles'

import Logo from '../../assets/Logo'

const Nav = styled.nav.attrs({
	className: 'w-100 mw8 ph3 center flex justify-between pv2 items-center'
})``

const SiteNavigation = styled.ul.attrs({
	className: 'inline-flex items-center list ph2 pv2 ma0'
})``

const UserNavigation = styled.ul.attrs({
	className: 'flex items-center list ph2 pv2 ma0'
})``

const NavItem = styled.li`
`

const NavLink = styled(Link).attrs(({ primary, tight }) => ({
	className: `nowrap tc no-underline hover-dark-blue ${tight ? "mr1 pa1" : "mr3 pa2"} ${primary ? "black f3 fw8" : "blue f6 fw6"}`
}))``

const Navigation = (props) => {
	const authUser = useContext(AuthUserContext)

	return (
		<Nav> {/*style={{ display: "flex", alignContent: "center", justifyContent: "center", width: "100%"}}> */}
			{ /* <Link to="/"><img src={lifegrid} alt="lifegrid" style={{height:"40px", margin: "1rem"}} /></Link> */}

			<SiteNavigation> {/* style={{ display: "flex", flexDirection: "row", justifyContent: "stretch", alignItems: "center", flexWrap: "nowrap", margin: 0, padding: 0, listStyle: "none"}}> */}
				<NavLink to={ROUTES.LANDING} tight={"true"}>
					<Logo />
				</NavLink>
				<NavItem>
					<NavLink to={ROUTES.LANDING} primary={"true"}>
						Life Grid		
					</NavLink>
				</NavItem>
				{ authUser && authUser.onboardingComplete

					? <React.Fragment>
						<NavItem>
							<NavLink to={ROUTES.EVENTS}>
								Life Events
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink to={ROUTES.STAGES}>
								Life Stages
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink to={ROUTES.EXPLORE}>
								Explore
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink to={ROUTES.IMPOSSIBLE}>
								Impossible You!
							</NavLink>
						</NavItem>
					</React.Fragment>
					: null
				}
			</SiteNavigation>
			<UserNavigation>
				{ 
				authUser
				? <NavItem>
					{ authUser.roles[ROLES.ADMIN] ? <strong>^</strong> : null}
					<strong>{`Hi, ${ authUser.username }`}</strong>
					<SignOut />
				  </NavItem>

				: <NavItem>
					<NavLink to={ROUTES.SIGNIN}>
						Sign In
					</NavLink>
				  </NavItem>
				}
			</UserNavigation>
		</Nav>
	)
}

export default withFirebase(Navigation)

