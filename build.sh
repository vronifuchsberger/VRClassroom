#!/bin/sh

rm -rf build
mkdir build

# build student app
cd src/student
yarn install
yarn bundle
cp -r ./build ../../build/student
cp -r ./static_assets ../../build/student/static_assets

# build teacher app
cd ../teacher
yarn install
yarn build
cp -r ./build ../../build/teacher

# copy electron app
cp -r ../*.js ../../build/

# run electron-builder
cd ../..
sed  -e 's/"main": "src\/index.js"/"main": "build\/index.js"/g' package.json > package.json.tmp && mv package.json.tmp package.json
yarn dist || true
sed  -e 's/"main": "build\/index.js"/"main": "src\/index.js"/g' package.json > package.json.tmp && mv package.json.tmp package.json
