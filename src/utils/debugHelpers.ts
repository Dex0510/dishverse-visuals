
/**
 * Helper function to log detailed information about variables for debugging
 * @param variableName The name of the variable for context
 * @param value The variable value to inspect
 */
export const debugLog = (variableName: string, value: any) => {
  console.log(`DEBUG ${variableName}:`, {
    value,
    type: typeof value,
    isArray: Array.isArray(value),
    toString: String(value)
  });
};
