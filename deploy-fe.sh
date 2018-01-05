#!/usr/bin/env sh

export TPL_NAME="index"

cd frontend
npm install && npm run build

# copy template file
rm -rf ../app/view/$TPL_NAME.html
cp -rf ./dist/$TPL_NAME.html ../app/view/$TPL_NAME.html

# copy static files
rm -rf ../app/public/*
cp -rf ./dist/public/* ../app/public


