import React, { useState, useEffect } from 'react'
import AuthUserContext from './context'
import { withFirebase } from '../Firebase'

const withAuthentication = Component => {
	const withAuthentication = (props) => {
		const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('authUser')))

		useEffect(() => {
			const listener = props.firebase.onAuthUserListener(
				authUser => {
					localStorage.setItem('authUser', JSON.stringify(authUser))
					setAuthUser(authUser)
				},
				() => {
					localStorage.removeItem('authUser')
					setAuthUser(null)
				}
		    )
		    return listener
		}, []) // TODO I don't think the empty array is correct here - but don't know what state/props to include either

		console.log(authUser)
		
		return (
			<AuthUserContext.Provider value={ authUser }>
				<Component { ...props } /> 
			</AuthUserContext.Provider>
		)
	}

	return withFirebase(withAuthentication)
}

export default withAuthentication