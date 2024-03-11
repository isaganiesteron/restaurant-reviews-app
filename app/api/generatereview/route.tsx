import { NextResponse } from "next/server"

export async function POST(request: Request) {
	const body = await request.json()
	try {
		// const openai = new OpenAI()
		// const completion = await openai.chat.completions.create({
		// 	messages: [{ role: "system", content: prompt }],
		// 	model: "gpt-3.5-turbo",
		// 	response_format: { type: "json_object" },
		// 	temperature: 1, // very random
		// })
		// console.log(completion.choices[0])

		return NextResponse.json(body)
	} catch (error) {
		console.log(error)
		return NextResponse.json({ error }, { status: 500 })
	}
}
