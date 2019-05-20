const EventSource = require('eventsource');

const eventSource = new EventSource('http://stream.pushshift.io/?type=comments&over_18=true&filter=permalink,subreddit_name_prefixed,author,body');

module.exports = eventSource;