"use client"
import { useState } from "react"
// import mockdata from "@/constants/mockdata"

export default function Home() {
	const [data, setData] = useState<object[]>([])
	const [userInput, setUserInput] = useState<string>("")
	const [status, setstatus] = useState<string>("")

	interface RootObject {
		displayName: DisplayName
		formattedAddress: string
		id: string
		name: string
		priceLevel: string
		rating: number
		userRatingCount: number
	}
	interface DisplayName {
		text: string
		languageCode: string
	}

	const getPlaceDetails = async (places: RootObject[]) => {
		let updatedPlaces = []
		let counter = 0

		while (counter < places.length) {
			console.log(`Getting place id: ${places[counter].id}...`)
			const response = await fetch(`/api/detail/${places[counter].id}`)
			const data = await response.json()
			// await new Promise((resolve) => setTimeout(resolve, 500)) // set half a second delay
			const currentReviews = data.reviews
			updatedPlaces.push({ ...places[counter], reviews: currentReviews ? currentReviews : [] })
			counter++
		}

		return updatedPlaces
	}

	const placeSearch = async (textQuery: string) => {
		const response = await fetch(`/api/places/${textQuery}`)
		const data = await response.json()

		if (data.places) {
			return data.places
		} else {
			console.log("ERROR: no places found")
			console.log(data)
			return []
		}
	}

	const getPlaces = async (textQuery: string) => {
		if (textQuery === "") return
		setData([])
		setstatus(`Attempting to search for places with input of "${textQuery}"`)

		const fetchedPlaces = await placeSearch(textQuery)
		const fetchedPlacesWithReviews = await getPlaceDetails(fetchedPlaces)
		// const fetchedPlacesWithReviews = mockdata // for testing purposes without using the API

		const sortedByReviews = fetchedPlacesWithReviews.sort((a, b) => b.rating - a.rating)

		setstatus(`Found ${sortedByReviews.length} places for "${textQuery}"`)
		setData(sortedByReviews.slice(0, 10))
	}

	return (
		<main className="flex  min-h-screen flex-col items-center">
			<h1 className="text-2xl p-4">Restaurant Review Finder</h1>
			<div className="flex flex-row gap-1 w-full">
				<input
					type="text"
					value={userInput}
					className="w-10/12 border border-black rounded-md p-[5.5px]"
					onChange={(event) => {
						setUserInput(event.target.value)
					}}
				/>
				<button className="w-2/12 border border-black rounded-md p-1 bg-blue-100 hover:bg-blue-300" onClick={() => getPlaces(userInput)}>
					Get Places
				</button>
			</div>
			<h1 className="text-xl p-4">{status}</h1>

			<div className="w-full">
				{data.map((x, i) => {
					const displayName = x["displayName" as keyof typeof x]
					const reviews = x["reviews" as keyof typeof x] as { text: { text: string } }[] // Update the type of reviews array
					const allReviews = reviews
						? reviews.map((x: object) => {
								// TODO: include the number of reviews here as well
								const text = x["text" as keyof typeof x]
								const reviewText = text ? text["text" as keyof typeof text] : "No review text"
								const rating = x["rating" as keyof typeof x]
								const authorAttribution = x["authorAttribution" as keyof typeof x]
								const authorName = authorAttribution ? authorAttribution["displayName" as keyof typeof authorAttribution] : "Anonymous"
								return `${authorName} (${rating} stars): ${reviewText}`
						  })
						: []

					return (
						<div key={i} className="p-2 m-1 flex flex-col border border-black rounded-md">
							<p className="text-lg font-bold pb-2">{displayName["text" as keyof typeof displayName]}</p>
							<p className="pb-2">Address: {x["formattedAddress" as keyof typeof x]}</p>
							<p className="pb-2">Rating: {x["rating" as keyof typeof x]}</p>
							{allReviews.length > 0 ? allReviews.map((x, i) => <p key={i} className="pb-4">{`${x}`}</p>) : null}
						</div>
					)
				})}
			</div>
		</main>
	)
}
