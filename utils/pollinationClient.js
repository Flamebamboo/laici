import { convertToBase64 } from './imageUtils';

/*
Comparison between convertToBase64 and fileToBase64:

1. Input differences:
   - convertToBase64: Takes a URI string (like 'file:///path/to/image.jpg' or remote URL)
   - fileToBase64: Takes a File/Blob object directly

2. Processing flow:
   - convertToBase64: Fetches the resource from URI → converts to blob → converts blob to base64
   - fileToBase64: Directly converts File/Blob to base64 (no fetch step needed)

3. Use cases:
   - convertToBase64: Used with Expo's ImagePicker which returns URIs
   - fileToBase64: Used with web File inputs or when you already have a Blob object

4. Error handling:
   - convertToBase64: Has try/catch and logs errors
   - fileToBase64: Only has Promise rejection

Both functions ultimately use FileReader.readAsDataURL() to create a base64 data URL.
*/

// const options = [
//   { id: 1, text: 'Pure white background' },
//   { id: 2, text: 'Colored background' },
//   { id: 3, text: 'Transparent (for layering)' },
//   { id: 4, text: 'Lifestyle/environmental setting' },
//   { id: 5, text: 'Textured or abstract' },
// ];

// const quizData = {
//   question: 'What background style do you want for your product photos?',
//   options,
//   answer: options[2].text, //user selected option later
// };

export async function analyzeImage(uri, setImage, answers) {
  const url = 'https://text.pollinations.ai/openai';

  try {
    console.log('Analyzing image with answers:', answers);
    const base64ImageDataUrl = await convertToBase64(uri);

    const payload = {
      model: 'openai',
      messages: [
        {
          role: 'system',
          content: `
    You are a precise product recognition AI. You specialize in identifying consumer electronics from photos, especially headphones. 
    When analyzing a product image, you:
    - Determine the **item type**
    - Identify the most likely **brand** and **model**
    - Accurately describe the **colors**
    - Note any **distinctive design features** that support your conclusion
    Only include verified information, and clearly state if any detail is uncertain. Do not hallucinate. If the image is ambiguous, offer the closest possible match based on known design features (e.g., earcup shape, hinge type, button layout, padding).
    `,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Please analyze the product in this image and extract the following:
    - Item type
    - Brand
    - Model
    - Color(s)
    - Notable design features`,
            },
            {
              type: 'image_url',
              image_url: {
                url: base64ImageDataUrl,
              },
            },
          ],
        },
      ],
      temperature: 0.3,
      max_tokens: 700,
      top_p: 1,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();

    console.log('API RESPONSE:', JSON.stringify(result, null, 2));

    // // Use OpenAI image-to-image edit for more accurate product preservation
    // await generateProductImageWithEdit({ imageUri: uri, answers, setImage });
    TxtToImg(result.choices[0].message.content, setImage, answers);
  } catch (error) {
    console.error('Error analyzing image:', error);
  }
}

export const TxtToImg = (reference, setImage, answers, params = { model: 'openai', nologo: 'true' }) => {
  async function fetchImage() {
    // Extract details from the reference text

    const prompt = `Create an image for ${reference}. With these details. Background: ${answers.background}. Target audience: ${answers.audience}. Tone: ${answers.tone}. 
    Lighting: ${answers.lighting}. 
    Format: ${answers.format}.`;

    console.log('Generated prompt:', prompt);

    const queryParams = new URLSearchParams({ ...params });
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?${queryParams.toString()}`;

    console.log('Fetching image from:', url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const imageBlob = await response.blob();

      // Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Base64 string
      };
      reader.readAsDataURL(imageBlob);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  }

  fetchImage();
};
