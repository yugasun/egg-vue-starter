#!/usr/bin/env sh

cd $MODULE_NAME
npm install && npm run build

echo '*********** Copying '$MODULE_NAME' files ***********'

# copy template file
rm -rf ../app/view/$MODULE_NAME.html
cp -rf ./dist/$MODULE_NAME.html ../app/view/$MODULE_NAME.html

# copy static files
rm -rf ../app/public/$MODULE_NAME
cp -rf ./dist/public/* ../app/public

echo '*********** Build '$MODULE_NAME' success. ***********'


