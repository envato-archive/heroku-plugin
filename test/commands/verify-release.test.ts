import { expect, test } from "@oclif/test";

describe("verify-release", () => {
  describe("succeeded", () => {
    test
      .nock("https://api.heroku.com", (api) =>
        api
          .get(`/apps/my-app/releases/v1`)
          .once()
          .reply(() => {
            return [200, { status: "succeeded" }];
          })
      )
      .stdout()
      .command(["verify-release", "v1", "--app", "my-app"])
      .it("runs verify-release", (ctx) => {
        expect(ctx.stdout).to.contain("Verified succeeded");
      });
  });

  describe("succeeded latest", () => {
    test
      .nock("https://api.heroku.com", (api) => {
        api
          .get(`/apps/my-app/releases`)
          .once()
          .reply(200, [{ version: "latest" }]);
        api
          .get(`/apps/my-app/releases/latest`)
          .once()
          .reply(200, { status: "succeeded" });
      })
      .stdout()
      .command(["verify-release", "--app", "my-app"])
      .it("runs verify-release", (ctx) => {
        expect(ctx.stdout).to.contain("Verified succeeded");
      });
  });

  describe("pending then succeeded", () => {
    test
      .nock("https://api.heroku.com", (api) => {
        api
          .get(`/apps/my-app/releases/v1`)
          .twice()
          .reply(200, { status: "pending" });
        api
          .get(`/apps/my-app/releases/v1`)
          .once()
          .reply(200, { status: "succeeded" });
      })
      .stdout()
      .command(["verify-release", "v1", "--app", "my-app"])
      .it("runs verify-release", (ctx) => {
        expect(ctx.stdout).to.contain("Verified succeeded");
      });
  });

  describe("pending then failed", () => {
    test
      .nock("https://api.heroku.com", (api) => {
        api
          .get(`/apps/my-app/releases/v1`)
          .twice()
          .reply(200, { status: "pending" });
        api
          .get(`/apps/my-app/releases/v1`)
          .once()
          .reply(200, { status: "failed" });
      })
      .stdout()
      .command(["verify-release", "v1", "--app", "my-app"])
      .exit(2)
      .it("exits with status 2");
  });

  describe("pending then timeout", () => {
    test
      .nock("https://api.heroku.com", (api) => {
        api
          .get(`/apps/my-app/releases/v1`)
          .thrice()
          .reply(200, { status: "pending" });
      })
      .stdout()
      .command(["verify-release", "v1", "--app", "my-app", "--timeout", "3000"])
      .exit(124)
      .it("exits with status 124");
  });
});
