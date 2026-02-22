import { describe, it, expect } from "vitest";
import * as pkg from "../src/index";

describe("package exports", () => {
    it("exports loadSecrets as a function", () => {
        expect(typeof pkg.loadSecrets).toBe("function");
    });

    it("does not export loadKubeconfig (use loadSecrets('kubeconfig').kubeconfig instead)", () => {
        expect((pkg as any).loadKubeconfig).toBeUndefined();
    });
});
