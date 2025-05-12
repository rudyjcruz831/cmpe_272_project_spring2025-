import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const sanitizedQuery = query.replace(/[^a-zA-Z0-9\s,-]/g, '');
    const scriptPath = path.join(process.cwd(), 'redfinscraper', 'RedFinSearchHelper.py');
    const outputPath = path.join(process.cwd(), 'data', 'rental_listings.json');
    const scrapyProjectPath = path.join(process.cwd(), 'redfinscraper');

    console.log('Running Python script:');
    console.log('  Query:', sanitizedQuery);
    console.log('  Script Path:', scriptPath);
    console.log('  Scrapy Project Path:', scrapyProjectPath);

    return new Promise((resolve) => {
      const python = spawn('python', [scriptPath, sanitizedQuery, outputPath, scrapyProjectPath]);

      let stdout = '';
      let stderr = '';

      python.stdout.on('data', (data) => {
        stdout += data.toString();
        console.log(`stdout: ${data}`);
      });

      python.stderr.on('data', (data) => {
        stderr += data.toString();
        console.error(`stderr: ${data}`);
      });

      python.on('close', (code) => {
        console.log(`Python exited with code ${code}`);
        if (code === 0) {
          resolve(NextResponse.json({ success: true, output: stdout.trim() }));
        } else {
          resolve(NextResponse.json({
            error: 'Search failed',
            stderr: stderr.trim(),
            code
          }, { status: 500 }));
        }
      });
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
