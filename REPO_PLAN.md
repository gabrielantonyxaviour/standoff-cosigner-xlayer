# REPO PLAN

## Repository

- Owner: `gabrielantonyxaviour`
- Planned public repo name: `standoff-cosigner-xlayer`
- Planned URL: `https://github.com/gabrielantonyxaviour/standoff-cosigner-xlayer`
- Visibility: public

## Owner Verification

- `gh auth status` on 2026-05-21 shows active account `gabrielantonyxaviour`.
- Gabriel is the selected submitter from `submission-profile-registry.json`.

## Creation Method

Use GitHub CLI because the active CLI account is the selected primary owner. If `gh repo create` fails or account mismatch appears, fall back to `agent-browser` with profile `Gabriel` and narrow `github.com` domains.

## Push And Deploy Steps

1. Scaffold and verify locally.
2. `gh repo create gabrielantonyxaviour/standoff-cosigner-xlayer --public --source=. --remote=origin --push`
3. Confirm repo visibility with `gh repo view`.
4. Optional deploy: Vercel or static artifact after the app builds.

## Status

Not created at initial planning time. Creation happens after the first implementation and verification pass so the public repo is not an empty shell.
