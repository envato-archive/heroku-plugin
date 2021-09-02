const { Command, flags } = require("@heroku-cli/command");

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const POLL_INTERVAL = 1000;

class VerifyRelease extends Command {
  async run() {
    const { flags, args } = this.parse(VerifyRelease);
    this.log(`Checking ${flags.app} release ${args.release}`);

    let finalStatus;
    let attemptsRemaining = flags.timeout / POLL_INTERVAL;
    while (attemptsRemaining > 0) {
      const response = await this.heroku.get(
        `/apps/${flags.app}/releases/${args.release}`
      );

      finalStatus = response.body.status;
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
    required: true,
    description: "release number",
  },
];

module.exports = VerifyRelease;
