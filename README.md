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

Copy the contents of `dist/` over `murdoku/play/`, keeping its `daily/`, `og/` and `d/`
folders. This build includes 30 library cases, artwork and the Lab's locally hosted Pyodide
runtime. Keep the compatibility redirects under `murdoku/exp/`.

Daily cases stay in a private Hugging Face dataset until they are due. The
`.github/workflows/murdoku-daily.yml` workflow runs once a day and commits them to those
three folders. A new case opens at 00:00 UTC. See the
[daily guide](https://github.com/EverywhereSafety/murdoku-lab/blob/main/docs/guides/daily.md#daily-release)
for its setup and what to do when it fails.

Blog articles are built from the EverywhereSafety `blog` repository with
`python build.py --output ../EverywhereSafety.github.io/blog`.
