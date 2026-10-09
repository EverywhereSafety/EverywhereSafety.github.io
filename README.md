# Everywhere Safety website

Central website for Everywhere Safety and its research projects.

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Project paths

- `/turngate/`
- `/cka-agent/`
- `/sead/`
- `/murdoku/`
- `/agent-horizon/`
- `/blog/`
- `/blog/murdoku-as-vhd/`
- `/ea-privacy/`
- `/immerse-privacy/`

Murdoku Lab's interactive frontend is a separate Python service. The static
project page introduces the game and links to code, queries and Blog. A future
Play service can use `/play/` as its entry point or a custom domain.

Blog articles are built from the EverywhereSafety `blog` repository with
`python build.py --output ../EverywhereSafety.github.io/blog`.
