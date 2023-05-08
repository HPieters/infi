# Keep Talking and Everybody Codes - Webapplicatie

Webapplication for the Keep Talking and Everybody Codes from Infi.

## Getting started

1. Ensure you have the `Keep Talking and Everybody Codes - API` running locally.
2. Have some way to serve the static files. For example, you can use [serve](https://github.com/vercel/serve#readme) by running `npm install -g serve` and then `serve .`.

## Exercise

The first part consists of retrieving the data from the API from the previous step.
Render the data spread over the four columns given in [code/index.html](code/index.html).
The spreading of the data needs to follow the following rules based on the `number` of the camera:

1. If `number` is divisible by 3, then it should go in the first column.
2. If `number` is divisible by 5, then it should go in the second column.
3. If `number` is divisible by 3 and divisible by 5, then it should go in the third column.
4. If `number` is not divisible by 3 and is not  divisible by 5, then it should go in the last column.

The second part consists of showing the camera locations as markers in Google Maps.
Show _all_ cameras in the `div` with id _map_ in the given [code/index.html](code/index.html).
You can find documentation for how to use Google Maps at [the Google Maps documentation](https://developers.google.com/maps/documentation/javascript/examples/marker-simple).


## Next steps

- Tests
- Documentation
- Add loading state
- Improve UI
- Same application in Next.js?
- Make code more robust
