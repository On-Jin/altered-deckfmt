#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fromUrl from "./from-url.js";

yargs(hideBin(process.argv))
  .command(
    'from_url [url]',
    'Convert a decklist from a URL (e.g. https://www.altered.gg/decks/ABCD123)',
    (yargs) => {
      return yargs
        .positional('url', {
          describe: 'The URL of the decklist to convert',
          type: 'string',
          demandOption: true,
        })
    },
    async (argv) => {
      if (argv.url) {
        await fromUrl(argv.url)
        process.exit(0)
      }
      else {
        console.error("No URL provided")
        process.exit(1)
      }
    }
  )
  .parse()
