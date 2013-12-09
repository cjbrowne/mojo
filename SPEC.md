# Version 1.0

Mojo version 1.0 is a full-fledged MMORPG system including content, characters, a combat system, reward items and quests.

## Client
- Registration
	- Register a new user account
	- Modify an existing user account
	- Delete a user account
- Billing
	- PWYW subscription form.
	- Subscription cancellation.
	- Rewards for paying > average (à la humble bundle)
- Authentication
	- Login persistence
	- Logging in using email address and password
	- Two-step auth
- Update blog
	- Create blogpost
	- Automated blog posts for updates pushed to git
	- Break down of features, bug fixes and balance changes.
- Community feedback and support features (external to game).
- i18n support for entire system
- Game World rendering interface
	- UI API
		- Elements
			- Panel
			- Button
			- Window
			- Dialog
			- ItemSlot
			- ActionSlot
		- Events
			- [Element] Clicked
			- [Element] MouseOver
			- [Element] MouseOut
			- [Global] Keydown
			- [Global] Keyup
	- Default UI
		- Permanent elements
			- Action bar
			- Minimap
			- Character portrait with level, health bar, and resource bar
			- Menu (see Temporary elements)
		- Temporary elements
			- Inventory
			- Dressing room
			- Inspect Character
			- Guild
			- Social
			- Chat

## Login Server
- Client-facing API
	- List World Server instances
	- Get guild players list
	- Get friend list
	- Add friend
	- Remove friend
	- Block player
	- Unblock player
	- Send chat message
	- Join chat channel
	- Leave chat channel
- Spin up new World Server instances on demand
- Spin down idle World Server instanes on demand

## World Server
- Anti-cheat
	- Speed limits: if a player moves further than a certain threshold in a certain time period, consider it a speedhack.
	- Combat limits: impose cooldown periods on all spells and abilities.  If a player attempts to cast a spell during a cooldown period, silently ignore the cast.
	- API limits: if a 'bad' API request (e.g. attempt to list characters of another playerId) occurs, register it as a potential hack attempt by the originating account.
	- Anti-botting: attempt to automatically detect bot scripts and punish the account responsible.
- Client-facing API
	- List Characters
	- Get Character information (for "inspection" and "dressing room" UI elements)
	- Move (ideally via absolute position updates rather than relative, so that lag isn't noticeable for your own character)
	- Cast Spell
	- Attack (with weapon)
	- Enter game world (spawn) {send back: player position, current map tile, nearby NPC list, nearby player list}
- Determine clients in close proximity to one another, update close-proximity clients when necessary.