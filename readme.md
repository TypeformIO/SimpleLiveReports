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

* Create a form via the `/forms` endpoint in `SimpleLiveReports`

Example Form:

```
{
    "title": "SimpleLiveReports",
    "webhook_submit_url": "https://simple_live_reports.ngrok.com/receive_results",
    "fields": [
        {
            "type": "number",
            "question": "How old are you?"
        }
    ]
}
```

Note: Does only work with NumberField for now...

* Visit the `links.results_report.get` link, where you can see the results once they been submitted.

* Navigate to the `links.form_render.get` link and fill out the typeform. Now the results should be showing up as a piechart.
