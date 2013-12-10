#!/bin/bash
sudo nodemon -e ".styl|.json|.js" -w css -w . -w locales -w ../common app.js