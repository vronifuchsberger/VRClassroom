rm -rf build
mkdir build
cd src/student
yarn install
yarn bundle
cp -r ./build ../../build/student
cp -r ./static_assets ../../build/student/static_assets
cd ../teacher
yarn install
yarn build
cp -r ./build ../../build/teacher
cp -r ../*.js ../../build/
cd ../..
yarn dist
