import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: Request) {
	const body = await request.json()
	const prompt = `I will be listing real reviews of restaurants. Using these real reviews create a short review based on the information found in the real reviews. These are the reviews: ${body.reviews.join(", ")}`
	try {
		const openai = new OpenAI()
		const completion = await openai.chat.completions.create({
			messages: [{ role: "system", content: prompt }],
			model: "gpt-3.5-turbo",
			temperature: 1, // very random
		})
		console.log(completion.choices[0])
		return NextResponse.json(completion.choices[0])
	} catch (error) {
		console.log(error)
		return NextResponse.json({ error }, { status: 500 })
	}
}
