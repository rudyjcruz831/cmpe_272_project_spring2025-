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
    
    // Run the RedFinSearchHelper.py script with the search query
    const scriptPath = path.join(process.cwd(), 'redfinscraper', 'RedFinSearchHelper.py');

    const outputPath = path.join(process.cwd(), 'data', 'rental_listings.json');

    const scrapyProjectPath = path.join(process.cwd(), 'redfinscraper');

    const pythonProcess = spawn('python', [scriptPath, sanitizedQuery, outputPath, scrapyProjectPath]);

    // Log for debugging
    console.log('Running Python script with:');
    console.log('Search query:', sanitizedQuery);
    console.log('Output file:', outputPath);
    console.log('Scrapy project directory:', scrapyProjectPath);


    return new Promise((resolve) => {
      const pythonProcess = spawn('python', [scriptPath, sanitizedQuery, outputPath, scrapyProjectPath]);
      
      pythonProcess.stdout.on('data', (data) => {
        console.log(`Python script output: ${data}`);
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python script error: ${data}`);
      });

      pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
        
        if (code === 0) {
          // Script completed successfully
          resolve(NextResponse.json({ success: true, message: 'Search completed successfully' }));
        } else {
          // Script failed
          resolve(NextResponse.json({ error: 'Search failed' }, { status: 500 }));
        }
      });
    });
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 