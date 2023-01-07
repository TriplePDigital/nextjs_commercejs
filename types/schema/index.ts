import type {
	SanityAsset,
	SanityBlock,
	SanityDocument,
	SanityFile,
	SanityGeoPoint,
	SanityImage,
	SanityImageAsset,
	SanityImageCrop,
	SanityImageDimensions,
	SanityImageHotspot,
	SanityImageMetadata,
	SanityImagePalette,
	SanityImagePaletteSwatch,
	SanityKeyed,
	SanityKeyedReference,
	SanityReference
} from 'sanity-codegen'

export type {
	SanityReference,
	SanityKeyedReference,
	SanityAsset,
	SanityImage,
	SanityFile,
	SanityGeoPoint,
	SanityBlock,
	SanityDocument,
	SanityImageCrop,
	SanityImageHotspot,
	SanityKeyed,
	SanityImageAsset,
	SanityImageMetadata,
	SanityImageDimensions,
	SanityImagePalette,
	SanityImagePaletteSwatch
}

/**
 * Certification
 *
 *
 */
export interface Certification extends SanityDocument {
	_type: 'certification'

	/**
	 * Title — `string`
	 *
	 *
	 */
	title?: string

	/**
	 * Slug — `slug`
	 *
	 *
	 */
	slug?: { _type: 'slug'; current: string }

	/**
	 * Description — `markdown`
	 *
	 *
	 */
	description?: Markdown

	/**
	 * Mission(s) included — `array`
	 *
	 * Select the missions that are required for the completion of this certification.
	 */
	missions?: Array<SanityKeyedReference<Mission>>

	/**
	 * SKU — `string`
	 *
	 *
	 */
	sku?: string

	/**
	 * Price — `number`
	 *
	 *
	 */
	price?: number
}

/**
 * Mission
 *
 *
 */
export interface Mission extends SanityDocument {
	_type: 'mission'

	/**
	 * Course Title — `string`
	 *
	 *
	 */
	title?: string

	/**
	 * Slug — `slug`
	 *
	 *
	 */
	slug?: { _type: 'slug'; current: string }

	/**
	 * Course Blurb — `text`
	 *
	 * One liner about the course
	 */
	blurb?: string

	/**
	 * Description — `markdown`
	 *
	 *
	 */
	description?: Markdown

	/**
	 * Cover Image — `image`
	 *
	 *
	 */
	coverImage?: {
		_type: 'image'
		asset: SanityReference<SanityImageAsset>
		crop?: SanityImageCrop
		hotspot?: SanityImageHotspot
	}

	/**
	 * Instructor(s) — `array`
	 *
	 *
	 */
	instructors?: Array<SanityKeyedReference<Instructor>>

	/**
	 * Color Code of the Course — `string`
	 *
	 * The hexadecimal value of the color assigned to the course (including the # mark at the beginning).
	 */
	colorCode?: string

	/**
	 * Fallback URL — `url`
	 *
	 *
	 */
	fallbackURL?: string

	/**
	 * Active Promo — `reference`
	 *
	 *
	 */
	activePromo?: SanityReference<Marketing>

	/**
	 * Categories — `array`
	 *
	 *
	 */
	categories?: Array<SanityKeyed<string>>

	/**
	 * SKU — `string`
	 *
	 *
	 */
	sku?: string
}

/**
 * Stage
 *
 *
 */
export interface Stage extends SanityDocument {
	_type: 'stage'

	/**
	 * Title — `string`
	 *
	 *
	 */
	title?: string

	/**
	 * Slug — `slug`
	 *
	 *
	 */
	slug?: { _type: 'slug'; current: string }

	/**
	 * Numeric Place in course — `number`
	 *
	 *
	 */
	order?: number

	/**
	 * Mission — `reference`
	 *
	 *
	 */
	mission?: SanityReference<Mission>
}

/**
 * Video
 *
 *
 */
export interface Video extends SanityDocument {
	_type: 'video'

	/**
	 * Instructor — `reference`
	 *
	 *
	 */
	instructor?: SanityReference<Instructor>

	/**
	 * Vimeo Video — `vimeoVideo`
	 *
	 *
	 */
	vimeoVideo?: VimeoVideo

	/**
	 * Body — `markdown`
	 *
	 *
	 */
	body?: Markdown
}

/**
 * Instructor
 *
 *
 */
export interface Instructor extends SanityDocument {
	_type: 'instructor'

