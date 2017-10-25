# Sorry, Typeform I/O will be deprecated soon. Please visit https://developer.typeform.com/ to discover our new developer products


## SimpleLiveReports

Building simple, live reports by using Typeform I/O

## Requirements

* Typeform I/O API-key

* Node.js

## Installation

* Fork project

* Inside project, run `npm install`

* `cp .env.sample .env` to create your configuration

* In `.env`, change the api-key to the one you received

* Run the server `node index.js`

* (Optional) have a proxy in front with ngrok `ngrok -authtoken your_auth_token -subdomain simple_live_reports 5000`

* Create a form via the `/forms` endpoint in `SimpleLiveReports`

Example CURL command:

```
curl -X POST localhost:5000/forms --data '{"title": "Hello", "fields": [{"type": "number", "question": "How old are you?"}]}' -H "Content-Type: application/json"
```

Note: Does only work with NumberField for now...

* From the response you get back, there is two URLs

* Visit the `report` link, where you can see the results once they been submitted.

* Navigate to the `form` link and fill out the typeform. Now the results should be showing up as a piechart in the report
