# VRClassroom

VRClassroom is a cross-plattform application for the usage of 360 content in education. It consists of two parts: the teacher app where the theacher can put the content they want to show their students and the students app.
The students app is a React360 application which presents the content on the VR-Headsets to the students.

![VRClassroom Teacher App](vronifuchsberger.github.com/masterarbeit/thesis/images/controls-overlay.png)
![VRClassroom Student App](vronifuchsberger.github.com/masterarbeit/thesis/images/WebVR2.png)

Pre-compiled apps for all plattforms can be found as releases in this repo.

## Usage


### System requirements
To use VRClassroom your computer needs at least:
* Node 10
* Electron 3
* Yarn

### Development 
1. Clone Repo
2. Install third-pary libraries on all three internal apps (teacher app, student app, electron app)
  ```yarn install``` in 'masterarbeit'-directory, 'masterarbeit/src/teacher'-directory und 'masterarbeit/src/student'-directory
  
  ```masterarbeit$ yarn install```
  
  ```teacher$ yarn install```
  
  ```student$ yarn install```
  
3. To start development servers execute yarn start in 'masterarbeit'-directory

```masterarbeit$ yarn start```
  
### Build App
To build the VRClassroom app for all plattforms execute the build.sh-script in the 'masterarbeit'-directory

```masterarbeit$ ./build.sh```
