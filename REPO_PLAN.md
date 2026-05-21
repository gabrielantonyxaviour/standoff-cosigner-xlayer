# REPO PLAN

## Repository

- Owner: `gabrielantonyxaviour`
- Planned public repo name: `standoff-cosigner-xlayer`
- Planned URL: `https://github.com/gabrielantonyxaviour/standoff-cosigner-xlayer`
- Visibility: public

## Owner Verification

- `gh api user --jq '.login'` on 2026-05-21 was corrected to active account `gabrielantonyxaviour`.
- Gabriel is the selected submitter from `submission-profile-registry.json`.

## Creation Method

Use GitHub CLI because the active CLI account is the selected primary owner. If `gh repo create` fails or account mismatch appears, fall back to `agent-browser` with profile `Gabriel` and narrow `github.com` domains.

## Push And Deploy Steps

1. Scaffold and verify locally. Done.
2. `gh repo create gabrielantonyxaviour/standoff-cosigner-xlayer --public --source=. --remote=origin --push`. Done.
3. Confirm repo visibility with `gh repo view`. Done.
4. Optional deploy: Vercel or static artifact after the app builds. Not performed because the required public source/demo path is already available and no irreversible submit action was approved.

## Status

Public repo created and pushed on 2026-05-21:

- URL: `https://github.com/gabrielantonyxaviour/standoff-cosigner-xlayer`
- Visibility: public
- Current pushed commit: `7cdbb13 feat: build standoff co-signer`
