import React, { useEffect, useState } from "react"
import Image from "next/image"
import Spinner from "@/components/Spinner"

const Result = ({ result }: { result: object }) => {
	const [generatedReview, setGeneratedReview] = useState<string>("")
	const [reviewLoading, setReviewLoading] = useState<boolean>(false)
	const [photoUrls, setPhotoUrls] = useState<string[]>([])
	const [photosLoading, setPhotosLoading] = useState<boolean>(false)

	const _getImageUrl = async (id: string) => {
		const response = await fetch(`/api/image/${encodeURIComponent(id)}`)
		const imageUrl = await response.json()
		return imageUrl
	}

	const _handleGetPhotos = async (photos: object[]) => {
		setPhotosLoading(true)
		let photoUrls: string[] = []
		let counter = 0
		while (counter < photos.length) {
			const current = photos[counter]
			const photoUrl = await _getImageUrl(current["name" as keyof typeof current])
			photoUrls.push(photoUrl)
			counter++
		}
		setPhotoUrls(photoUrls)
		setPhotosLoading(false)
	}

	const _handleGenerateReview = async (reviews: string[]) => {
		if (reviews.length === 0) {
			console.log("No reviews to generate for")
			return
		}
		setGeneratedReview("")
		setReviewLoading(true)
		const response = await fetch(`/api/generatereview`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ reviews }),
		})
		const data = await response.json()
		const content = data.message?.content

		setGeneratedReview(content)
		setReviewLoading(false)
	}

	const displayName = result["displayName" as keyof typeof result]
	const reviews = result["reviews" as keyof typeof result] as { text: { text: string } }[] // Update the type of reviews array
	const photos = result["photos" as keyof typeof result] as object[] // Update the type of photos array

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
		<div className="p-2 m-1 flex flex-col border border-black rounded-md gap-5">
			<div>
				<p className="text-[30px] font-bold">{displayName["text" as keyof typeof displayName]}</p>
				<p>Address: {result["formattedAddress" as keyof typeof result]}</p>
				<p>{`Rating: ${result["rating" as keyof typeof result]} (${result["userRatingCount" as keyof typeof result]} ratings)`}</p>
			</div>
			<div>
				<p className="text-[20px] font-bold">Reviews</p>
				{allReviews.length > 0 ? allReviews.map((x, i) => <p key={i} className="pb-4">{`${x}`}</p>) : null}
			</div>

			<div>
				<div className="flex flex-row gap-3  items-center">
					<p className="text-[20px] font-bold">Review by OpenAi:</p>{" "}
					<button className="text-xs border border-black rounded-md p-1 bg-orange-100 hover:bg-orange-300" onClick={() => _handleGenerateReview(reviewObject)}>
						{`${generatedReview === "" ? "Generate" : "Regenerate"} Review with OpenAI`}
					</button>
				</div>
				{reviewLoading && (
					<div className="flex justify-center items-center min-h-20 align-middle transition-opacity ease-in-out duration-500">
						<Spinner />
					</div>
				)}
				{generatedReview !== "" && (
					<div className="p-5">
						<p className="italic">{`"${generatedReview}"`}</p>
					</div>
				)}
			</div>

			<div>
				<div className="flex flex-row gap-3  items-center">
					<p className="text-[20px] font-bold">Photos:</p>
					<button className="text-xs border border-black rounded-md p-1 bg-green-100 hover:bg-green-300" onClick={() => _handleGetPhotos(photos)}>
						Get all Photos
					</button>
				</div>
				{photosLoading && (
					<div className="flex justify-center items-center min-h-20 align-middle transition-opacity ease-in-out duration-500">
						<Spinner />
					</div>
				)}
				{photoUrls.length > 0 && (
					<div className="flex flex-row flex-wrap gap-3 justify-center my-5">
						{photoUrls.map((x, i) => {
							return (
								<div>
									<Image key={i} className="border border-black rounded-md" src={x} width="220" height="220" alt={`alt text`} />
								</div>
							)
						})}
					</div>
				)}
			</div>
		</div>
	)
}

export default Result
