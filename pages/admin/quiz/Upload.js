import React from 'react'
import PropTypes from 'prop-types'

const Upload = ({ uploading, inputRef, htmlFor, help, helpID, parseJsonFile, _type, processButton }) => {
	return (
		<section className="flex flex-col gap-5 items-center my-3">
			<div className="text-sm font-light w-full">
				<form>
					<label
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 sr-only"
						htmlFor={htmlFor}
					>
						Upload file
					</label>
					<input
						className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
						aria-describedby={helpID}
						id={htmlFor}
						type="file"
						disabled={uploading}
						ref={inputRef}
						accept={`.${_type}`}
						onChange={_type === 'json' ? (e) => parseJsonFile(e) : null}
						required
					/>
					<div
						className="mt-1 text-sm text-gray-500 dark:text-gray-300"
						id={helpID}
					>
						{help}
					</div>
				</form>
			</div>
			{processButton}
		</section>
	)
}

Upload.propTypes = {
	/**
	 * Whether or not the upload is currently in progress
	 * @type {boolean}
	 * @default false
	 * @example
	 * <Upload uploading={true} />
	 * <Upload uploading={false} />
	 */
	uploading: PropTypes.bool.isRequired,
	/**
	 * The ref to the input element
	 * @type {React.RefObject}
	 * @example
	 * <Upload inputRef={inputRef} />
	 * <Upload inputRef={React.createRef()} />
	 */
	inputRef: PropTypes.object.isRequired,
	/**
	 * Represents the "aria-describedby" attribute on the input element as well as the "id" attribute on the help text.
	 * @type {string}
	 * @example
	 * <Upload htmlFor="csv-upload" />
	 */
	helpID: PropTypes.string.isRequired,
	/**
	 * This represents the HTML attribute "for" value on the label element as well as the "id" attribute on the input element.
	 * @type {string}
	 * @example
	 * <Upload htmlFor="csv-upload" />
	 */
	htmlFor: PropTypes.string.isRequired,
	/**
	 * The help text for the upload
	 * @type {string}
	 * @example
	 * <Upload help="Upload a CSV file with your desired questions. After, you will have the ability to select which course and chapter to attach the quiz to as well as assign the quiz's title and the minimum score to pass." />
	 */
	help: PropTypes.string.isRequired,
	/**
	 * The function to parse the JSON file
	 */
	parseJsonFile: PropTypes.func,
	/**
	 * The type of file to upload
	 * @type {string}
	 * @example
	 * <Upload _type="json" />
	 * <Upload _type="csv" />
	 */
	_type: PropTypes.string.isRequired,
	/**
	 * The button to process the upload
	 * @type {React.ReactNode}
	 * @example
	 * <Upload processButton={<button>Process</button>} />
	 */
	processButton: PropTypes.node.isRequired
}

export default Upload
