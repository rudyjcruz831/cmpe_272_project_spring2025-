import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface QuestionnaireData {
  budget: string;
  location: string;
  mustHaves: string;
  anyOther: string;
  institution: string;
  hobbies: string;
  userType: 'student' | 'worker' | '';
}

interface SavedAnswer extends QuestionnaireData {
  submittedAt: string;
}

export async function POST(req: Request) {
  try {
    const data: QuestionnaireData = await req.json();
    
    // Only validate the most essential fields
    if (!data.budget.trim()) {
      return NextResponse.json(
        { error: 'Please provide your budget range' },
        { status: 400 }
      );
    }

    // Prepare the answer to save
    const answerToSave: SavedAnswer = {
      ...data,
      submittedAt: new Date().toISOString()
    };

    // Read existing answers
    const filePath = path.join(process.cwd(), 'data', 'quiz_answers.json');
    let answers: SavedAnswer[] = [];
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      answers = JSON.parse(fileContent);
    } catch (error) {
      // If file doesn't exist or is empty, start with empty array
      answers = [];
    }

    // Add new answer
    answers.push(answerToSave);

    // Save updated answers
    await fs.writeFile(filePath, JSON.stringify(answers, null, 2));
    
    return NextResponse.json(
      { 
        message: 'Questionnaire submitted successfully',
        data: answerToSave
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing questionnaire:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 