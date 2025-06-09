import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generateDocPrompt } from '../../utils/promptTemplates';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const data = await req.json();

  const prompt = generateDocPrompt({
    appName: data.appName,
    description: data.description,
    targetUsers: data.targetUsers,
    features: data.features,
    techStack: data.techStack,
    setupSteps: data.setupSteps,
    usageExamples: data.usageExamples,
    knownLimitations: data.knownLimitations,
    deployment: data.deployment,
    devNotes: data.devNotes,
  });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const result = response.choices[0].message?.content;
    return NextResponse.json({ output: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate' }, { status: 500 });
  }
}
