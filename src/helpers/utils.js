const getWeekNumber = (d) => {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    
    // Get first day of year
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));

    // Calculate full weeks to nearest Thursday
    let weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
}

const backgroundColorRandom = () => {
  const randNum = Math.random()
  if(randNum < 0.2) return "rgba(100,237,237,0.3)"
  if(randNum < 0.4) return "rgba(50,100,237,0.3)"
  if(randNum < 0.6) return "rgba(205,92,92,0.3)"
  if(randNum < 0.8) return "rgba(92,205,92,0.3)"
  if(true) return "rgba(205,92,205,0.3)"
}


const colorSwitch = (index, row, now, opacity) => {
      // return "rgba(255,255,255,1)"
      if(index === 0 && row === 0) { return `rgba(100,149,237,1)` } else 
      if(row < 6) { return `rgba(100,237,237,${opacity})` } else 
      if(row < 11) { return `rgba(50,100,237,${opacity})` } else 
      if(row < 14) { return `rgba(205,92,92,${opacity})` } else
      if(row < 18) { return `rgba(92,205,92,${opacity})` } else
      if(row < 22) { return `rgba(205,92,205,${opacity})` } else
      // if(index < parseInt(52 * now)) { return `rgba(205,92,205,0.3)` } else
      if(row < now - 1 || (index < Math.floor((now % 1) * 52) && row < now)) { return `hsla(${index*row / 2},100%,50%,${opacity})` } else 
      return `rgba(255,255,255,${opacity})`
}

export { getWeekNumber, colorSwitch, backgroundColorRandom }