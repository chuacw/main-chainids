import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config'
import assert from 'assert';
import { IncludeTrailingPathDelimiter } from 'delphirtl/sysutils';


type ChainData = { name: string; chainId: number };
async function loadAndSortJsonFiles(dir: string): Promise<ChainData[]> {
  const files = fs.readdirSync(dir);
  const chainData: ChainData[] = [];

  for (const file of files) {
    // Only process .json files
    if (path.extname(file) === '.json') {
      const filePath = path.join(dir, file);
      const data = fs.readFileSync(filePath, 'utf-8');

      try {
        const jsonData = JSON.parse(data);
        const { name, chainId } = jsonData;

        if (name && typeof chainId === 'number') {
          chainData.push({ name, chainId });
        }
      } catch (err) {
        console.error(`Failed to parse JSON in file: ${file}`, err);
      }
    }
  }

  // Sort by chainId
  const result = chainData.sort((a, b) => a.chainId - b.chainId);
  assert(result.length === 1897, "Chain length has changed!");
  return result;
}

// Function to save result of loadAndSortJsonFiles into a TypeScript constant array and write it to a file
async function saveToFile(JSON_dir: string, target_dir: string, filename: string): Promise<string> {
  const sortedArray = await loadAndSortJsonFiles(JSON_dir);

  // Create TypeScript constant string
  const tsConstant = `export const sortedChainData = ${JSON.stringify(sortedArray, null, 2)};\n`;

  const target = IncludeTrailingPathDelimiter(target_dir) + filename;
  // Write to the specified file
  fs.writeFileSync(target, tsConstant, 'utf-8');
  return target;
}

// Example usage:
const JSON_dir = process.env.JSON_dir || "."; 
const target_dirPath = process.env.target_dirPath || ".";
const outputFile = 'chainId-const.ts';

assert(JSON_dir !== "." && target_dirPath !== ".", "Unexpected JSON input dir or target dir");

async function main() {
  try {
    const savedFileName = await saveToFile(JSON_dir, target_dirPath, outputFile);
    console.log(`File successfully saved to ${savedFileName}.`);
  } catch(err)  {
    console.error('Error saving to file: ', err);
  };
}

main();