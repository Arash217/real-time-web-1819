const EventSource = require('eventsource');

const eventSource = new EventSource('http://stream.pushshift.io/?type=comments&over_18=true');

module.exports = eventSource;