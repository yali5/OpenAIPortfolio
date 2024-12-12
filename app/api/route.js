import { AzureOpenAI } from 'openai';
import { AzureKeyCredential } from '@azure/core-auth';
import { NextResponse } from 'next/server';

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = process.env.AZURE_OPENAI_APIVERSION;
const deploymentId = process.env.AZURE_DEPLOYMENT_ID;
const DATA_RESUME = process.env.DATA_RESUME;

const apiKeyfinal = new AzureKeyCredential(apiKey);

// Validate the environment variables are set
if (!endpoint || !apiKey || !deploymentId || !apiVersion || !DATA_RESUME) {
    throw new Error("Missing required environment variables.");
  }

export async function POST(req){

    const { messages } = await req.json();

    // Parse incoming request JSON
    console.log("Request JSON parsed:", messages); // Error logging sucess: JSON logged

    // Initialize the Azure OpenAI client
    const openai = new AzureOpenAI({
        credential: new AzureKeyCredential(apiKey),
        endpoint: endpoint,
        apiVersion: apiVersion,
        deploymentId: deploymentId,
        }); //changed client to openai, changed to credential, added apiVersion, changed endpoint, lots of changes here dependant on version, ApiKey or Token auth

    console.log("Azure OpenAI client initialized:", openai); //Error logging failure. Initialisation error confirmed

    // Add system-level context to the messages
    messages.unshift({
        role: 'system',
        content: `You are PortfolionLLM, answering only questions based on the resume provided.
Resume: ${DATA_RESUME}

Help users learn more about Yassaha from his resume.`
    });

try {
    console.log("Preparing to send API request..."); // Check for API call to Azure is successful. Success
    const response = await openai.completions.create({ 
        model: deploymentId, //This was previous mis-unserstood to mean model
        prompt: messages.map((msg) => msg.content).join("\n"),
        max_tokens: 128,
    });

    console.log("Full OpenAI Response:", response);

    // Check if the response is valid and has a message
    if (response && response.choices && response.choices.length > 0) {
        console.log("AI Response:", response.choices[0].text); // Or .message depending on the structure
    } else {
        console.log("No choices returned in the response.");
    }
} catch (error) {
    console.error("Error during API request:", error);
    // Log additional details if available
    if (error.response) {
        console.error("API Response Error:", error.response.data);
    }
    return NextResponse.json({ error: 'Error during OpenAI request' }, { status: 500 });
    }
}