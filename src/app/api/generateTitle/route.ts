import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
    try {
        const { content } = await request.json();

        if (!content || content.trim() === "") {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            )
        }

        const truncatedContent = content.substring(0, 4000);


        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: "You are a helpful assistant that generates concise, descriptive titles for notes. Keep titles under 100 characters and do not include the word title."
                },
                {
                    role: "user",
                    content: `Generate a short, descriptive title for this note content: \n\n${truncatedContent}`
                }
            ],
            max_tokens: 50,
            temperature: 0.7,
        });

        const title = response.choices[0]?.message.content?.trim() || "Untitled Note";

        return NextResponse.json({ title });

    } catch (error) {
        console.error("Error generation title", error);
        return NextResponse.json(
            { error: "Failed to generate title" },
            { status: 500 }
        )
    }
}