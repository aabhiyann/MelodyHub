import { describe, it, expect } from '@jest/globals';

describe("ActivityService Sanity Check", () => {
    it("should pass a basic truthy test", () => {
        expect(true).toBe(true);
    });

    it("should be able to import the service (smoke test)", async () => {
        // Dynamic import to avoid top-level await issues if any
        const { ActivityService } = await import("../services/activity.service.js");
        const service = new ActivityService();
        expect(service).toBeDefined();
    });
});
