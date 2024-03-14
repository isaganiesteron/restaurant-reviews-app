import { NextResponse } from "next/server"

export async function GET(request: Request, params: any) {
	const { id } = params.params
	try {
		const uri = `https://places.googleapis.com/v1/${id}/media?maxHeightPx=400&maxWidthPx=400&key=${process.env.API_KEY}`
		const response = await fetch(uri)
		const image = await response.blob()
		let ab = await image.arrayBuffer()
		let object = {
			image: Array.from(new Uint8Array(ab)),
			name: "image",
		}
		return NextResponse.json(object)
	} catch (error) {
		console.log(error)
		return NextResponse.json({ error }, { status: 500 })
	}
}
