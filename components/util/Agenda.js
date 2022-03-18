const getRandomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function Agenda({ time, title }) {
	return (
		<div className="bg-ncrma-300 px-6 py-8 my-3 rounded flex lg:flex-row flex-col text-center justify-between uppercase font-semibold relative overflow-hidden">
			<p className="text-white font-light lg:my-0 my-1 z-10">{time}</p>
			<p className="z-10">{title}</p>
			<Blob />
		</div>
	)
}

const Blob = () => {
	return (
		<>
			<svg
				xlink="http://www.w3.org/1999/xlink"
				viewBox="0 0 5000 2000"
				xmlns="http://www.w3.org/2000/svg"
				style={{
					transform: `scale(${getRandomInt(2, 3.5)})`,
					position: 'absolute',
					top: 30,
					left: 0,
					width: '100%',
					height: '100%',
					opacity: '1',
					zIndex: 0
				}}
			>
				<defs>
					<filter id="goo">
						<feGaussianBlur
							in="SourceGraphic"
							stdDeviation="25"
							result="blur"
						></feGaussianBlur>
						<feColorMatrix
							in="blur"
							type="matrix"
							values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 19 -9"
							result="good"
						></feColorMatrix>
						<feComposite
							in="SourceGraphic"
							in2="goo"
							operator="atop"
						></feComposite>
					</filter>
					<path
						d="M173,343C138,312 127,266 139,214C142,199 181,206 188,199C209,176 230,91 297,106C325,114 316,170 328,186C352,217 334,255 319,288C310,306 303,333 285,338C262,348 238,346 221,338C210,336 184,354 173,343z"
						id="P0"
					></path>
					<path
						d="M375,353C314,413 228,423 164,386C136,371 123,343 116,324C105,307 80,294 78,261C79,182 113,104 181,76C226,57 272,74 303,87C356,105 385,152 401,201C409,220 407,240 404,250C405,290 398,331 375,353z"
						id="P1"
					></path>
					<path
						d="M168,151Q179,31 272,73Q307,28 297,131Q401,125 381,225Q406,312 307,319Q292,380 250,342Q229,359 226,301Q159,286 180,227Q121,168 168,151z"
						id="P2"
					></path>
					<path
						d="M216,382C182,374 130,378 107,341C74,284 125,226 145,192C159,165 149,90 194,77C238,61 272,133 299,146C333,162 324,210 327,230C329,235 398,231 397,231C399,309 340,359 283,377C258,385 232,389 216,382z"
						id="P3"
					></path>
					<path
						d="M240,83C305,82 352,127 382,177C402,211 444,250 431,297C420,344 383,375 344,399C296,429 238,441 173,415C161,411 167,380 152,368C108,328 72,272 84,218C99,154 127,81 201,59C213,55 229,83 240,83z"
						id="P4"
					></path>
					<path
						d="M86,303Q66,177 201,172Q220,95 265,133Q327,129 316,219Q400,201 383,216Q478,324 375,383Q338,522 201,443Q106,425 157,294Q58,326 86,303z"
						id="P5"
					></path>
					<path
						d="M298,398C260,412 237,319 217,310C198,299 155,295 152,269C150,263 188,254 188,250C189,226 116,124 176,93C195,82 225,121 234,122C275,117 309,142 330,165C366,204 349,256 334,290C325,312 345,381 298,398z"
						id="P6"
					></path>
					<path
						d="M148,410C126,399 124,368 120,358C85,315 87,260 97,221C106,171 142,135 186,114C240,91 307,74 353,108C390,134 421,169 431,227C436,250 406,270 396,298C381,345 370,416 310,435C250,455 188,440 148,410z"
						id="P7"
					></path>
					<path
						d="M423,239Q457,317 335,330Q316,390 250,339Q186,412 145,349Q106,278 201,234Q161,194 198,179Q191,125 232,156Q331,45 417,144Q520,181 423,239z"
						id="P8"
					></path>
					<path
						d="M139,402C82,357 141,271 148,224C150,211 173,208 184,195C194,182 162,90 195,82C274,62 308,159 332,191C340,200 330,218 330,224C338,250 430,308 402,346C385,377 334,366 301,379C259,396 201,441 139,402z"
						id="P9"
					></path>
					<path
						d="M94,301C78,250 96,200 131,152C171,107 229,83 280,94C310,98 342,105 372,136C402,166 438,202 437,250C438,298 430,349 394,385C360,423 308,428 273,429C227,436 175,439 135,408C104,387 107,341 94,301z"
						id="P10"
					></path>
					<path
						d="M230,92Q316,48 335,160Q482,206 423,331Q443,410 327,371Q328,448 285,387Q222,397 215,298Q94,363 62,311Q38,223 180,199Q151,94 230,92z"
						id="P11"
					></path>
				</defs>
				<rect
					id="RECT"
					width="5000"
					height="1000"
					fill="transparent"
				></rect>
				<g id="group" fill="#5FBBBE" filter="url(#goo)">
					{Array.from(Array(100)).map((_, i) => (
						<Particle key={i} />
					))}
				</g>
			</svg>
		</>
	)
}

const Particle = () => {
	for (let i = 0; i < 100; i++) {
		return (
			<use
				x={getRandomInt(0, 5000)}
				y={getRandomInt(0, 1000)}
				href={`#P${getRandomInt(1, 11)}`}
			></use>
		)
	}
}
