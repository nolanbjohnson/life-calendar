import React, { useContext } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import { withAuthentication, AuthUserContext } from '../Session'

import Navigation from '../Navigation'
import LifeGridScreen from '../../screens/LifeGridScreen'
import LifeEventsScreen from '../../screens/LifeEventsScreen'
import OnboardingScreen from '../../screens/OnboardingScreen'
import PublicHomePage from '../../screens/PublicHomePage'
import SignUp from '../SignUp'
import SignIn from '../SignIn'

import * as ROUTES from '../../helpers/routes'

const App = props => {

  const authUser = useContext(AuthUserContext)
  
	return (
  		<Router>
         <div className="min-vh-100">
           <header className="z-3 bg-white top-0 bb b--white relative"> {/*style={{ display: "grid", gridTemplateColumns: "1fr 10fr", justifyContent: "space-evenly" }}>*/}
             <Navigation/>
           </header>
           <div style={{flex: "1 1 0%"}}>
             <Switch>

               <Route path={ ROUTES.HOME } exact render={() => (
                  authUser
                  ? authUser.onboardingCompleted
                      ? <LifeGridScreen />
                      : <Redirect to={ ROUTES.ONBOARDING }/>
                  : <PublicHomePage />
                )} 
               />

               <Route path={ ROUTES.ONBOARDING } exact render={() => (
                  authUser
                  ? !authUser.onboardingCompleted
                      ? <OnboardingScreen />
                      : <Redirect to={ ROUTES.HOME }/>
                  : <PublicHomePage />
                )} 
               />

               <Route path={ ROUTES.EVENTS } exact component={ LifeEventsScreen }/>

               <Route path={ ROUTES.EXPLORE } exact render={() => (
                  <div className="w-100 mw8 ph3 center">
                    <h2>Explore</h2>
                    <p>Here you can search events and layers you've created and see how your life has changed over time</p>
                  </div>
                )}
               />
               
               <Route path={ ROUTES.IMPOSSIBLE } exact render={() => (
                  <div className="w-100 mw8 ph3 center">
                    <h2>Impossible You!</h2>
                    <p>The life calendar is great for documenting your past, but you can also plan for your future!</p>
                    <p>Create some goals for your life and don't worry if they at first feel impossible - you can do amazing things one step at a time.</p>
                  </div>
                )}
               />

               <Route path={ ROUTES.SIGNUP } exact component={ SignUp }/>
               
               <Route path={ ROUTES.SIGNIN } exact component={ SignIn }/>
               
               <Route render={() => <h2 style={{padding: "100px"}}>No Match</h2>}/>
             
             </Switch>
           </div>
           <footer>
             <div className="w-100 mw8 ph3 center pt4 pb4">
               <p>© Some footer text</p>
             </div>
           </footer>
         </div>
       </Router>
	)
}

export default withAuthentication(App)