# Real-Time Web @cmda-minor-web · 2018-2019

## Summary
A webapp using websockets to filter realtime Reddit comments.
![App](../master/docs/images/app.png)

## Usage
Clone it
```
git clone https://github.com/Arash217/real-time-web-1819
```

Install dependencies
```
npm install
```

Start the server
```
npm start
```

### Mongo database config
create config/db.json with the following format:
```
{
  "username": <database-username>,
  "password": <database-password>,
  "host": <host>,
  "port": <host-port>,
  "database": <database-name>
}
```

## Concept
This webapplication filters a live stream of Reddit comments and displays it to the user.

Features of the app:
- User can filter comments by using the input field in the webapp
- Comments statistics to see the comments per minute for a search, and top 10 searches all time (of all users)
- Login system to keep track of a user's search history

## API
The app uses [Reddit SSE Stream](https://github.com/pushshift/reddit_sse_stream) to get a live feed of near real-time Reddit data by using server-sent events. The API doesn't require an API key, but does limit the connection to only one per IP.

Note: this isn't the official Reddit API.

## Todo
- [ ] Client-side form validation for register and login forms
- [ ] Handling downtime
- [ ] More error handling
- [ ] Better UX and UI
- [ ] Add support for filtering by regex
