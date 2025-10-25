import fs from 'fs-extra';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

async function main() {
  const modePath = path.resolve(process.cwd(), '..', '..', '.github', 'chat-modes', '01-analyze-app.json');
  if (!await fs.pathExists(modePath)) {
    console.error('Mode file not found:', modePath);
    process.exit(2);
  }

  const raw = await fs.readFile(modePath, 'utf8');
  let mode;
  try {
    mode = JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse JSON:', e.message);
    process.exit(2);
  }

  // Basic shape checks
  const requiredTop = ['meta','messages','output_schema'];
  for (const k of requiredTop) {
    if (!(k in mode)) {
      console.error(`Missing top-level property: ${k}`);
      process.exit(2);
    }
  }

  if (!Array.isArray(mode.messages) || mode.messages.length === 0) {
    console.error('messages must be a non-empty array');
    process.exit(2);
  }

  // Validate output_schema is a valid JSON Schema by compiling an Ajv validator
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);

  let validate;
  try {
    validate = ajv.compile(mode.output_schema);
  } catch (e) {
    console.error('output_schema is not a valid JSON Schema:', e.message);
    process.exit(2);
  }

  // Smoke-validate the examples if present
  if (Array.isArray(mode.examples) && mode.examples.length) {
    for (const ex of mode.examples) {
      if (!('output' in ex)) continue;
      const valid = validate(ex.output);
      if (!valid) {
        console.error('Example output does not validate against output_schema:');
        console.error(ajv.errorsText(validate.errors, {separator: '\n'}));
        process.exit(2);
      }
    }
  }

  console.log('Mode JSON basic checks passed. output_schema compiled successfully.');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(2);
});
