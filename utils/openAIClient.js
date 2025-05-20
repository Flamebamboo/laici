import OpenAI from 'openai';

const client = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

export async function generateProductImageWithEdit({ imageUri, answers, setImage }) {
  const promptParts = [];
  if (answers.background) promptParts.push(`Background: ${answers.background}`);
  if (answers.lighting) promptParts.push(`Lighting: ${answers.lighting}`);
  if (answers.format) promptParts.push(`Format: ${answers.format}`);
  if (answers.audience) promptParts.push(`Target audience: ${answers.audience}`);
  if (answers.tone) promptParts.push(`Tone: ${answers.tone}`);
  promptParts.unshift('Keep the product unchanged, only modify the background and style as described.');
  const prompt = promptParts.join('. ');

  try {
    const url = await generateImage({ imageUri, prompt });
    if (setImage) setImage(url);
    return url;
  } catch (error) {
    console.error('Error in generateProductImageWithEdit:', error);
    throw error;
  }
}
