import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🧪 Starting Automated Test Harness for CLI Screenshot Auto-Save...');

try {
  // 1. Run Python screenshot script
  const stdout = execSync('python scratch/save_clipboard_image.py', { encoding: 'utf-8' });
  console.log('📄 Script Output:\n' + stdout);

  // 2. Extract saved file path from output
  const match = stdout.match(/저장 경로:\s*(.+)/);
  if (!match) {
    throw new Error('Script output did not contain valid "저장 경로:"');
  }

  const savedPath = match[1].trim();
  console.log(`🔍 Checking saved screenshot file at: ${savedPath}`);

  // 3. Verify file existence and size
  if (!fs.existsSync(savedPath)) {
    throw new Error(`Saved screenshot file does not exist at ${savedPath}`);
  }

  const stats = fs.statSync(savedPath);
  if (stats.size === 0) {
    throw new Error(`Saved screenshot file is empty (0 bytes) at ${savedPath}`);
  }

  console.log(`✅ Screenshot file created successfully! File size: ${stats.size} bytes.`);
  console.log('🎉 AUTOMATED SCREENSHOT TEST PASSED!');
  process.exit(0);
} catch (err) {
  console.error('❌ Automated Screenshot Test Failed:', err.message);
  process.exit(1);
}
