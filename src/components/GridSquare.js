import React, { memo } from 'react'
import moment from 'moment'
import { colorSwitch, backgroundColorRandom } from '../helpers/utils'

const GridSquare = ({ squareSize, date, yourAge, clicked, highlighted, date_events, date_homes, selectEndPoint }) => {
	const futureSquare = new Date(date.startDate) > new Date()
	return (
		<rect width={squareSize} 
	          height={squareSize}
	          className="date"
	          rx={2}
	          ry={2}
	          //style={{fill: (clicked || selectEndPoint) ? 'black' : colorSwitch(date.column, date.row, yourAge, 0.5), strokeWidth: highlighted ? "2" : "1", stroke: "rgba(150,150,150,1)"}}
	          style={{fill: (clicked || selectEndPoint) ? 'black' : ( futureSquare ?  'white' : date_homes.color || 'white' ), strokeWidth: highlighted ? "2" : "1", stroke: "rgba(150,150,150,1)"}}
	    >
			<title style={{fontSize: "3em"}}
			>
			  { moment.utc(date.startDate).format("M/DD/YY") }
			  {
			    date_events
			    ? (
			        <p>
			          <span role="img" aria-label="event-emoji">{ date_events.emoji }</span>
			          { date_events.name }
			        </p>
			      )
			    : null
			  }
			</title> 
		</rect>
	)
}

export default memo(GridSquare)