import fs from "fs";
import path from "path";

export function listFiles(dirName: string): string[] {
  return listFilesRecursive(dirName, true);
}

export const throwEx = <Exception extends Error>(
  exception: Exception
): never => {
  throw exception;
};

const listFilesRecursive = (
  dirName: string,
  isRootModule: boolean
): string[] => {
  const entries = fs.readdirSync(dirName, { withFileTypes: true });
  const files: string[] = [];
  const dirs: string[] = [];

  let isSubModuleDir = false;

  entries.forEach((e) => {
    // Get the full path to the entry.
    const p = path.join(dirName, e.name);

    // Split the entry into one of the lists: file or directory.
    if (e.isDirectory()) {
      dirs.push(p);
    } else {
      files.push(p);

      // Check if this directory is a separate submodule.
      if (
        !isRootModule &&
        (p.endsWith(".module.ts") || p.endsWith(".module.js"))
      ) {
        isSubModuleDir = true;
      }
    }
  });

  // If this directory is a submodule, we want to ignore it from autoloading.
  if (isSubModuleDir) {
    return [];
  }

  // Recurse into all subdirectories.
  dirs.forEach((d) => files.push(...listFilesRecursive(d, false)));

  return files;
};

export const isScript = (name: string): boolean => {
  return (
    // Include js and ts files.
    (name.endsWith(".js") || name.endsWith(".ts")) &&
    // Exclude type mappings.
    !name.endsWith(".d.ts") &&
    // Exclude test-related files.
    !name.endsWith(".test.ts") &&
    !name.endsWith(".spec.ts") &&
    !name.endsWith(".test.js") &&
    !name.endsWith(".spec.js")
  );
};
