# @egulatee/sops-secrets

Load SOPS-encrypted secrets for use in Pulumi TypeScript projects.

## Install

```bash
npm install @egulatee/sops-secrets
```

## Usage

```typescript
import { loadSecrets } from "@egulatee/sops-secrets";

// Decrypt any SOPS-encrypted file from kubernetes-architecture/secrets/
const s = loadSecrets("cloudflared");
s.cloudflare.account_id
s.cloudflare.zone_id
s.cloudflare.tunnel_token

// Kubeconfig follows the same pattern
const kubeconfig = loadSecrets("kubeconfig").kubeconfig;
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SOPS_SECRETS_DIR` | CI only | Absolute path to `secrets/` directory. Defaults to `../kubernetes-architecture/secrets` relative to `cwd`. |
| `SOPS_AGE_KEY` | CI only | Age private key for decryption. Locally, SOPS reads `~/.config/sops/age/keys.txt` automatically. |

## How it works

1. `loadSecrets(name)` calls `sops -d --output-type json secrets/<name>.enc.yaml`
2. Returns the parsed JSON object
3. Plaintext values only exist in memory during `pulumi up` — never written to disk

## Requirements

- [`sops`](https://github.com/mozilla/sops) must be installed and on `PATH`
- An Age key must be available (local keyfile or `SOPS_AGE_KEY` env var)