	/**
	 * Instructor Name — `string`
	 *
	 *
	 */
	name?: string

	/**
	 * Instructor Email — `string`
	 *
	 *
	 */
	email?: string

	/**
	 * Instructor Avatar — `image`
	 *
	 *
	 */
	avatar?: {
		_type: 'image'
		asset: SanityReference<SanityImageAsset>
		crop?: SanityImageCrop
		hotspot?: SanityImageHotspot
	}

	/**
	 * Company — `string`
	 *
	 *
	 */
	company?: string

	/**
	 * Social — `array`
	 *
	 *
	 */
	social?: Array<SanityKeyed<string>>

	/**
	 * Biography — `markdown`
	 *
	 *
	 */
	bio?: Markdown

	/**
	 * Stages — `array`
	 *
	 *
	 */
	stages?: Array<SanityKeyedReference<Stage>>
}

/**
 * Checkpoint
 *
 *
 */
export interface Checkpoint extends SanityDocument {
	_type: 'checkpoint'

	/**
	 * Checkpoint title — `string`
	 *
	 *
	 */
	title?: string

	/**
	 * Slug — `slug`
	 *
	 *
	 */
	slug?: { _type: 'slug'; current: string }

	/**
	 * Numeric Place in chapter — `number`
	 *
	 *
	 */
	order?: number

	/**
	 * Stage — `reference`
	 *
	 *
	 */
	stage?: SanityReference<Stage>

	/**
	 * Instance — `string`
	 *
	 *
	 */
	instance?: 'video' | 'quiz'

	/**
	 * Type — `reference`
	 *
	 *
	 */
	type?: SanityReference<Quiz | Video>
}

/**
 * Question
 *
 *
 */
export interface Question extends SanityDocument {
	_type: 'question'

	/**
	 * Question Title — `markdown`
	 *
	 *
	 */
	title?: Markdown

	/**
	 * Answers — `array`
	 *
	 *
	 */
	answers?: Array<SanityKeyed<Answer>>
}

/**
 * User
 *
 *
 */
export interface User extends SanityDocument {
	_type: 'user'

	/**
	 * Database Account ID — `string`
	 *
	 *
	 */
	account_id?: string

	/**
	 * Role and Permission — `string`
	 *
	 *
	 */
	role?: 'admin' | 'riskManager' | 'student'

	/**
	 * First Name — `string`
	 *
	 *
	 */
	firstName?: string

	/**
	 * Last Name — `string`
	 *
	 *
	 */
	lastName?: string

	/**
	 * Email — `string`
	 *
	 *
	 */
	email?: string

	/**
	 * Image — `url`
	 *
	 *
	 */
	image?: string

	/**
	 * Avatar — `image`
	 *
	 *
	 */
	avatar?: {
		_type: 'image'
		asset: SanityReference<SanityImageAsset>
		crop?: SanityImageCrop
		hotspot?: SanityImageHotspot
	}

	/**
	 * Active — `boolean`
	 *
	 *
	 */
	active?: boolean

	/**
	 * Discounts remaining — `number`
	 *
	 * How many discounted course track purchases are left.
	 */
	discountUsage?: number

	/**
	 * password — `string`
	 *
	 *
	 */
	password?: string

	/**
	 * Membership Tier — `string`
	 *
	 *
	 */
	membership?: 'individual' | 'coeCompany' | 'company' | 'captive' | 'servicePartner' | 'continuingEducator' | 'appointedBroker'

	/**
	 * Membership Type — `reference`
	 *
	 *
	 */
	membershipType?: SanityReference<Membership>

	/**
	 * Completed Certificates — `array`
	 *
	 *
	 */
	achievements?: Array<SanityKeyedReference<Certification>>

	/**
	 * Last Login — `datetime`
	 *
	 *
	 */
	lastLogin?: string
}

/**
 * Webinar
 *
 *
 */
export interface Webinar extends SanityDocument {
	_type: 'webinar'

	/**
	 * Title — `string`
	 *
	 *
	 */
	title?: string

	/**
	 * Description — `text`
	 *
	 *
	 */
	description?: string

	/**
	 * Starting At — `datetime`
	 *
	 *
	 */
	startingAt?: string

	/**
	 * Ending At — `datetime`
	 *
	 *
	 */
	endingAt?: string

	/**
	 * Purchase Link — `url`
	 *
	 *
	 */
	purchaseLink?: string

	/**
	 * Join Link — `url`
	 *
	 *
	 */
	joinLink?: string

