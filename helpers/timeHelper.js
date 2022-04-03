const moment = require('moment')

/**
 *  Function to format timestamp from db 
 *  to DD MMMM YYYY format
 */
function simpleDate(date){
  return moment(date).utcOffset(8).format('DD/MM/YYYY')
}
function simpleDateTime(date){
  return moment(date).utcOffset(8).format('DD/MM/YYYY HH:mm:ss')
}

module.exports = {
  simpleDate,
  simpleDateTime
}