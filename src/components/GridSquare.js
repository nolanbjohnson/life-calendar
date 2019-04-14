import React, { memo } from 'react'
import moment from 'moment'
import { colorSwitch } from '../helpers/utils'

const GridSquare = ({ squareSize, date, yourAge, clicked, highlighted, date_events }) => {

	return (
		<rect width={squareSize} 
	          height={squareSize}
	          className="date"
	          rx={2}
	          ry={2}
	          style={{fill: clicked ? 'black' : colorSwitch(date.column, date.row, yourAge, 0.5), strokeWidth: highlighted ? "2" : "1", stroke: "rgba(150,150,150)"}}
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