	/**
	 * Download Link — `url`
	 *
	 *
	 */
	downloadLink?: string

	/**
	 * Presenters — `array`
	 *
	 *
	 */
	presenters?: Array<SanityKeyedReference<Instructor>>

	/**
	 * Agenda — `array`
	 *
	 *
	 */
	agenda?: Array<
		SanityKeyed<{
			_type: 'agendaItem'
			/**
			 * Title — `string`
			 *
			 *
			 */
			title?: string

			/**
			 * Start Time — `datetime`
			 *
			 *
			 */
			startTime?: string

			/**
			 * End Time — `datetime`
			 *
			 *
			 */
			endTime?: string

			/**
			 * Host — `reference`
			 *
			 *
			 */
			host?: SanityReference<Instructor>
		}>
	>
}

/**
 * Course Track
 *
 *
 */
export interface Track extends SanityDocument {
	_type: 'track'

	/**
	 * Track Name — `string`
	 *
	 *
	 */
	name?: string

	/**
	 * Enrolled — `array`
	 *
	 *
	 */
	enrolled?: Array<SanityKeyedReference<User>>

	/**
	 * Achievement — `reference`
	 *
	 * Achievement received by the user for the completion of all missions in the track
	 */
	achievement?: SanityReference<Certification>

	/**
	 * Missions — `array`
	 *
	 *
	 */
	missions?: Array<SanityKeyedReference<Mission>>
}

/**
 * Quiz
 *
 *
 */
export interface Quiz extends SanityDocument {
	_type: 'quiz'

	/**
	 * Questions — `array`
	 *
	 *
	 */
	questions?: Array<SanityKeyedReference<Question>>

	/**
	 * Quiz Title — `string`
	 *
	 *
	 */
	title?: string

	/**
	 * Minimum Score to Pass — `number`
	 *
	 *
	 */
	minimumScore?: number

	/**
	 * Stage — `reference`
	 *
	 *
	 */
	stage?: SanityReference<Stage>
}

/**
 * Quiz Attempt
 *
 *
 */
export interface QuizAttempt extends SanityDocument {
	_type: 'quizAttempt'

	/**
	 * User — `reference`
	 *
	 *
	 */
	user?: SanityReference<User>

	/**
	 * Quiz — `reference`
	 *
	 *
	 */
	quiz?: SanityReference<Checkpoint>

	/**
	 * Score — `number`
	 *
	 *
	 */
	score?: number
}

/**
 * User Progress
 *
 *
 */
export interface Progress extends SanityDocument {
	_type: 'progress'

	/**
	 * Enrollment — `reference`
	 *
	 *
	 */
	enrollment?: SanityReference<Enrollment>

	/**
	 * Content — `reference`
	 *
	 *
	 */
	content?: SanityReference<Checkpoint>

	/**
	 * Status — `number`
	 *
	 *
	 */
	status?: number
}

/**
 * Enrollment
 *
 *
 */
export interface Enrollment extends SanityDocument {
	_type: 'enrollment'

	/**
	 * Student — `reference`
	 *
	 *
	 */
	student?: SanityReference<User>

	/**
	 * Course — `reference`
	 *
	 *
	 */
	course?: SanityReference<Mission>
}

/**
 * Risk manager profile
 *
 *
 */
export interface RiskManagerProfile extends SanityDocument {
	_type: 'riskManagerProfile'

	/**
	 * Course progress — `array`
	 *
	 *
	 */
	courseProgress?: Array<SanityKeyedReference<Progress>>

	/**
	 * Risk manager — `reference`
	 *
	 *
	 */
	riskManager?: SanityReference<User>

	/**
	 * CRP2 Video Training — `object`
	 *
	 *
	 */
	crpVideoTraining?: {
		_type: 'crpVideoTraining'
		/**
		 * Video 1 — `object`
		 *
		 *
		 */
		videoNumberOne?: {
			_type: 'videoNumberOne'
			/**
			 * Updated at — `datetime`
			 *
			 *
			 */
			updatedAt?: string

			/**
			 * Status — `string`
			 *
			 *
			 */
			status?: 'started' | 'inTraining' | 'idRisk' | 'proficient'
		}

		/**
		 * Video 2 — `object`
		 *
		 *
		 */
		videoNumberTwo?: {
			_type: 'videoNumberTwo'
			/**
			 * Updated at — `datetime`
			 *
			 *
			 */
			updatedAt?: string

			/**
			 * Status — `string`
			 *
			 *
			 */
			status?: 'started' | 'inTraining' | 'idRisk' | 'proficient'
		}
	}

