import { Loader } from '@/components/util'
import React from 'react'

const Upload = ({
	uploading,
	inputRef,
	handleUploadCSV,
	header,
	setHeader
}) => {
	return (
		<section className="flex flex-col gap-5 items-center my-3">
			<div className="text-sm font-light w-full">
				<label
					className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 sr-only"
					htmlFor="csv_upload"
				>
					Upload file
				</label>
				<input
					className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
					aria-describedby="csv_upload_help"
					id="csv_upload"
					type="file"
					disabled={uploading}
					ref={inputRef}
				/>
				<div
					className="mt-1 text-sm text-gray-500 dark:text-gray-300"
					id="csv_upload_help"
				>
					Upload a CSV file with your desired questions. After, you
					will have the ability to select which course and chapter to
					attach the quiz to as well as assign the quiz&apos;s title
					and the minimum score to pass.
				</div>
			</div>
			<label
				htmlFor=""
				className="flex items-center gap-2 text-sm text-gray-500"
			>
				<input
					type="checkbox"
					onChange={() => setHeader(!header)}
					checked={header}
				/>
				Include headers?
			</label>
			<button
				onClick={handleUploadCSV}
				disabled={uploading}
				className="w-1/2 bg-ncrma-300 hover:bg-ncrma-500 focus:bg-ncrma-500 focus:ring-2 rounded px-5 py-2 text-white"
				type="button"
			>
				{uploading ? (
					<span className="relative max-h-14 flex gap-2 items-center text-white">
						<Loader size={16} color={'#eee'} />
						Loading...
					</span>
				) : (
					'Load CSV File'
				)}
			</button>
		</section>
	)
}

export default Upload
