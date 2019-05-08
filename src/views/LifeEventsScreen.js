import React from 'react'
import { Placeholder } from '../components/Utilities'

const homes = [
		{startDate: new Date('1985-11-03'), endDate: new Date('1991-05-01'), name: 'Canada', location: {lat: 52.136172, lon: -106.729138}},
		{startDate: new Date('1991-05-01'), endDate: new Date('2011-02-01'), name: 'Arizona', location: {lat: 33.4484, lon: -112.0740}},	
	]
const school = [
	    {startDate: new Date('1990-08-01'), endDate: new Date('1995-05-30'), name: "Elementary"},
	    {startDate: new Date('1990-08-01'), endDate: new Date('1995-05-30'), name: "Middle"},
	]

const events = [
		{startDate: new Date('1985-11-03'), endDate: new Date('1985-11-03'), name: 'You were born!', emoji: '🎂'},
		{startDate: new Date('1991-05-01'), endDate: new Date('1991-05-01'), name: 'Moved to Arizona', emoji: '🌵'},
		{startDate: new Date('2014-08-01'), endDate: new Date('2014-08-01'), name: 'Move SDM to NYC', emoji: '🗽'},
		{startDate: new Date('2015-04-01'), endDate: new Date('2015-04-01'), name: 'Moved to NYC', emoji: '🗽'},
		{startDate: new Date('2011-02-05'), endDate: new Date('2011-02-11'), name: 'Moved to Madison, WI', emoji: '🧀'},
    ]


const LifeEventsScreen = (props) => {
	return (
		<Placeholder title="Life Events">
			<p className="f1 measure lh-title"><span role="img" aria-label="under construction">👷</span> This page is under construction <span role="img" aria-label="under construction">🚧</span></p>
			<p>In the future, you'll be able to view and manage all your life events here!</p>
			<div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", height: "65vh"}}>
				<Placeholder title="Homes" props={homes} addStyle={{maxWidth: "30vw"}}>
				</Placeholder>
				<Placeholder title="Work and School" props={school} addStyle={{maxWidth: "30vw"}}>
				</Placeholder>
				<Placeholder title="Events" props={events} addStyle={{maxWidth: "30vw"}}>
				</Placeholder>
			</div>
		</Placeholder>
	)
}

export default LifeEventsScreen