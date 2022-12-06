import ProficiencyMatrix from '@/components/util/ProficiencyMatrix'
import camelCaseToWords from '@/util/undoCamelCase'

export const RiskManagerMatrixReport = ({ profile, fallbackDate = new Date() }) => {
	return (
		<div className="flex flex-col">
			<h2 className="mt-4 font-bold">Assessment Proficiency</h2>
			<div className="flex gap-2">
				{profile?.assessmentProficiency ? (
					Object.entries(profile.assessmentProficiency).map(([key, value], index) => {
						console.log(value)
						return (
							<div
								className="flex flex-col items-center justify-center"
								key={index}
							>
								<p>{camelCaseToWords(key)}</p>
								<ProficiencyMatrix
									status={value.status}
									timestamp={value.updatedAt}
								/>
							</div>
						)
					})
				) : (
					<ProficiencyMatrix
						status={undefined}
						timestamp={fallbackDate}
					/>
				)}
			</div>
			<h2 className="mt-4 font-bold">CRP Video Training</h2>
			<div className="flex gap-2">
				{profile?.crpVideoTraining ? (
					Object.entries(profile.crpVideoTraining).map(([key, value], index) => {
						return (
							<div
								className="flex flex-col items-center justify-center"
								key={index}
							>
								<p>{camelCaseToWords(key)}</p>
								<ProficiencyMatrix
									status={value.status}
									timestamp={value.updatedAt}
								/>
							</div>
						)
					})
				) : (
					<ProficiencyMatrix
						status={undefined}
						timestamp={fallbackDate}
					/>
				)}
			</div>
			<h2 className="mt-4 font-bold">Shadow Assessment</h2>
			<div className="flex gap-2">
				{profile?.shadowAssessment ? (
					<div className="flex flex-col items-center justify-center">
						<ProficiencyMatrix
							status={profile.shadowAssessment.status}
							timestamp={profile.shadowAssessment.updatedAt}
						/>
					</div>
				) : (
					<ProficiencyMatrix
						status={undefined}
						timestamp={fallbackDate}
					/>
				)}
			</div>
			<h2 className="mt-4 font-bold">Training Assessment</h2>
			<div className="flex gap-2">
				{profile?.trainingAssessments ? (
					Object.entries(profile.trainingAssessments).map(([key, value], index) => {
						return (
							<div
								className="flex flex-col items-center justify-center"
								key={index}
							>
								<p>{camelCaseToWords(key)}</p>
								<ProficiencyMatrix
									status={value.status}
									timestamp={value.updatedAt}
								/>
							</div>
						)
					})
				) : (
					<ProficiencyMatrix
						status={undefined}
						timestamp={fallbackDate}
					/>
				)}
			</div>
		</div>
	)
}