	/**
	 * Training Assessments — `object`
	 *
	 *
	 */
	trainingAssessments?: {
		_type: 'trainingAssessments'
		/**
		 * Dispensary — `object`
		 *
		 *
		 */
		dispensary?: {
			_type: 'dispensary'
			/**
			 * Updated at — `datetime`
			 *
			 *
			 */
			updatedAt?: string

			/**
			 * Status — `string`
			 *
			 *
			 */
			status?: 'started' | 'inTraining' | 'idRisk' | 'proficient'
		}

		/**
		 * Property Premises — `object`
		 *
		 *
		 */
		propertyPremises?: {
			_type: 'propertyPremises'
			/**
			 * Updated at — `datetime`
			 *
			 *
			 */
			updatedAt?: string

			/**
			 * Status — `string`
			 *
			 *
			 */
			status?: 'started' | 'inTraining' | 'idRisk' | 'proficient'
		}

		/**
		 * Express assess — `object`
		 *
		 *
		 */
		expressAssess?: {
			_type: 'expressAssess'
			/**
			 * Updated at — `datetime`
			 *
			 *
			 */
			updatedAt?: string

			/**
			 * Status — `string`
			 *
			 *
			 */
			status?: 'started' | 'inTraining' | 'idRisk' | 'proficient'
		}

		/**
		 * BC Dispensary — `object`
		 *
		 *
		 */
		bcDispensary?: {
			_type: 'bcDispensary'
			/**
			 * Updated at — `datetime`
			 *
			 *
			 */
			updatedAt?: string

			/**
			 * Status — `string`
			 *
			 *
			 */
			status?: 'started' | 'inTraining' | 'idRisk' | 'proficient'
		}
	}

	/**
	 * Shadow Assessment — `object`
	 *
	 *
	 */
	shadowAssessment?: {
		_type: 'shadowAssessment'
		/**
		 * Updated at — `datetime`
		 *
		 *
		 */
		updatedAt?: string

		/**
		 * Status — `string`
		 *
		 *
		 */
		status?: 'started' | 'inTraining' | 'idRisk' | 'proficient'
	}

	/**
	 * Probation Assessments — `object`
	 *
	 *
	 */
	probationAssessments?: {
		_type: 'probationAssessments'
		/**
		 * Assessment Number One — `object`
		 *
		 *
		 */
		assessmentNumberOne?: {
			_type: 'assessmentNumberOne'
			/**
			 * Updated at — `datetime`
			 *
			 *
			 */
			updatedAt?: string

			/**
			 * Status — `string`
			 *
			 *
			 */
			status?: 'started' | 'inTraining' | 'idRisk' | 'proficient'
		}

		/**
		 * Assessment Number Two — `object`
		 *
		 *
		 */
		assessmentNumberTwo?: {
			_type: 'assessmentNumberTwo'
			/**
			 * Updated at — `datetime`
			 *
			 *
			 */
			updatedAt?: string

			/**
			 * Status — `string`
			 *
			 *
			 */
			status?: 'started' | 'inTraining' | 'idRisk' | 'proficient'
		}

		/**
		 * Assessment Number Three — `object`
		 *
		 *
		 */
		assessmentNumberThree?: {
			_type: 'assessmentNumberThree'
			/**
			 * Updated at — `datetime`
			 *
			 *
			 */
			updatedAt?: string

			/**
			 * Status — `string`
			 *
			 *
			 */
			status?: 'started' | 'inTraining' | 'idRisk' | 'proficient'
		}
	}

