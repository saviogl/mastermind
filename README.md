# Mastermind Game API Axiom Zen 

API Developed for the first VanHackathon - May 20,21,22.

This is a Node.js application, developed with Sails.js framework.

# API
## POST /game - Create Game

Create a new game with the following HTTP request

```
REQUEST:

POST /game HTTP/1.1
Host: localhost:1337

{
    "user": "John Doe"
}

RESPONSE:

{
  "user": "John Doe",
  "colors": [
    "R",
    "B",
    "G",
    "Y",
    "O",
    "P",
    "C",
    "M"
  ],
  "positions": 8,
  "guesses_attempts": 0,
  "past_guesses": [],
  "solved": false,
  "game_key": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoic2F2aW9nbCIsImdhbWUiOjY3LCJtdWx0aXBsYXllciI6ZmFsc2V9.J9AY5VsQqSnabN9NTSxLgDPZqDcz_x9pF2EDYpTa274"
}

```

To create a multiplayer game add a new body parameter in the HTTP request call
```

REQUEST:

POST /game HTTP/1.1
Host: localhost:1337
Cache-Control: no-cache
Postman-Token: 14e0787f-ebfa-b00d-96ed-b51a4145d5ff

{
    "user": "saviogl",
    "multiplayer": true
}

RESPONSE:
{
  "user": "John Doe",
  "colors": [
    "R",
    "B",
    "G",
    "Y",
    "O",
    "P",
    "C",
    "M"
  ],
  "positions": 8,
  "user_guesses_attempts": 0,
  "user_past_guesses": [],
  "guest_guesses_attempts": 0,
  "guest_past_guesses": [],
  "solved": false,
  "game_key": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoic2F2aW9nbCIsImdhbWUiOjczLCJtdWx0aXBsYXllciI6dHJ1ZX0.E3HiVPSzTrjN-IXSKEfxJu0l4RLOrbkNot6NO4DRYMU",
  "invite_key": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.NzM.dW44PnJHhzEDtdb_EKVapm0rCoOcsd2SL9Qs6GCPtuc"
}
```

## POST /guess - Take Guess
To take a guess at some game execute the following HTTP request
```
REQUEST:

POST /guess HTTP/1.1
Host: localhost:1337
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: 8b4ee639-cb6d-01cb-3bcc-11149aae7a35

{
    "code": "YOMYYCMY",
    "game_key": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoic2F2aW9nbCIsImdhbWUiOjY3LCJtdWx0aXBsYXllciI6ZmFsc2V9.J9AY5VsQqSnabN9NTSxLgDPZqDcz_x9pF2EDYpTa274"
}

RESPONSE:
```
{
  "user": "John Doe",
  "colors": [
    "R",
    "B",
    "G",
    "Y",
    "O",
    "P",
    "C",
    "M"
  ],
  "positions": 8,
  "guesses_attempts": 1,
  "past_guesses": [
    {
      "exact": 3,
      "near": 0,
      "guess": "YOMYYCMY"
    }
  ],
  "solved": false,
  "result": {
    "exact": 3,
    "near": 0,
    "guess": "YOMYYCMY"
  }
}
```

## POST /join - Join Game
To join a multiplayer game execute the following HTTP request with the invite_key generated when first creating the game:
```
REQUEST: 

POST /join HTTP/1.1
Host: localhost:1337
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: 12b5ad67-cc41-ee60-7cb5-f1696c7bfc4a

{
    "user": "John Doe",
    "game_key": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.NzM.dW44PnJHhzEDtdb_EKVapm0rCoOcsd2SL9Qs6GCPtuc"
}

RESPONSE:

{
  "user": "Jane Doe",
  "colors": [
    "R",
    "B",
    "G",
    "Y",
    "O",
    "P",
    "C",
    "M"
  ],
  "positions": 8,
  "user_guesses_attempts": 0,
  "user_past_guesses": [],
  "guest_guesses_attempts": 0,
  "guest_past_guesses": [],
  "solved": false,
  "guest": "Jane Doe",
  "game_key": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJnYW1lIjo3NCwidXNlciI6IkphbmUgRG9lIiwibXVsdGlwbGF5ZXIiOnRydWV9.PErRQcBiayhlPu9jyVexJoGtMfRcWtBw7QOFKbEZ7U8"
}
```