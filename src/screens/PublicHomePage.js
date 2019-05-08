import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import LifeCalendarIRL from '../assets/irl-life-calendar.jpg'
import LifeCalendarWBW from '../assets/wbw-life-calendar.png'
import LifeCalendarWBWFilled from '../assets/wbw-life-calendar-filled.png'
import LifeCalendarWBWGIF from '../assets/wbw-life-calendar.gif'

import LifeCalendar from '../components/LifeCalendar'
import { ImageCarousel } from '../components/Transitions'
import * as ROUTES from '../helpers/routes'

const Anchor = styled.a.attrs({
	className: "link dim blue"
})``

const PublicHomePage = props => (
	<div className="w-100 mw8 ph3 center">
    	<div className="flex flex-row flex-wrap lh-copy mt5">
    		<div className="measure pa2">
		    	<h2>Rethinking your life, one week at a time</h2>
		    	<p>
		    		This is my take on the post <Anchor href="https://waitbutwhy.com/2014/05/life-weeks.html" target="_blank" rel="noopener noreferrer">Your Life in Weeks</Anchor> by 
		    		Tim Urban of Wait But Why. If you haven't read it yet, take the next 10 minutes and do yourself a huge favor. Your future self 
		    		will thank you! 
		    	</p>
		    	<p>
		    		They also sell a <Anchor href="https://store.waitbutwhy.com/collections/life-calendars" target="_blank" rel="noopener noreferrer">physical "Life Calendar"</Anchor> that you can fill in however you want <strong>IRL</strong>. I own one and it will continue 
		    		to exist long after this website disappears, after the whole internet is gone, and after our cat-alien overlords enslave us all 
		    		into a life of pet-servitude. So go <Anchor href="https://waitbutwhy.com/2014/05/life-weeks.html" target="_blank" rel="noopener noreferrer">check it out!</Anchor>
		    	</p>
		    	<p>
		    		Okay, you're back? Great! Let's get started.
		    	</p>
		   	</div>
		   	<div className="flex">
		   		{ 
		   		// <ImageCarousel imageSrc={LifeCalendarWBWFilled} imageHeight={250} />
		   		}
		   		<img height={300} className="ma2 mt4" alt="life calendar" src={LifeCalendarWBWGIF} />
		   		<div className="ma1 mt4 flex flex-column">
		   			<small className="ma0 tc b navy">My IRL Life Calendar</small>
		   			<img height={250} className="ma2 mt3" alt="life calendar" src={LifeCalendarIRL} />
		   		</div>
		   	</div>
		   	<div className="w-100 flex justify-center ba b--near-white">
		   		<Link to={ROUTES.SIGNUP} className="link">
		   			<button type="button" className="db b ph5 pv2 mv3 input-reset br2 bn bg-blue white f4 pointer grow">
		   				Sign Up Now
		   			</button>
		   		</Link>
		   	</div>
		   	<LifeCalendar />
	    	<div className="fl measure">
		    	<h3>What's a life calendar?</h3>
		    	<p>
		    		It helps you make sense of this crazy, precious gift we've all been given, and hopefully help you make better choices about 
		    		how to use it.
		    	</p>
		    	<h3>But how...? <span role="img" aria-label="thinking face">🤔</span></h3>
		    	<p>
		    		Life is both long and far too short - to do it well, you need perspective. To quote Tim Urban in <Anchor href="https://waitbutwhy.com/2014/05/life-weeks.html" target="_blank" rel="noopener noreferrer">Your Life in Weeks</Anchor>
		    	</p>
		    	<blockquote><em>One of the ways we end up in NeitherLand* is by not thinking about things hard enough—so one of the most critical skills is continual reflection and self-awareness.</em></blockquote>
		    	<p>	
		    		The Life Calendar is a tool that helps you do that more easily and actually enjoy doing it.
		    	</p>
		    	<small>*Neitherland is where you're neither enjoying the now nor setting yourself up to enjoy the future more.</small>
		    </div>
	    </div>
	</div>
)

export default PublicHomePage