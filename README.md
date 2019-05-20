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

The API allows me to filter only the required data, returning the following data format:
```
{  
   "body":"Horrible! But what're the names of buildings involved?",
   "permalink":"\/r\/aggies\/comments\/bqqoza\/tamu_transit_employee_arrested_for_hiding_a\/eo71p94\/",
   "subreddit_name_prefixed":"r\/aggies",
   "author":"randomUser5"
}
```

Note: this isn't the official Reddit API.

## Data lifecycle

### Client data model

### Server data model

### Reddit SSE stream data model
```
{  
   "body":"Horrible! But what're the names of buildings involved?",
   "permalink":"\/r\/aggies\/comments\/bqqoza\/tamu_transit_employee_arrested_for_hiding_a\/eo71p94\/",
   "subreddit_name_prefixed":"r\/aggies",
   "author":"randomUser5"
}
```

### MongoDB data model

<details>
<summary>Users</summary>
  
```
{
    "username" : "<username>",
    "password" : "<hashed-password>",
}
```
</details>

<details>
<summary>Comments</summary>
  
```
{
    "comments" : [ 
        {
            "permalink" : "/r/unpopularopinion/comments/bq5020/not_everything_is_abuse_in_a_relationship/eo1sqv9/",
            "subreddit_name_prefixed" : "r/unpopularopinion",
            "author" : "WeByte",
            "body" : "This is unpopular, thank the Aether.\n\nOP just needs some verifi<span class=\"highlight\">cat</span>ion of very bad behavior that precludes a symbiotic relationship with a mate."
        }, 
        {
            "permalink" : "/r/PersonalFinanceCanada/comments/bpx8sj/canadian_scholarship_megathread_2019/eo1sqtp/",
            "subreddit_name_prefixed" : "r/PersonalFinanceCanada",
            "author" : "Tomlinsoi",
            "body" : "ScholarshipsCanada really seems to have gone downhill.  I used it in my undergrad almost a decade ago and there were lots of great options and useful links.  Tried using it in my grad program last year and the only scholarships that ever popped up were either US based, expired, or just survey site links.  \n\nIt would be nice to have a more reliable central lo<span class=\"highlight\">cat</span>ion for them all."
        }
    ],
    "userId" : "5cdf03bf81abc031b8bb658b",
    "search" : "cat",
    "createdAt" : ISODate("2019-05-18T18:58:55.162Z"),
    "updatedAt" : ISODate("2019-05-18T18:58:56.165Z"),
    "searchDateTime" : "18-05-2019 - 20:58",
}
```
</details>

<details>
<summary>Searches</summary>
  
```
{
    "count" : 34,
    "search" : "dog"
}
```
</details>



## Todo
- [ ] Client-side form validation for register and login forms
- [ ] Handling downtime
- [ ] More error handling
- [ ] Better UX and UI
- [ ] Add support for filtering by regex
