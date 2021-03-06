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
![Lifecycle](../master/docs/images/data-lifecycle.png)

### Reddit SSE stream data model

<details>
<summary>Comment</summary>
  
```
{  
   "body":"Horrible! But what're the names of buildings involved?",
   "permalink":"\/r\/aggies\/comments\/bqqoza\/tamu_transit_employee_arrested_for_hiding_a\/eo71p94\/",
   "subreddit_name_prefixed":"r\/aggies",
   "author":"randomUser5"
}
```

Comment example that is pushed by the API to the server.
</details>

### Client data model

<details>
<summary>Line chart data</summary>
  
```
  {
      labels:[1, 2, 3, 4, 5]
      datasets: [60, 55, 54, 52, 50]
  }
```

The data that is displayed by the line chart for the comments per minute. 
Labels are time elapsed in seconds and datasets the respective comments per minute.
</details>

<details>
<summary>Graph chart data</summary>
  
```
  {
      labels:["dog", "cat", "test", "real", "test2", " cat", "do"]
      datasets: [35,27,18,3,1,1,1]
  }
```

The data that is displayed by the graph chart for the top 10 searches all time.
Labels are the search keywords and datasets are the respective amount of times searched for.
</details>

### Server data model
<details>
<summary>Comment</summary>
  
```
{  
    commentNode: '<a href="https://www.reddit.com/r/dankmemes/comments/bqoin6/stupid_ads/eo7fe54/" target="_blank" class="comment-permalink">
    <div class="comment">
        <div class="comment-info">
            <span class="comment-subreddit">r/dankmemes</span>
            <span> - </span>
            <span class="comment-user">Comment by ashleystrange</span>
        </div>
        <p>Unless it's a cute <span class="highlight">dog</span>.</p>
    </div>
</a>'
}
```

The comment data from the Reddit SSE stream is used to create server-side the HTML for the client, so that the client has only to append the HTML to the DOM.
</details>

<details>
<summary>CommentCounter</summary>
  
```
{  
    commentPerMinute: CommentCounter.round(commentPerMinute, 1),
    timeElapsed: Math.round(timeElapsed / 1000),
}
```

The server keeps track of the amount of times a comment has been found by the user's search keyword. 
The data is used in the client to display the predicted comments per minute.

(See the CommentCounter class for more details)
</details>

### MongoDB data model

<details>
<summary>Users</summary>
  
```
{
    "username" : "<username>",
    "password" : "<hashed-password>",
}
```

MongoDB collection to store user accounts.
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

MongoDB collection to store the user's search history.
</details>

<details>
<summary>Searches</summary>
  
```
{
    "count" : 34,
    "search" : "dog"
}
```

MongoDB collection to store the top used search keywords. 
</details>



## Todo
- [ ] Client-side form validation for register and login forms
- [ ] Handling downtime
- [ ] More error handling
- [ ] Better UX and UI
- [ ] Add support for filtering by regex
