import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as child_process from "child_process";
import { loadSecrets } from "../src/secrets";

vi.mock("child_process", () => ({
    execSync: vi.fn(),
}));

const mockExecSync = vi.mocked(child_process.execSync);

describe("loadSecrets", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        delete process.env.SOPS_SECRETS_DIR;
    });

    afterEach(() => {
        delete process.env.SOPS_SECRETS_DIR;
    });

    it("decrypts a named SOPS file and returns parsed JSON", () => {
        const payload = { cloudflare: { account_id: "abc", zone_id: "xyz" } };
        mockExecSync.mockReturnValue(JSON.stringify(payload) as any);

        const result = loadSecrets("cloudflared");

        expect(result).toEqual(payload);
        expect(mockExecSync).toHaveBeenCalledWith(
            expect.stringMatching(/sops -d --output-type json ".*cloudflared\.enc\.yaml"/),
            { encoding: "utf-8" }
        );
    });

    it("uses SOPS_SECRETS_DIR env var when set", () => {
        process.env.SOPS_SECRETS_DIR = "/ci/secrets";
        mockExecSync.mockReturnValue(JSON.stringify({ key: "val" }) as any);

        loadSecrets("certmanager");

        expect(mockExecSync).toHaveBeenCalledWith(
            expect.stringContaining("/ci/secrets/certmanager.enc.yaml"),
            { encoding: "utf-8" }
        );
    });

    it("falls back to ../kubernetes-architecture/secrets relative to cwd", () => {
        delete process.env.SOPS_SECRETS_DIR;
        mockExecSync.mockReturnValue(JSON.stringify({}) as any);

        loadSecrets("externaldns");

        expect(mockExecSync).toHaveBeenCalledWith(
            expect.stringContaining("kubernetes-architecture/secrets/externaldns.enc.yaml"),
            { encoding: "utf-8" }
        );
    });

    it("kubeconfig is accessed via loadSecrets('kubeconfig').kubeconfig", () => {
        const kubeconfig = "apiVersion: v1\nkind: Config";
        mockExecSync.mockReturnValue(JSON.stringify({ kubeconfig }) as any);

        const result = loadSecrets("kubeconfig");

        expect(result.kubeconfig).toBe(kubeconfig);
    });

    it("propagates errors from sops (file missing, decryption failure, etc.)", () => {
        mockExecSync.mockImplementation(() => {
            throw new Error("sops: failed to get the data key");
        });

        expect(() => loadSecrets("missing")).toThrow("sops: failed to get the data key");
    });
});
