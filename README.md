# The Kiosk Application Framework

NB: This framework is a work in progress. I will ensure that master always runs, so you can try this out, but some functionality is likely to be missing. If you find any bugs, or have comments I'd appreciate a report.
To run this, clone the repo, type **Yarn && Yarn Start** and you should be away.

## What is this?

The Kiosk Application Framework has been built to facilitate creation of touchscreen experiences (interactives) in a range of scenarios:

- Museums
- Libraries
- Displays in corporate lobbies

Basically, anywhere you want to put a touchscreen display with information on it.

The aim of the framework is to lower bar for small (or large) organisations who want to build, monitor, and occasionally update interactives.

I have based this work on the guidliines in Te Papa's [Design Language System](https://dls.tepapa.govt.nz/).

Rather than create an empty framework with documentation, I have opted to create an example application that shows how to use it. Remove what you don't need, copy and paste, whatever works.

## Background

From early 2017 to September 2018 a group of people, including myself, worked on a framework to simplify the creation and deployment of touch-screen interactives at Te Papa, The Museum of New Zealand. This was called the Digital Experience Delivery System, or DEDS (pronounced Deeds). It was later renamed Te Papahiko, or The Digital Foundation. I was product owner for the project.

The aim of the DEDS project was to lower the cost of producing interactives by providing a starter framework containing resuable components. In practice, we were successful - we produced interactives for some stand-alone exhibits, and for [Ko Rongowhakaata - The Story of Light and Shadow](https://www.tepapa.govt.nz/visit/exhibitions/ko-rongowhakaata-story-light-and-shadow) - all at a lower cost than outsourcing the work.

We wanted to share this work with others museums, but it was not possible to release the code under an open source license.

This project is an attempt to recreate the functionality of that project from scratch, using the latest version of React, and leveraging off well-maintained packages where possible, and using Te Papa's DLS as a guide.

Some assembly will be required to get this working - you will need a developer with experience in ReactJS, although most intermidate to seniors developer should be able to work it out.

This project is released under an open MIT license for anyone to use, or to build upon.

## Design Principles

0. Leverage off the work of others

There are well maintained packages covering internationalisation, idle monitoring, and so on.

Why reinvent the wheel?

1. Convention over configuration

The aim here is to make sane choices so that components can be bolted together and things just work out-of-the-box.

Configuration will be kept to a minimum. It will be possible to customise what you see here, but that will be up to you, I won't make it hard, but you will need to know you way around React. :-)

2. Easy to use

The code needs to be simple enough that you don't need a deep knowledege of React to product something that works. Since I am learning React as I work in this project, if it doesn't look easy to understand to me, it gets rewritten.

3. Easy to update, easy to deploy

This project cannot be all things to all people. There won't be a CMS, but you could replace the content stored in locales with some sort of CMS. It's been my experience that content in museum floors is infrequently updated, so rather than have all the complixty of a CMS, just make the interactive easy to update and deploy. That's on the roadmap.

4. Encapsulation

Like things should be together. Not necessarily a class, but together. Easier to read, easier to modify. Don't create unnecessary abstractions. Code to make it easy for future developers to understand and modify the code. That future developer might be you!

5. Design is clear, or well documented

I am a big fan of documenting why things were done a certain way. Perhaps some future dev will find this useful if they need to do some refactoring.

## Features

### Multi Language Support

At Te Papa all interactives were created with Māori and English versions. If you use this application in New Zealand I'd strongly encourage you to use both languages - Māori is an official language and it is the right thing to do.

Kiosk Application uses the mature react-i18next library to provide this functionality.

Analytics: When the language is changed, an event is sent with the code of the language..

### Gloss

A gloss is used to attach a translation and an (optional) audio pronunciation guide to single words in a sentence.

At Te Papa this was used to provide translations for te reo Māori. It could also be used to describe scientific terms or provide references for quotes.

The Te Papa DLS has [more information](https://dls.tepapa.govt.nz/_pages/patterns/gloss/).

Analytics: When a gloss is opened it sends an Open event, with the word that triggered the event. It does not send a close event, as this really does not provide any useful information. The user has to close the gloss at some stage, and duration open doesn't seem like a hepful measure, although number of audio plays _may_ be useful.

### Screensaver/Attractor Loop

The screen saver can run in two modes:

#### 1. Full screen saver

In this mode the screen saver content fade in as soon as the application goes into the idle state. The time to idle is configurable, but I recommend something short (90-120 seconds depending on how much content is on each page) to avoid getting elongated session times in the analytics.

If the hide time is set to 0, the screensaver operates in this mode.

#### 2. Cycle mode

In this mode there is a delay when the application goes into idle (the 'hide' duration), before the screensaver/attractor is shown (the show duration).

The screensaver uses react-spring for the simple fade, and you could use this package to animate text or images within the screensaver show cycle.

If the hide time is set to 1 or more, the screensaver operates in this mode. Durations greater than 60 seconds are more realistic in practice.

Screensaver props are set in seconds.

### Analytics

Analytics is built in to every component, including time on page, and session duration.

I designed the Analytics regime for DEDS, and in this project I want to take it to the next level of usefulness.

We use a simple React context to pass down the Analytics object to functions and classes. There is a provider model, so you can use any analytics provider you want, or two at the same time. This could be useful for getting high level stats via Google Analytics, and more detailed analysis for an interactive, or a group of interactive, with the [ELK Stack](https://www.elastic.co/what-is/elk-stack).

This project uses analytics.js rather than gtag.js as the latter does not have support for session termination.

Pages views are tracked, but not the first page view at startup, or the final page view of a session when the application returns to the home page automatically.

Page view duration and session time is also tracked via the Google timing API, using the actual page as the data label. Google samples this data, so we try not to pollute it with data that is wrong, or that serves no useful purpose.

The session start and end events use a fake URL (/session) so as not to pollute real page view stats.

The session duration time is usually the time from the first page view until the session ends (times out). The problem with using this is that someone will read the last page of their session and walk away. The session time will incude the time between when they walked away and the time out. If they did not spend long reading, perhaps just a minute, the session time will be inflated. Looking at session times as a group, the lower limit of session times (short ones) will be higher than it should be.

This application adjusts this time, based on a statistical guess. We do the following:

```
adjustedSessionTime = sessionTime - idleTimeout + (averagePageViewDuration + one standard deviation)
```

THIS IS A GUESS based on experience and observation. You'll need to confirm it youself, but at the very least you won't, on average, have session times inflated by the timeout between the user walking away and the screensaver starting. The duration of this extra page time is not sent to the analytics provider.

You can set the analytics logging level to `2` to see the results of this printed in the console.

If you DO NOT want to do this, set the analytics param `useEstimatedSessionTiming` to `false`. This will revert to including the whole timeout value in the duration.

### Audio Player

This is primarily to support the Gloss feature mentioned above, but could be used anywhere or in tandem with a slideshow, triggered by a timeline.

The basic `<ReactAudioPlayer />` wraps the HTM5 `<audio>` tag and provides access to event callbacks and props.

### Routable Carousel

This component supports dragable children with next and previous arrows. It is currently used to wrap in the 4 demo pages.

Child components should have a `path` props which is used by the component to integrate seamlessly with React Router, so that `<Link to={path} />` slides to the required page in the correct sequence.

### Video Player

The Video player currently will play a single video in fullscreen mode.

## Roadmap (Features to be done)

### Styling

At the moment the project is using Bootstrap, to bootstrap the project. The plan is to do something custom.

### Image Galleries

This will display a set of images, with thumbnail navigation.

### Video Player

The Video player will eventually support mulitple language subtitles, and dual video tracking to allow switching between regular video and one with Sign Language interpretations embedded.

### Image Viewer

This component will allow high resolution viewing of an image.

### Deployment

The plan for deployment of completed interactives - so you don't have to build, and thumbdrive it to your kiosk - is to provide a script similar to github-pages that allows commandline deployment direct to the Kiosk over SSH. (If you know Rails, think "cap production deploy").

Keep it simple will be the mantra here. If someone wants a more 'enterprise' solution, the script could be used to push to master and trigger a remote build.

At this stage the Kiosk Application Framework expects to be served via a web server. It is fairly simple to setup Ubuntu (for example) on a PC as a Kiosk appliance. Don't bother with Windows - it requires a lot of changes to make it into a suitable Kiosk service, plus (of course) Ubuntu is Libre/Free.

## Contributions

Contributions and suggestions are welcome.

By contriuting to this project you assert that the work is your own, that it is not based on any commerical or copyright code, and that it was done on your own time, or on work time with the full knowledge of your employer.

All your contributions will be licensed under the terms of this project's MIT license.

We have a [Code of Conduct](./code_of_conduct.md). Don't be a dick, OK!

## Running, Building and Testing

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Think VERY CAREFULLY before you run eject!

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
