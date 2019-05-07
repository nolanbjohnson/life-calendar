import React from 'react'

import LifeCalendar from '../components/LifeCalendar'

const PublicHomePage = props => (
	<div className="w-100 mw8 ph3 center">
    	<div className="flex flex-row flex-wrap lh-copy mt5">
    		<div className="measure">
		    	<h2>Rethinking your life, one week at a time</h2>
		    	<p>
		    		This is my take on the post <a href="https://waitbutwhy.com/2014/05/life-weeks.html" target="_blank" rel="noopener noreferrer">Your Life in Weeks</a> by 
		    		Tim Urban of Wait But Why. If you haven't read it yet, take the next 10 minutes and do yourself a huge favor. Your future self 
		    		will thank you! 
		    	</p>
		    	<p>
		    		Also, they sell a <a href="https://store.waitbutwhy.com/collections/life-calendars" target="_blank" rel="noopener noreferrer">physical "Life Calendar"</a> that you can fill in however you want <strong>IRL</strong>. I own one and it will continue 
		    		to exist long after this website disappears, after the whole internet is gone, and after our cat-alien overlords enslave us all 
		    		into a life of pet-servitude. So go <a href="https://waitbutwhy.com/2014/05/life-weeks.html" target="_blank" rel="noopener noreferrer">check it out!</a>
		    	</p>
		    	<p>
		    		Okay, you're back? Great! Let's get started.
		    	</p>
		   	</div>
		   	<img width={300} height={300} className="ma4" alt="life calendar" />
		   	<LifeCalendar />
	    	<div className="fl measure">
		    	<h3>What's a life calendar?</h3>
		    	<p>
		    		It helps you make sense of this crazy precious gift we've all been given, and hopefully help you make better choices about 
		    		how to use it.
		    	</p>
		    	<h3>But how...? <span role="img" aria-label="thinking face">🤔</span></h3>
		    	<p>
		    		Life is both long and far too short - to do it well, you need perspective. To quote Tim Urban in <a href="https://waitbutwhy.com/2014/05/life-weeks.html" target="_blank" rel="noopener noreferrer">Your Life in Weeks</a>

		    		<blockquote><em>One of the ways we end up in NeitherLand* is by not thinking about things hard enough—so one of the most critical skills is continual reflection and self-awareness.</em></blockquote>
		    		
		    		The Life Calendar is a tool that helps you do that more easily and actually enjoy doing it.

		    	</p>
		    	<small>*Neitherland is where you're neither enjoying the now nor setting yourself up to enjoy the future more.</small>
		    </div>
	    </div>
	</div>
)

export default PublicHomePage