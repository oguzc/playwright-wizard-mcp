// Minimal LLM client wrapper for orchestrator
// - If environment variable MOCK_LLM=true or no real provider configured, returns the first example output from the mode as JSON string
// - Otherwise, throws (placeholder for real provider integration)

export async function callLLM(mode, renderedMessages) {
  // If a real provider is configured later, swap logic here
  const useMock = process.env.MOCK_LLM !== 'false';
  if (mode && Array.isArray(mode.examples) && mode.examples.length > 0 && useMock) {
    const example = mode.examples[0];
    // If example has 'output' object, return it as JSON text
    if (example.output) return JSON.stringify(example.output, null, 2);
  }
  throw new Error('No LLM provider configured. Set MOCK_LLM=true and include examples in the mode, or implement provider in llm-client.js');
}

export default { callLLM };
