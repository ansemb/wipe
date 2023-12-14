import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/mod.ts";

const NAME = "wipe";
const VERSION = "0.0.2";

const error = colors.bold.red;

await new Command()
  .name(NAME)
  .version(VERSION)
  .description("Wipes files or directories.")
  .option(
    "-r, --recursive",
    "Attempt to remove the file hierarchy rooted in each file argument.",
  )
  .option(
    "-f, --force",
    "Attempt to remove the files without prompting for confirmation, regardless of the file's permissions.  If the file does not exist, do not display a diagnostic message or modify the exit status to reflect an error.",
  )
  .arguments("<dirs...>")
  .action((options, ...args) => {
    const futures = [];

    const { recursive, force } = options;

    let encounteredError = false;

    for (const p of args) {
      const f = Deno.remove(p, { recursive }).catch((e) => {
        if (force) return;

        encounteredError = true;
        console.log(error(`[${NAME}]: ${e.message}`));
      });
      futures.push(f);
    }

    Promise.all(futures);

    if (encounteredError && !force) {
      Deno.exit(1);
    }
  })
  .parse(Deno.args);
