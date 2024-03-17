"use client"
import { useState } from "react"
import Result from "@/components/Result"
import Spinner from "@/components/Spinner"
import mockdata from "@/constants/mockdata"

export default function Home() {
	const [data, setData] = useState<object[]>([])
	const [userInput, setUserInput] = useState<string>("")
	const [status, setstatus] = useState<string>("")
	const [isLoading, setIsLoading] = useState<boolean>(false)

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
		setIsLoading(true)
		setstatus(`Attempting to search for places with input of "${textQuery}"`)

		const fetchedPlaces = await placeSearch(textQuery)
		// const fetchedPlaces = mockdata // for testing purposes without using the API
		// await new Promise((resolve) => setTimeout(resolve, 1000))

		const sortedByReviews = fetchedPlaces.sort((a: { rating: number }, b: { rating: number }) => {
			if (b.rating && a.rating) return b.rating - a.rating
			else return 0
		})
		// const sortedByReviews = fetchedPlacesWithReviews.sort((a, b) => b.rating - a.rating)

		setstatus(`Found ${sortedByReviews.length} places for "${textQuery}"`)
		setIsLoading(false)
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

			<div className="flex flex-row items-center p-4">
				{isLoading && <Spinner />}
				<h1 className="text-xl">{status}</h1>
			</div>
			{/* <h1 className="text-xl p-4">
				{isLoading && <Spinner />}
				{status}
			</h1> */}

			<div className="w-full">
				{data.map((x, i) => (
					<Result key={i} result={x} />
				))}
			</div>
		</main>
	)
}
