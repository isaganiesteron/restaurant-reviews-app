import { NextResponse } from "next/server"

export async function GET(request: Request, params: any) {
	const { placeid } = params.params
	try {
		const response = await fetch(`https://places.googleapis.com/v1/places/${placeid}?languageCode=en`, {
			headers: {
				"Content-Type": "application/json",
				"X-Goog-Api-Key": `${process.env.API_KEY}`,
				"X-Goog-FieldMask": "id,reviews,photos",
			},
		})
		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.log(error)
		return NextResponse.json({ error }, { status: 500 })
	}
}

// https://places.googleapis.com/v1/places/ChIJj61dQgK6j4AR4GeTYWZsKWw?fields=id,displayName&key=AIzaSyDHLGihUyrlPJ4IbdEz5bDAHey0ljQZr8Q
