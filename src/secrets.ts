import { execSync } from "child_process";
import * as path from "path";

/**
 * Resolves the directory containing `*.enc.yaml` secret files.
 *
 * Precedence:
 *   1. `SOPS_SECRETS_DIR` env var (required in CI)
 *   2. `../kubernetes-architecture/secrets` relative to cwd (local dev)
 */
function getSecretsDir(): string {
    if (process.env.SOPS_SECRETS_DIR) {
        return process.env.SOPS_SECRETS_DIR;
    }
    return path.resolve(process.cwd(), "../kubernetes-architecture/secrets");
}

/**
 * Decrypts a SOPS-encrypted YAML file and returns the parsed object.
 *
 * @param name - File basename without extension, e.g. `"cloudflared"` for
 *               `secrets/cloudflared.enc.yaml`
 *
 * @example
 * ```typescript
 * const s = loadSecrets("cloudflared");
 * s.cloudflare.account_id   // string
 * s.cloudflare.zone_id      // string
 * s.cloudflare.tunnel_token // string
 * ```
 */
export function loadSecrets(name: string): Record<string, any> {
    const filePath = path.join(getSecretsDir(), `${name}.enc.yaml`);
    const raw = execSync(`sops -d --output-type json "${filePath}"`, {
        encoding: "utf-8",
    });
    return JSON.parse(raw);
}

