# Shonen Sprint

A side-scrolling chase runner built from scratch in **vanilla JavaScript and HTML5 Canvas**, with no game engine or framework.
You play an anime hero escaping a pursuer across three themed levels, timing jumps over obstacles to
reach the portal at the end of each stage.

Built as a team project for TCSS 491 at the University of Washington Tacoma.

## Levels

| Level | Hero | Pursuer | Hazards |
|---|---|---|---|
| 1 | Goku | Majin Buu | crates and street obstacles |
| 2 | Gojo | Toji | cars and trucks |
| 3 | Naruto | Pain, Konan, Sasori and his puppet | rocks, crates, and projectiles |

Reach the portal to advance. Get caught and it's game over.

## Controls

| Action | Keys |
|---|---|
| Move | ← → or A / D |
| Jump | ↑ or W |

## Run it

The game loads its sprites and audio over HTTP, so serve the folder instead of opening the file directly:

```bash
git clone https://github.com/Pr1nceAli/Shonen-Sprint.git
cd Shonen-Sprint
python -m http.server 8000      # or: npx serve .
```

Then open http://localhost:8000 and pick a level from the main menu.

## How it's built

A small hand-written engine shared by every level:

| Piece | Role |
|---|---|
| `classes/GameEngine.js` | game loop, keyboard input, entity update/draw cycle |
| `classes/AssetManager.js` | preloads images and audio before a level starts |
| `classes/Animator.js` | sprite-sheet animation (frame timing, looping, scaling) |
| `classes/Camera.js` | side-scrolling camera that follows the player |
| `classes/Entity.js`, `Obstacle.js` | base classes that heroes, pursuers and hazards extend |
| `classes/HUD.js`, `Timer.js` | on-screen status and level timer |
| `levelN/index.js` | builds each level: background, hero, pursuer, obstacle layout, portal |

Each hero, pursuer and obstacle is its own class extending these bases, so adding a level means composing
existing pieces rather than changing the engine.

## Design goals

The original design doc pitched a longer game: more themed worlds (Shibuya Station, Kyoto temples, Soul Society,
Planet Namek), power-ups, unlockable skins, adaptive pursuer AI and a leaderboard. The three playable levels
above are the version the team built and shipped.

## Team

Faiz Ahmed · Aly Badr · Dmitry Khotinskiy · Elle Pavenko
