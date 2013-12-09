#!/bin/bash
nodemon -w js/src compile.js &
sudo nodemon -e ".styl|.json|.js" -w css -w . -w locales app.js
