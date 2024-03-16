import { NextResponse } from "next/server"

export async function GET(request: Request, params: any) {
	const { id } = params.params
	try {
		const uri = `https://places.googleapis.com/v1/${id}/media?maxHeightPx=400&maxWidthPx=400&key=${process.env.API_KEY}&skipHttpRedirect=true`
		const response = await fetch(uri)
		const data = await response.json()
		return NextResponse.json(data.photoUri ? data.photoUri : data, { status: 200 })
	} catch (error) {
		console.log(error)
		return NextResponse.json({ error }, { status: 500 })
	}
}
