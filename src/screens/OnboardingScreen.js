import React from 'react'

import Placeholder from '../components/Placeholder'
import OnboardingForm from '../components/OnboardingForm'
import { withAuthorization } from '../components/Session'

const Onboarding = (props) => (
	<div className="w-100 mw8 ph3 center">
	    <Placeholder title="Onboarding">
	    	<h2>Welcome</h2>
	    	<p>
	    		Welcome to your Life Calendar! Right now your calendar is blank - let's take care of that!
	    	</p>
	    	<p>
	    		Add some of your life's details to fill in your history.
	    	</p>
	    </Placeholder>
    	<Placeholder title="OnboardingForm">
    		<OnboardingForm />
    	</Placeholder>
	</div>
)

const condition = authUser => !!authUser

export default withAuthorization(condition)(Onboarding)