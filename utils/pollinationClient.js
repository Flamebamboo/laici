const convertToBase64 = async (uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

// Function to encode file to base64 copied from docs
// function fileToBase64(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => resolve(reader.result); // result includes 'data:mime/type;base64,' prefix
//     reader.onerror = reject;
//     reader.readAsDataURL(file);
//   });
// }

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

export async function analyzeImage(
  uri,
  setImage,
  answers,
  question = 'Explain this image as a professional UX designer'
) {
  const url = 'https://text.pollinations.ai/openai';

  try {
    const base64ImageDataUrl = await convertToBase64(uri);

    const payload = {
      model: 'openai',
      messages: [
        {
          role: 'system',
          content: `You are a professional visual designer and art director. 
          You analyze images with a focus on composition, color palette, layout, typography, design trends, and emotional tone. 
          Use precise, creative language and describe the image in detail, as if explaining to a client or design team.`,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Please analyze this image and describe it like a professional designer would.' },
            {
              type: 'image_url',
              image_url: {
                url: base64ImageDataUrl,
              },
            },
          ],
        },
      ],
      temperature: 0.7, // Balanced creativity
      max_tokens: 1200, // Allows for rich, detailed output
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

    TxtToImg(result.choices[0].message.content, setImage, answers);
  } catch (error) {
    console.error('Error analyzing image:', error);
  }
}

export const TxtToImg = (reference, setImage, answers) => {
  async function fetchImage() {
    // Extract details from the reference text

    const prompt = `Create a professional image for a ${reference}.With these details. Background: ${
      answers.background || 'natural'
    }. Target audience: ${answers.audience || 'general'}. Tone: ${answers.tone || 'professional'}. 
    Lighting: ${answers.lighting || 'standard'}. 
    Format: ${answers.format || 'standard'}.`;

    const queryParams = new URLSearchParams();
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
