# Requests (client->server)

## `spawn`

Requests that the user enter the world as the character specified.

### Required Properties 
 - characterId: the unique identifier of the character you wish to enter the world as

### Optional Properties
 - getMapTileURL: a boolean indicating that the client wishes to receive a mapTile URL.  If not present, the client will still receive the coordinates of the maptile, which can be used to craft a URL on the static server: /res/map/:x/:y/

## `move`

Indicates to the server that the client has moved.

## Required Properties
 - x: the new X position of the player
 - y: the new Y position of the player

## Optional Properties
N/A

# Response (server->client)

## `spawn`

Indicates that the server has successfully completed a spawn procedure and the client is free to render the scene described by the payload.

## Guaranteed properties
 - mapTile: a Vector2d indicating which map tile the client should load
 - nearbyPlayers: an array containing the locations and characterIds of nearby players.  Model information can be loaded from the static server via the HTTP API: /res/characters/:charId/

## Extra properties
 - mapTileURL: a string representing the location where the maptile can be found.  Really just a rephrasing of mapTile, which is why it's optional.

## `error`

Indicates that some error has occurred.

### Guaranteed properties
 - message: a description of the error

### Extra properties
 - cheatWarn: a boolean indicating that the error is caused by behaviour that the server considers cheating (assume false if not present)
 - bugReport: a boolean indicating that the error is caused by behaviour that is most likely a bug in the client code, hinting that the client should submit an automatic bug report (or prompt the user to submit a manual bug report).