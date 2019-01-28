# VRClassroom

VRClassroom is a cross-plattform application for the usage of 360 content in education. It consists of two parts: the teacher app where the theacher can put the content they want to show their students and the students app.
The students app is a React360 application which presents the content on the VR-Headsets to the students.

![VRClassroom Teacher App](https://raw.githubusercontent.com/vronifuchsberger/VRClassroom/master/thesis/images/controls-overlay.png)
![VRClassroom Student App](https://raw.githubusercontent.com/vronifuchsberger/VRClassroom/master/thesis/images/WebVR2.png)


## Usage

Pre-compiled apps for all plattforms can be found as releases in this repo.


## Development 

### System requirements
* node.js 10+
* yarn

### Getting started

1. Clone this repo
2. To install third-pary libraries for all three internal apps (teacher app, student app, electron app) run 
```
yarn install
cd src/teacher && yarn install
cd src/student && yarn install
```
  
3. To start development servers run `yarn start` in main directory
  
### Build App
To build release version of VRClassroom for all plattforms run  `./build.sh`
