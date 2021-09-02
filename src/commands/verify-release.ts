const { Command, flags } = require("@heroku-cli/command");

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const POLL_INTERVAL = 1000;

class VerifyRelease extends Command {
  async run() {
    const { flags, args } = this.parse(VerifyRelease);

    let release = args.release;

    if (!release) {
      release = await this.getLatestRelease(flags.app);
    }

    this.log(`Checking ${flags.app} release ${release}`);

    let finalStatus;
    let attemptsRemaining = flags.timeout / POLL_INTERVAL;
    while (attemptsRemaining > 0) {
      finalStatus = await this.getReleaseStatus(flags.app, release);
      if (finalStatus !== "pending") {
        break;
      }

      attemptsRemaining -= 1;
      await sleep(POLL_INTERVAL);
    }

    if (finalStatus === "succeeded") {
      this.log("Verified succeeded");
    } else if (finalStatus === "pending") {
      this.error(`Timed out waiting for heroku API`, { exit: 124 });
    } else {
      this.error(`Release failed: ${finalStatus}`, { exit: 2 });
    }
  }

  async getLatestRelease(app: string) {
    const response = await this.heroku.get(`/apps/${app}/releases`, {
      partial: true,
      headers: { Range: "version ..; max=1, order=desc" },
    });

    return response.body[0].version;
  }

  async getReleaseStatus(app: string, release: string) {
    if (release) {
      const response = await this.heroku.get(
        `/apps/${app}/releases/${release}`
      );
      return response.body.status;
    }
  }
}

VerifyRelease.description = `Verify a successful release 
...
Exits with a non zero exit code when the release failed
`;

VerifyRelease.flags = {
  app: flags.string({
    required: true,
    description: "app name",
  }),
  timeout: flags.string({
    description: "how long should we poll for",
    parse: (input: string) => parseInt(input, 10),
    default: 30000,
  }),
};

VerifyRelease.args = [
  {
    name: "release",
    description: "release number (default: latest)",
  },
];

module.exports = VerifyRelease;
