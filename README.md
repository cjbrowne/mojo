# Mojo Javascript MMO game

Mojo is an MMO set in a fantasy world reminiscent of medieval Europe.  

# Install

Currently, only the client server has been implemented.  To run that, clone this repository then move into the "client" directory and run `npm install` followed by `node app` or `npm start`.

Specify a port using the PORT environment variable.

# Recommended development steps

Get yourself `nodemon` and set it up running on the 'app.js' script in the client directory using `nodemon -w . -e ".styl|.js|.json" app.js`.  If you also want to change the client-side library, you can set up nodemon to recompile the client-side library (using google's Closure Compiler) using `nodemon -w js/src compile.js`.

Linux Note: Prepend sudo to nodemon if you want to run the server on a privileged port (e.g. 80).  This is not necessary for the `compile.js` script.

# Documentation

To be added

# Testing

There are plans to add a Mocha-based test suite to the `test` directory.