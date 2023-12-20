const functions = require('@google-cloud/functions-framework');
const {VertexAI} = require('@google-cloud/vertexai');

const vertex_ai = new VertexAI({project: '<YOUR_PROJECT_ID>', location: '<YOUR_PROJECT_REGION>'});
const model = 'gemini-pro-vision';

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generation_config: {
    "max_output_tokens": 2048,
    "temperature": 0.4,
    "top_p": 1,
    "top_k": 32
},
});

functions.http('helloHttp', async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Credentials", "true");
  res.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  );
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
    /*
    If the request method is not OPTIONS, it extracts the image from the request body and uses it to
    prompt the model. 
    */
  } else {
    let base64Image = req.body.image || req.query.image;
    base64Image = base64Image.split(';base64,').pop();

      async function generateContent() {
        const req = {
          contents: [{role: 'user', parts: [{inline_data: {mime_type: 'image/jpeg', data: base64Image}}, 
              {text: 'Write a creative Sherlock Holmes first chapter story inspired by this image.'}]}],
        };
        const response = await generativeModel.generateContent(req);
        const aggregatedResponse = await response.response;
        const fullTextResponse =
            aggregatedResponse.candidates[0].content.parts[0].text;
        return fullTextResponse;
    }
    const text = await generateContent() 
    res.status(200).send({answer:text});
  }
});
