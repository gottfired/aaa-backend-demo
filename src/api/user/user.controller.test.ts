import { expect } from "@aaa-backend-stack/test-environment";
import Request from "../../test/Request";

describe("PATCH /api/v1/user/profile", function () {

    it("patch beer data", async () => {

        const data = {
            likedBeerIds: [1, 2, 3],
            commentsMap: {
                1: "comment1",
                5: "comment5"
            }
        };

        const res = await Request.create("PATCH", "/api/v1/user/profile", { user: "user1" }).send({
            data: data
        });

        expect(res).to.have.status(200);
        expect(res.body.data).to.eql(data);

    });
});
