import React from 'react'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

function ImageCarousel(props) {
  return (
    <div>
      <CSSTransitionGroup
        transitionName="carousel"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}>
        <img src={props.imageSrc} height={props.imageHeight} key={props.imageSrc} />
      </CSSTransitionGroup>
    </div>
  );
}

export default ImageCarousel