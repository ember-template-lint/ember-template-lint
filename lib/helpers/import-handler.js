/**
 * Helper to parse imports and map component names
 * @param {string} source - The source code to parse
 * @param {Set<string>} componentNames - Set of component names to look for
 * @returns {Map<string, string>} Map of local name to imported name
 */
export function parseImports(source, componentNames) {
  const importedComponents = new Map();
  const COMPONENT_MODULE_MAP = {
    'component': new Set(['Input', 'Textarea']),
    'routing': new Set(['LinkTo'])
  };

  try {
    // Use a simple regex approach to find imports from '@ember/component' and '@ember/routing'
    // The regex now requires proper closing of the import specifiers
    const importRegex = /import\s+{([^}]+)}\s+from\s+["']@ember\/(component|routing)["']/g;
    let match;

    while ((match = importRegex.exec(source)) !== null) {
      const [, importSpecifiers, moduleName] = match;
      const validComponentsForModule = COMPONENT_MODULE_MAP[moduleName];

      // Skip if we don't have a valid module
      if (!validComponentsForModule) {
        continue;
      }

      // Split by comma and process each import specifier
      const specifiers = importSpecifiers.split(',').map(s => s.trim());

      for (const specifier of specifiers) {
        // Skip empty or malformed specifiers
        if (!specifier || specifier.includes('{') || specifier.includes('}')) {
          continue;
        }

        // Handle "Input" or "Input as CustomInput" format
        const parts = specifier.split(/\s+as\s+/);
        const importedName = parts[0].trim();
        const localName = parts.length > 1 ? parts[1].trim() : importedName;

        // Skip if either name is empty or malformed
        if (!importedName || !localName || !parts[1] && parts.length > 1) {
          continue;
        }

        // Only include if it's in both the componentNames set and valid for this module
        if (componentNames.has(importedName) && validComponentsForModule.has(importedName)) {
          importedComponents.set(localName, importedName);
        }
      }
    }
  } catch {
    // Silently fail if parsing fails
  }

  return importedComponents;
}
