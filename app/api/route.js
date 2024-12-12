import { AzureOpenAI } from 'openai'; //legacy platform
import { OpenAI } from 'openai';
import { AzureKeyCredential } from '@azure/core-auth'; //legacy platform
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

export async function POST(req) {

    try {
        // Parse incoming request JSON
        const { messages } = await req.json();

        if (!Array.isArray(messages) || messages.length === 0) {
            throw new Error("The 'messages' parameter is missing or invalid.");
        }

        console.log("Received messages:", messages);

        // Add system-level context to the messages
        messages.unshift({
        role: 'system',
        content: `You are PortfolionLLM, answering only questions based on the resume provided.
        Resume: ${DATA_RESUME}
    
        Help users learn more about Yassaha from his resume.`
            });

        // Initialize the Azure OpenAI client
        const client = new OpenAI({
            credential: new AzureKeyCredential(apiKey),
            endpoint: endpoint,
            apiVersion: apiVersion,
            deploymentId: deploymentId,
            apiKey: apiKey,
            }); //changed client to openai, changed to credential, added apiVersion, changed endpoint, lots of changes here dependant on version, ApiKey or Token auth

        console.log("Azure OpenAI client initialized:", client);

        // Send the request to the Azure OpenAI API
        console.log("Preparing to send API request...");

        const response = await client.chat.completions.create({
            model: deploymentId,
            messages: messages, //.map((msg) => msg.content).join("\n"),
            temperature: 1,
            max_tokens: 128,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        })

        // Check if the response contains a valid message and return it
        if (response.choices && response.choices[0].message) {
            return NextResponse.json({ message: response.choices[0].message.content });
        } else {
        throw new Error("No valid response from OpenAI.");
        } 

    } catch (err) {
    console.error("Error during API request:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
    }
};
