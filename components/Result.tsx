import React, { useState } from "react"

const Result = ({ result }: { result: object }) => {
	const [generatedReview, setGeneratedReview] = useState<string>("")

	const _handleGenerateReview = async (reviews: string[]) => {
		if (reviews.length === 0) {
			console.log("No reviews to generate for")
			return
		}
		const response = await fetch(`/api/generatereview`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ reviews }),
		})
		const data = await response.json()
		setGeneratedReview(JSON.stringify(data))
	}

	const displayName = result["displayName" as keyof typeof result]
	const reviews = result["reviews" as keyof typeof result] as { text: { text: string } }[] // Update the type of reviews array

	const reviewObject = reviews
		.map((x: object) => {
			const text = x["text" as keyof typeof x]
			return text ? text["text" as keyof typeof text] : ""
		})
		.filter((x) => x !== "")

	const allReviews = reviews
		? reviews.map((x: object) => {
				const text = x["text" as keyof typeof x]
				const reviewText = text ? text["text" as keyof typeof text] : "No review text"
				const rating = x["rating" as keyof typeof x]
				const authorAttribution = x["authorAttribution" as keyof typeof x]
				const authorName = authorAttribution ? authorAttribution["displayName" as keyof typeof authorAttribution] : "Anonymous"
				if (reviewText !== "No review text") reviewObject.push(reviewText)
				return `${authorName} (${rating} stars): ${reviewText}`
		  })
		: []

	return (
		<div className="p-2 m-1 flex flex-col border border-black rounded-md">
			<p className="text-lg font-bold pb-2">{displayName["text" as keyof typeof displayName]}</p>
			<p className="pb-2">Address: {result["formattedAddress" as keyof typeof result]}</p>
			<p className="pb-2">{`Rating: ${result["rating" as keyof typeof result]} (${result["userRatingCount" as keyof typeof result]} ratings)`}</p>
			{allReviews.length > 0 ? allReviews.map((x, i) => <p key={i} className="pb-4">{`${x}`}</p>) : null}
			<button
				className="text-xs border border-black rounded-md p-1 bg-orange-100 hover:bg-orange-300"
				onClick={() => {
					console.log("send all reviews to openai")
					_handleGenerateReview(reviewObject)
				}}
			>
				Generate Review
			</button>
			{generatedReview !== "" && (
				<>
					<h1>Generated Review:</h1>
					<p className="pt-4">{generatedReview}</p>
				</>
			)}
		</div>
	)
}

export default Result
