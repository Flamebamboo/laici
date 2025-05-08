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
    console.error("Error converting image to base64:", error);
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

export async function analyzeImage(uri, question = "What's in this image?") {
  const url = "https://text.pollinations.ai/openai";

  try {
    const base64ImageDataUrl = await convertToBase64(uri);

    const payload = {
      model: "openai", // Ensure vision support
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: question },
            {
              type: "image_url",
              image_url: {
                url: base64ImageDataUrl,
              },
            },
          ],
        },
      ],
    };

    const response = await fetch(url, {
      method: "POST", // a post request means we are sending data to the server
      headers: { "Content-Type": "application/json" }, //headers are metadata about the request
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();

    console.log("API RESPONSE:", JSON.stringify(result, null, 2));

    console.log("Vision Analysis:", result.choices[0].message.content);
  } catch (error) {
    console.error("Error analyzing image:", error);
  }
}
