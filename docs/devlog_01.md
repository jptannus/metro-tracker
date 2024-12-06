# Devlog 1
### Goal
The goal for this project is to be able to have a realtime tracker of the metro to know the time of the next metros that will leave Vällingby.

### Use case
Be able to see the next 3 metros that will leave Vällingby station with the information:
    - Time they will leave the station.
    - Their destination.
    - If they are a metro that started in Vällingby or Hässelby.

They also should be ordered by the time they will leave.

### Investigation
With the goal and use case set, let's find information about the API of the metro system in Stockholm.

This is the link for the official API documentation: https://www.trafiklab.se/api/trafiklab-apis/sl/transport/. Everything is very straight forward. It is REST, they return JSON. Let's start doing something!

### Setup project
Because it is easy for me I will start a nodejs project for this. I will just make a prototype, get a http request lib to make the requests and log the results.

Using the HTTPS lib from NodeJS I can get an error 400. Great I got something, let's try to get it to actually work. Getting back to the API docs.

### Making it work
To make things simpler, I installed the lib Axios to make the requests and have a more elegant handling with promises.

#### Getting the lines information
For me to request the information about the lines I need to first have the site id. That is the identifier for the station I am interested in. So first I get that information by listing all the sites using this url: `https://transport.integration.sl.se/v1/sites?expand=true`.

I got the siteId so now we can use the URL to get all departures: `https://transport.integration.sl.se/v1/sites/${VALLINGBY_ID}/departures`. Bingo we got all the next departures with all the information that we need. Each departure looks like this:
```json
{
    "destination": "Jakobsbergs station",
    "direction_code": 2,
    "direction": "Jakobsbergs station",
    "state": "EXPECTED",
    "display": "Nu",
    "scheduled": "2024-12-06T15:05:00",
    "expected": "2024-12-06T15:05:00",
    "journey": [Object],
    "stop_area": [Object],
    "stop_point": [Object],
    "line": [Object],
    "deviations": []
}
```

#### Presentation
Now it is time to make the results easy to read and with only the information we need. Let's clean!

First I checked the API to see if I could get less information. So I found I could filter for transportation method and give a time constraint, default is 60 minutes, I changed to 30. This way we get a much smaller list.

Another thing I realised is that I am not interested in the departures that are going in the direction of Hässelby but only those going south. I can do that easily using the `direction` parameter that in this case what I want is code `2` that indicate is going south. Up would be `1`.

Now I got a list like this:
```
[
  'Farsta strand: 15:56',
  'Skarpnäck: 15:51',
  'Skarpnäck: 15:43',
  'Farsta strand: 15:41',
  'Farsta strand: 15:33',
  'Hagsätra: 15:31',
  'Farsta strand: 15:26'
]
```

That is good, but I want to know how much time left there is. So let's create a function for that and show it. This is better:
```
[
  'Farsta strand: 3 minutes (15:41)',
  'Skarpnäck: 5 minutes (15:43)',
  'Skarpnäck: 12 minutes (15:51)',
  'Farsta strand: 17 minutes (15:56)',
  'Hagsätra: 22 minutes (16:1)',
  'Skarpnäck: 27 minutes (16:6)'
]
```

#### Get the information from where they leave
Now I want to flag somehow the departures that are leaving Vällingby and not just passing by. This make so those departures are more attractive to take as it will be easier to get a good sitting spot.

Checking the docs I didn't find an easy way to indentify the origin of the metro. Let's dig into the data. I could not find anything in the data. So an alternative way would be to look at the metro will leave Hässelby before and keep a track on those. Sadly I have only 10 minutes today so I won't finish this.

### Next steps
- [ ] Load all the departures from Hässelby.
- [ ] Cross reference with the ones with Vällingby.
- [ ] Add a visual marker for when the departure is from Vällingby.