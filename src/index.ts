/**
 * @egulatee/sops-secrets
 *
 * Load SOPS-encrypted secrets for use in Pulumi TypeScript projects.
 *
 * All secrets live in `kubernetes-architecture/secrets/*.enc.yaml`.
 * This package decrypts them at runtime using the `sops` CLI.
 * Plaintext values only exist in memory during `pulumi up`.
 *
 * ## Usage
 *
 * ```typescript
 * import { loadSecrets } from "@egulatee/sops-secrets";
 *
 * const secrets = loadSecrets("cloudflared");
 * // secrets.cloudflare.account_id, secrets.cloudflare.zone_id, etc.
 *
 * // kubeconfig is a regular secret — no special function needed
 * const kubeconfig = loadSecrets("kubeconfig").kubeconfig;
 * ```
 *
 * ## Environment Variables
 *
 * - `SOPS_SECRETS_DIR`: Absolute path to the secrets directory.
 *   Required in CI. Defaults to `../kubernetes-architecture/secrets`
 *   relative to `process.cwd()`.
 *
 * - `SOPS_AGE_KEY`: Age private key for decryption (required in CI).
 *   Locally, SOPS uses `~/.config/sops/age/keys.txt` automatically.
 *
 * @packageDocumentation
 */

export { loadSecrets } from "./secrets";
