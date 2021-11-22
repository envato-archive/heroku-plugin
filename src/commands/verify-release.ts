const chalk = require("chalk");
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

    this.log(
      `Checking app ${chalk.cyan(flags.app)} release ${chalk.cyan(
        `v${String(release).replace("v", "")}`
      )}`
    );

    let releaseInfo;
    let attemptsRemaining = flags.timeout / POLL_INTERVAL;
    while (attemptsRemaining > 0) {
      releaseInfo = await this.getReleaseInfo(flags.app, release);
      if (releaseInfo.status !== "pending") {
        break;
      }

      attemptsRemaining -= 1;
      await sleep(POLL_INTERVAL);
    }

    if (releaseInfo.status === "succeeded") {
      this.log(`Release description: "${releaseInfo.description}"`);
      if (!flags["ignore-current"] && !releaseInfo.current) {
        this.error(`Verification failed, release is not current`, { exit: 3 });
      } else {
        this.log(
          chalk.green(
            `Verification succeeded ${
              releaseInfo.current ? "(current)" : "(not current)"
            }`
          )
        );
      }
    } else if (releaseInfo.status === "pending") {
      this.error(`Timed out waiting for heroku API`, { exit: 124 });
    } else {
      this.error(`Release failed: ${releaseInfo.status}`, { exit: 2 });
    }
  }

  async getLatestRelease(app: string) {
    const response = await this.heroku.get(`/apps/${app}/releases`, {
      partial: true,
      headers: { Range: "version ..; max=1, order=desc" },
    });

    return response.body[0].version;
  }

  async getReleaseInfo(app: string, release: string) {
    if (release) {
      const response = await this.heroku.get(
        `/apps/${app}/releases/${release}`
      );
      return response.body;
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
  "ignore-current": flags.boolean({
    description: "Skip verifying the release is current",
    default: false,
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
