#!/bin/bash

# Navigate to the Frontend directory and build
cd ./Frontend || exit
npm run build

# Return to the root directory and navigate to Backend, then build and start
cd ../Backend || exit
npm run build
npm run start
