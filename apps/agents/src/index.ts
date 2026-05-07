// Entry point for Claude-Agent-SDK-based workers.
// Replace this stub with the actual agent loop when you start a real worker
// (e.g. a Telegram bot replying via Claude, a periodic data agent, etc.).

import { greeting } from "@packages/lib";

async function main(): Promise<void> {
  console.log(greeting("agentic engineering"));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
