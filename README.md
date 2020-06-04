# NL COVID-19 Data Dashboard

Het dashboard coronavirus geeft informatie over de ontwikkeling van het coronavirus in Nederland. Het dashboard laat met actuele cijfers zien hoe het coronavirus zich in Nederland verspreidt. Die informatie komt van onder andere het RIVM, de GGD’en en de ziekenhuizen. Op het dashboard is bijvoorbeeld te zien hoeveel mensen positief getest zijn op het virus en of het aantal besmettingen oploopt.

## Development & Contribution process
The core team works on the repository in a private fork and will share its work as often as possible. If you plan to make non-trivial changes, we recommend to open an issue beforehand where we can discuss your planned changes. This increases the chance that we might be able to use your contribution (or it avoids doing work if there are reasons why we wouldn't be able to use it).

## Setup
This application uses Next.js as framework, which builds the pages of the application as static exports. We use Preact to keep the bundle as small as possible.

We are using Next.js 9.3, because 9.4 seems to have issues with Fast Refresh and Preact.

Run  `yarn` to install all required packages.

## Data
The data is not open-source yet.
If you have data, you can place it in `/public/json/`

## Available Scripts

In the project directory, you can run:

### `yarn dev`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn build`

Builds the app for production to the `out` folder.
It correctly bundles React in production mode and optimizes the build for the best performance. All pages are output as static html files through `next export`.