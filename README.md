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

The Murdoku player lives at `/murdoku/play/`: the generated collection, daily cases,
training and hints. The 24×24 museum opens at `/murdoku/play/?case=museum`.
The research casebook, with its browser Python engine, lives at `/murdoku/play/lab/`.
Legacy `/murdoku/exp/` links redirect to the player, preserving query parameters and hashes.

Rebuild from the `murdoku-lab` repository with:

```bash
python scripts/build_play.py --site-url https://everywheresafety.github.io/murdoku/play/
```

Replace `murdoku/play/` with the contents of `dist/`. This complete build includes
30 library cases, 14 locked daily cases, artwork and the Lab's locally hosted Pyodide
runtime. Keep the compatibility redirects under `murdoku/exp/`.

Blog articles are built from the EverywhereSafety `blog` repository with
`python build.py --output ../EverywhereSafety.github.io/blog`.
