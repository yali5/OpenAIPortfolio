import { OpenAIClient } from '@azure/openai';
import { AzureKeyCredential } from '@azure/core-auth';
import { NextResponse } from 'next/server';
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
import OpenAI from "openai";
import express from 'express';
import cors from 'cors';

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const model = process.env.AZURE_OPENAI_MODEL;

export async function POST(req){

    const { messages } = await req.json();

    console.log("Request JSON parsed:", messages);

    const openai = new OpenAI({
        apiKey: process.env.AZURE_OPENAI_API_KEY,
    });
    const app = express();
    return app.use(bodyParser.json());

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