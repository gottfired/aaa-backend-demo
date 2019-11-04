import { expect, snapshots } from "@aaa-backend-stack/test-environment";

import Request from "../test/Request";

describe("GET /app/v1/beers-info", function () {

    const SNAPSHOT_FILE = snapshots.getSnapshotFile("Beers.snap");

    it("should allow getting a global beers-info", async () => {
        const res = await Request.create("GET", "/app/v1/beers-info");

        expect(res).to.have.status(200);
        expect(snapshots.prepareSnapshot(res.body)).to.matchSnapshot(SNAPSHOT_FILE, "GET /app/v1/beers-info");
    });

});
