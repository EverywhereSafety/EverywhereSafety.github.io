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

Murdoku Lab's playable casebook lives at `/murdoku/play/` and runs its Python
engine in the browser. The 24×24 museum case opens at
`/murdoku/play/?case=museum`.

Rebuild it from the `murdoku-lab` repository with `python scripts/build_play.py`,
then copy its `dist/` output into `murdoku/play/`. The bundle includes the native
engine, built-in cases, artwork and locally hosted Pyodide runtime.

Blog articles are built from the EverywhereSafety `blog` repository with
`python build.py --output ../EverywhereSafety.github.io/blog`.
