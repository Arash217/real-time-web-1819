const EventSource = require('eventsource');

const eventSource = new EventSource('http://stream.pushshift.io/');

module.exports = eventSource;