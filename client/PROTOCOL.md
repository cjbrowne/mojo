# HTTP Protocol definition

Note that only the non-static parts of the protocol are defined here.  The following URLs all point to static resources:
 - / (renders the 'landing' view, which is the only fully-fledged HTML view, the rest are provided as HTML snippets or JSON.
 - /js/Mojo.js (the client-side library is compiled into a single file)
 - /js/vendor/:vendorScript (e.g. jquery, require.js, etc.)
 - /css/main.css (thanks to Stylus and careful @imports, there is only one css file)
 - /socket.io/socket.io.js (served by socket.io)
 - /img/:img (IMPORTANT: this URL must NOT be used for in-game 2D resources.  It's just for images used to style the site (eg the site logo))

## /res/

Resource files

### /res/map/:x/:y/

Responds with a JSON file representing the selected MapTile.  If an invalid MapTile is requested, the server will respond with a JSON document with an "error" property set to an object containing details of the error.

### /res/characters/:charId/

Responds with a character model representing the character in question.  Note that early builds will ignore the :charId attribute and respond with the same model regardless.  This is for simplicity's sake during the tech demo phase of the project.

### /res/minimap/:x/:y/

Responds with an image of the map at that location.