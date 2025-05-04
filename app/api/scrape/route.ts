import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'No query provided' }, { status: 400 });
  }

  // Adjust this path to point to where RedFinSearchHelper.py is located
  const scriptPath = 'C:\Users\sandh\Documents\College work\CMPE 272 Coding\v0-untitled-project-main\app\redfinscraper\RedFinSearchHelper.py';

  // Sanitize input (basic)
  const safeQuery = query.replace(/[^a-zA-Z0-9\s,-]/g, '');

  // Build command
  const command = `python3 "${scriptPath}" "${safeQuery}"`;

  // Run the command
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Exec error: ${error.message}`);
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }
    if (stdout) {
      console.log(`Stdout: ${stdout}`);
    }
  });

  return NextResponse.json({ status: 'Scraping started for: ' + safeQuery });
}