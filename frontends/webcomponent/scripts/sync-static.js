/**
 * Sync the built webcomponent bundle into the static demo directory.
 *
 * The demo pages load /static/querymind-components.js directly, so we keep
 * that file aligned with the latest dist build output.
 */

const fs = require('fs');
const path = require('path');

const SOURCE = path.join(__dirname, '../dist/querymind-components.js');
const TARGET = path.join(__dirname, '../static/querymind-components.js');

function main() {
  if (!fs.existsSync(SOURCE)) {
    throw new Error(`Missing build artifact: ${SOURCE}`);
  }

  fs.copyFileSync(SOURCE, TARGET);
  console.log(`✓ Synced ${path.relative(process.cwd(), SOURCE)} -> ${path.relative(process.cwd(), TARGET)}`);
}

main();
