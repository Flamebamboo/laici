import OpenAI from 'openai';
const client = new OpenAI();

const response = await client.responses.create({
  model: 'gpt-3.5-turbo',
  input: 'Write a one-sentence bedtime story about a unicorn.',
});
