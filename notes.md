Sending requests with body data in them using the Fetch API and
body-parser:

Don't use the FormData object with the fetch API and body-parser, it
won't work. You have to convert the form data into something that will
work. These pages have some examples:

<https://stackoverflow.com/questions/41984893/fetch-post-fails-on-post-json-body-with-sails-js>
<https://stackoverflow.com/questions/3508338/what-is-the-boundary-in-multipart-form-data>