	/**
	 * Assessment Proficiency — `object`
	 *
	 *
	 */
	assessmentProficiency?: {
		_type: 'assessmentProficiency'
		/**
		 * Risk Management — `object`
		 *
		 *
		 */
		riskManagement?: {
			_type: 'riskManagement'
			/**
			 * Updated at — `datetime`
			 *
			 *
			 */
			updatedAt?: string

			/**
			 * Status — `string`
			 *
			 *
			 */
			status?: 'started' | 'inTraining' | 'idRisk' | 'proficient'
		}

		/**
		 * Health and Safety (OSHA) — `object`
		 *
		 *
		 */
		healthAndSafety?: {
			_type: 'healthAndSafety'
			/**
			 * Updated at — `datetime`
			 *
			 *
			 */
			updatedAt?: string

			/**
			 * Status — `string`
			 *
			 *
			 */
			status?: 'started' | 'inTraining' | 'idRisk' | 'proficient'
		}

		/**
		 * Property and Premises — `object`
		 *
		 *
		 */
		propertyAndPremises?: {
			_type: 'propertyAndPremises'
			/**
			 * Updated at — `datetime`
			 *
			 *
			 */
			updatedAt?: string

			/**
			 * Status — `string`
			 *
			 *
			 */
			status?: 'started' | 'inTraining' | 'idRisk' | 'proficient'
		}

		/**
		 * Product and Process (Cannabis) — `object`
		 *
		 *
		 */
		productProcess?: {
			_type: 'productProcess'
			/**
			 * Updated at — `datetime`
			 *
			 *
			 */
			updatedAt?: string

			/**
			 * Status — `string`
			 *
			 *
			 */
			status?: 'started' | 'inTraining' | 'idRisk' | 'proficient'
		}

		/**
		 * Quality Assurance (ISO) — `object`
		 *
		 *
		 */
		qualityAssurance?: {
			_type: 'qualityAssurance'
			/**
			 * Updated at — `datetime`
			 *
			 *
			 */
			updatedAt?: string

			/**
			 * Status — `string`
			 *
			 *
			 */
			status?: 'started' | 'inTraining' | 'idRisk' | 'proficient'
		}

		/**
		 * Insurance — `object`
		 *
		 *
		 */
		insurance?: {
			_type: 'insurance'
			/**
			 * Updated at — `datetime`
			 *
			 *
			 */
			updatedAt?: string

			/**
			 * Status — `string`
			 *
			 *
			 */
			status?: 'started' | 'inTraining' | 'idRisk' | 'proficient'
		}
	}
}

/**
 * Company
 *
 *
 */
export interface Company extends SanityDocument {
	_type: 'company'

	/**
	 * Facilities — `array`
	 *
	 *
	 */
	facilities?: Array<
		SanityKeyed<{
			/**
			 * Facility Type — `string`
			 *
			 *
			 */
			type?: 'cultivation' | 'dispensary' | 'distribution' | 'cultivationDispensary' | 'cultivationExtraction' | 'extractionInfusion' | 'mix'

			/**
			 * Facility Name — `string`
			 *
			 *
			 */
			name?: string

			/**
			 * Facility Location — `object`
			 *
			 *
			 */
			location?: {
				_type: 'location'
				/**
				 * Street Address — `string`
				 *
				 *
				 */
				streetAddress?: string

				/**
				 * City — `string`
				 *
				 *
				 */
				city?: string

				/**
				 * State — `string`
				 *
				 *
				 */
				state?: string

				/**
				 * Zip Code — `string`
				 *
				 *
				 */
				zip?: string
			}

			/**
			 * Employees — `array`
			 *
			 *
			 */
			employees?: Array<SanityKeyedReference<User>>

			/**
			 * Control Deficiency — `string`
			 *
			 *
			 */
			controlDeficiency?: 'severe' | 'significant' | 'moderate' | 'negligible' | 'minor'

			/**
			 * Module Types — `string`
			 *
			 *
			 */
			moduleTypes?: 'enterpriseWide' | 'baseline' | 'significant' | 'advanced' | 'full'

			/**
			 * Recommended Courses — `array`
			 *
			 *
			 */
			recommendedCourses?: Array<SanityKeyedReference<Mission>>

			/**
			 * Assessment — `array`
			 *
			 *
			 */
			assessment?: Array<
				SanityKeyed<{
					/**
					 * Created At — `datetime`
					 *
					 *
					 */
					createdAt?: string

					/**
					 * CRPP ID — `string`
					 *
					 *
					 */
					crppID?: string

					/**
					 * Score — `number`
					 *
					 *
					 */
					score?: number

					/**
					 * Proficiency Scoring — `boolean`
					 *
					 *
					 */
					prime?: boolean
				}>
			>
		}>
	>

	/**
	 * Company CRPP ID — `string`
	 *
	 *
	 */
	crppID?: string

	/**
	 * Company Name — `string`
	 *
	 *
	 */
	name?: string

