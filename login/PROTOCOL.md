# Requests (client->server)

## `worlds`

Requests a list of World Server instances

### Required Properties 
N/A

### Optional Properties
N/A

# Response (server->client)

## `worlds`

Contains a list of World Server instances

## Guaranteed properties

For each World Server instance in the list, returns an object keyed on the server's host, port and namespace in this configuration: `host:port/namespace`.  The objects each contain the following properties:
 - pop: the population of the world server as an integer value
 - active_pop: the number of players on the world server who are currently active
 - capacity: the population capacity of the server

## Extra properties
Ń/A