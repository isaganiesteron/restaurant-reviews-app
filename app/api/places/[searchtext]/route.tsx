import { NextResponse } from "next/server"

export async function GET(request: Request, params: any) {
	const { searchtext } = params.params
	try {
		const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-Api-Key": `${process.env.API_KEY}`,
				"X-Goog-FieldMask": "places.id,places.name,places.displayName,places.formattedAddress,places.priceLevel,places.rating,places.userRatingCount",
			},
			body: JSON.stringify({
				textQuery: searchtext,
				languageCode: "en",
			}),
		})
		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.log(error)
		return NextResponse.json({ error }, { status: 500 })
	}
}
