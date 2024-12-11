import { OpenAIClient } from '@azure/openai';
import { AzureKeyCredential } from '@azure/core-auth';
import { NextResponse } from 'next/server';
import OpenAI from "openai";

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const model = process.env.AZURE_OPENAI_MODEL;

export async function POST(req){

    const { messages } = await req.json();

    const openai = new OpenAI({
        apiKey: process.env.AZURE_OPENAI_API_KEY,
    });
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    app.post("/chat",async (req,res)=>{
        const {prompt} = req.body

        const completion = await openai.createCompletion({
            model: "gpt-4",
            max_tokens: 512,
            temperature: 0,
            prompt: prompt,
        });
        res.send(completion.data.choices[0].text);
    });
}