	/**
	 * Company Location — `object`
	 *
	 *
	 */
	location?: {
		_type: 'location'
		/**
		 * Street Address 1 — `string`
		 *
		 *
		 */
		streetAddress1?: string

		/**
		 * Street Address 2 — `string`
		 *
		 *
		 */
		streetAddress2?: string

		/**
		 * City — `string`
		 *
		 *
		 */
		city?: string

		/**
		 * State — `string`
		 *
		 *
		 */
		state?: string

		/**
		 * Zip Code — `string`
		 *
		 *
		 */
		zip?: string

		/**
		 * Phone Number — `string`
		 *
		 *
		 */
		phoneNumber?: string
	}

	/**
	 * Primary Contact — `object`
	 *
	 *
	 */
	primaryContact?: {
		_type: 'primaryContact'
		/**
		 * First Name — `string`
		 *
		 *
		 */
		firstName?: string

		/**
		 * Last Name — `string`
		 *
		 *
		 */
		lastName?: string

		/**
		 * Email — `string`
		 *
		 *
		 */
		email?: string

		/**
		 * Phone — `string`
		 *
		 *
		 */
		phoneNumber?: string

		/**
		 * CRPP ID — `string`
		 *
		 *
		 */
		crppID?: string
	}

	/**
	 * Risk Manager — `array`
	 *
	 *
	 */
	riskManager?: Array<SanityKeyedReference<User>>

	/**
	 * Client — `string`
	 *
	 *
	 */
	client?: string
}

/**
 * Marketing Promotions
 *
 *
 */
export interface Marketing extends SanityDocument {
	_type: 'marketing'

	/**
	 * Campaign Name — `string`
	 *
	 *
	 */
	name?: string

	/**
	 * Slug — `slug`
	 *
	 * This is the URL for the campaign that will be used in marketing emails and promo links.
	 */
	slug?: { _type: 'slug'; current: string }

	/**
	 * Content — `markdown`
	 *
	 *
	 */
	content?: Markdown

	/**
	 * Image — `image`
	 *
	 *
	 */
	image?: {
		_type: 'image'
		asset: SanityReference<SanityImageAsset>
		crop?: SanityImageCrop
		hotspot?: SanityImageHotspot
	}

	/**
	 * Price — `number`
	 *
	 *
	 */
	price?: number

	/**
	 * Expires — `date`
	 *
	 *
	 */
	expires?: string

	/**
	 * Sign Up List — `array`
	 *
	 *
	 */
	list?: Array<
		SanityKeyed<{
			_type: 'person'
			/**
			 * Email — `string`
			 *
			 *
			 */
			email?: string

			/**
			 * First Name — `string`
			 *
			 *
			 */
			firstName?: string

			/**
			 * Last Name — `string`
			 *
			 *
			 */
			lastName?: string
		}>
	>
}

/**
 * Memberships
 *
 *
 */
export interface Membership extends SanityDocument {
	_type: 'membership'

	/**
	 * Membership Name — `string`
	 *
	 *
	 */
	name?: string

	/**
	 * SKU — `string`
	 *
	 *
	 */
	sku?: string

	/**
	 * Membership Price — `number`
	 *
	 *
	 */
	price?: number

	/**
	 * Membership Description — `markdown`
	 *
	 *
	 */
	description?: Markdown

	/**
	 * Benefits Included — `array`
	 *
	 *
	 */
	benefits?: Array<SanityKeyed<string>>

	/**
	 * Courses Included with Purchase — `array`
	 *
	 *
	 */
	missions?: Array<SanityKeyedReference<Mission>>

	/**
	 * Avatar — `image`
	 *
	 *
	 */
	avatar?: {
		_type: 'image'
		asset: SanityReference<SanityImageAsset>
		crop?: SanityImageCrop
		hotspot?: SanityImageHotspot
	}

	/**
	 * Discount Included — `number`
	 *
	 *
	 */
	discount?: number
}

export type Answer = {
	_type: 'answer'
	/**
	 * Answers — `string`
	 *
	 *
	 */
	answers?: string

	/**
	 * Is this the correct answer? — `boolean`
	 *
	 *
	 */
	correct?: boolean
}

export type Documents = Certification | Mission | Stage | Video | Instructor | Checkpoint | Question | User | Webinar | Track | Quiz | QuizAttempt | Progress | Enrollment | RiskManagerProfile | Company | Marketing | Membership

/**
 * This interface is a stub. It was referenced in your sanity schema but
 * the definition was not actually found. Future versions of
 * sanity-codegen will let you type this explicity.
 */
type Markdown = any

/**
 * This interface is a stub. It was referenced in your sanity schema but
 * the definition was not actually found. Future versions of
 * sanity-codegen will let you type this explicity.
 */
type VimeoVideo = any
