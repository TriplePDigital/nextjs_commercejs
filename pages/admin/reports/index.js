import React, { useRef, useState } from 'react'
import { getSession } from 'next-auth/client'
import { fetcher } from '@/util/fetcher'
import getUserFromSession from '@/util/getUserFromSession'
import ProficiencyMatrix from '@/components/util/ProficiencyMatrix'
import { RiskManagementProfile } from '../../user/student/[id]'
import { flexRender, getCoreRowModel, getExpandedRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'
import { GrClose } from 'react-icons/gr'
import { RiskManagerMatrixReport } from '@/components/RM/RiskManagerMatrix'

const ReportingPage = ({ data, companyData }) => {
	const [riskMangers, setRiskMangers] = useState(data)
	const [expanded, setExpanded] = useState({})
	const [selectedCompany, setSelectedCompany] = useState([])
	const [selectedFacility, setSelectedFacility] = useState(null)

	const [sortByCompany, setSortByCompany] = useState(null)
	const [sortByFacility, setSortByFacility] = useState(null)

	const userRef = useRef(null)

	const filterRiskManagers = (companyID) => {
		if (selectedCompany?.length > 0) {
			selectedCompany.forEach((company) => {
				return data.filter((rm, index, self) => {
					return rm.parentCompany._id === company._id
				})
			})
		} else {
			return data.filter((rm, index, self) => {
				return rm.parentCompany._id === companyID
			})
		}
	}

	const filterRiskManagersByName = (query) => {
		return data.filter((rm, index, self) => {
			const name = `${rm.firstName} ${rm.lastName}`
			return name.toLowerCase().includes(query) || rm.email.toLowerCase().includes(query)
		})
	}

	const filterDuplicateProgressDocuments = (enrollments) => {
		return enrollments.map((enrollment) => {
			return enrollment.progress.filter((pd, index, self) => {
				return self.findIndex((pd2) => (pd2.content._ref === pd.content._ref) === index)
			})
		})
	}

	const findMaxScoreInCourse = (course) => {
		// map over all the chapters in the course
		// find all the checkpoints in the chapter
		// aggregate the max scores for each checkpoint
		// return the max score for the chapter
		// return the max score for the course

		const maxScores = course.chapters.map((chapter) => {
			return chapter.checkpoints
				.map((checkpoint) => {
					return checkpoint.maxScore
				})
				.reduce((a, b) => {
					return a + b
				})
				.toFixed(2)
		})
	}

	const columns = React.useMemo(
		() => [
			{
				header: 'Name',
				footer: (props) => props.column.id,
				columns: [
					{
						accessorKey: 'firstName',
						header: ({ table }) => (
							<>
								<IndeterminateCheckbox
									{...{
										checked: table.getIsAllRowsSelected(),
										indeterminate: table.getIsSomeRowsSelected(),
										onChange: table.getToggleAllRowsSelectedHandler()
									}}
								/>{' '}
								<button
									{...{
										onClick: table.getToggleAllRowsExpandedHandler()
									}}
								>
									{table.getIsAllRowsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
								</button>{' '}
								First Name
							</>
						),
						cell: ({ row, getValue }) => (
							<div
								style={{
									// Since rows are flattened by default,
									// we can use the row.depth property
									// and paddingLeft to visually indicate the depth
									// of the row
									paddingLeft: `${row.depth * 2}rem`
								}}
							>
								<>
									<IndeterminateCheckbox
										{...{
											checked: row.getIsSelected(),
											indeterminate: row.getIsSomeSelected(),
											onChange: row.getToggleSelectedHandler()
										}}
									/>{' '}
									{row.getCanExpand() ? (
										<button
											{...{
												onClick: row.getToggleExpandedHandler(),
												style: { cursor: 'pointer' }
											}}
										>
											{row.getIsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
										</button>
									) : (
										<GrClose />
									)}{' '}
									{getValue()}
								</>
							</div>
						),
						footer: (props) => props.column.id
					},
					{
						accessorFn: (row) => row.lastName,
						id: 'lastName',
						cell: (info) => info.getValue(),
						header: () => <span>Last Name</span>,
						footer: (props) => props.column.id
					},
					{
						accessorFn: (row) => row.email,
						id: 'email',
						cell: (info) => info.getValue(),
						header: () => <span>Last Name</span>,
						footer: (props) => props.column.id
					}
				]
			},
			{
				header: 'Info',
				footer: (props) => props.column.id,
				columns: [
					{
						accessorKey: 'enrollments',
						cell: (info) => Number(info.getValue().length),
						header: () => 'Enrollments',
						footer: (props) => props.column.id
					},
					{
						header: 'More Info',
						columns: [
							{
								accessorKey: 'parentCompany',
								header: () => 'Company',
								cell: (info) => {
									if (info.getValue() !== null) {
										const { name } = info.getValue()
										return name
									}
									return 'N/A'
								},
								footer: (props) => props.column.id
							},
							{
								accessorKey: '_id',
								header: () => 'Dummy Data',
								cell: () => {
									return 'N/A'
								},
								footer: (props) => props.column.id
							}
						]
					}
				]
			}
		],
		[]
	)

	const table = useReactTable({
		data,
		columns,
		state: {
			expanded
		},
		onExpandedChange: setExpanded,
		getSubRows: (row) => row.subRows,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		debugTable: true
	})

	return (
		<section className="w-2/3">
			<h1>Risk Manager Reports</h1>
			<div className="overflow-x-auto relative shadow-md sm:rounded-lg">
				<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
					<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
						<tr>
							<th
								scope="col"
								className="py-3 px-6"
							>
								Name
							</th>
							<th
								scope="col"
								className="py-3 px-6"
							>
								Email
							</th>
							<th
								scope="col"
								className="py-3 px-6"
							>
								Enrollments
							</th>
							<th
								scope="col"
								className="py-3 px-6"
							>
								Company
							</th>
							<th
								scope="col"
								className="py-3 px-6"
							>
								Expand
							</th>
						</tr>
					</thead>
					<tbody>
						{riskMangers.map((riskManager, index) => (
							<>
								<tr
									className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 relative"
									key={index}
								>
									<th
										scope="row"
										className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
									>
										{riskManager.firstName} {riskManager.lastName}
									</th>
									<td className="py-4 px-6">{riskManager.email}</td>
									<td className="py-4 px-6">{riskManager.enrollments.length}</td>
									<td className="py-4 px-6">{riskManager?.parentCompany?.name}</td>
									<td className="py-4 px-6">
										<button
											className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
											onClick={(e) => {
												setExpanded((prev) => {
													if (prev) {
														return null
													} else {
														return e.target.value
													}
												})
											}}
											value={riskManager._id}
										>
											Expand
										</button>
									</td>
								</tr>
								<tr className={`${expanded === riskManager._id ? 'block' : 'hidden'} w-full`}>{riskManager?.riskManagerProfile ? <RiskManagerMatrixReport profile={riskManager?.riskManagerProfile} /> : null}</tr>
							</>
						))}
					</tbody>
				</table>
			</div>
			<div>
				<table className="w-full">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<th
											key={header.id}
											colSpan={header.colSpan}
										>
											{header.isPlaceholder ? null : (
												<div>
													{flexRender(header.column.columnDef.header, header.getContext())}
													{header.column.getCanFilter() ? (
														<div>
															<Filter
																column={header.column}
																table={table}
															/>
														</div>
													) : null}
												</div>
											)}
										</th>
									)
								})}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => {
							return (
								<tr
									key={row.id}
									className="border-b"
								>
									{row.getVisibleCells().map((cell) => {
										return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
									})}
								</tr>
							)
						})}
					</tbody>
				</table>
				<div className="flex items-center gap-2">
					{table.getRowModel().rows.length >= table.getState().pagination.pageSize ? (
						<>
							<button
								className="border rounded p-1"
								onClick={() => table.setPageIndex(0)}
								disabled={!table.getCanPreviousPage()}
							>
								{'<<'}
							</button>
							<button
								className="border rounded p-1"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								{'<'}
							</button>
							<button
								className="border rounded p-1"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								{'>'}
							</button>
							<button
								className="border rounded p-1"
								onClick={() => table.setPageIndex(table.getPageCount() - 1)}
								disabled={!table.getCanNextPage()}
							>
								{'>>'}
							</button>
							<span className="flex items-center gap-1">
								<div>Page</div>
								<strong>
									{table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
								</strong>
							</span>
							<span className="flex items-center gap-1">
								| Go to page:
								<input
									type="number"
									defaultValue={table.getState().pagination.pageIndex + 1}
									onChange={(e) => {
										const page = e.target.value ? Number(e.target.value) - 1 : 0
										table.setPageIndex(page)
									}}
									className="border p-1 rounded w-16"
								/>
							</span>
							<select
								value={table.getState().pagination.pageSize}
								onChange={(e) => {
									table.setPageSize(Number(e.target.value))
								}}
							>
								{[10, 20, 30, 40, 50].map((pageSize) => (
									<option
										key={pageSize}
										value={pageSize}
									>
										Show {pageSize}
									</option>
								))}
							</select>
							<div>{table.getRowModel().rows.length} Rows</div>
							<pre>{JSON.stringify(expanded, null, 2)}</pre>
						</>
					) : null}
				</div>
			</div>
		</section>
	)
}

function Filter({ column, table }) {
	const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id)

	const columnFilterValue = column.getFilterValue()

	console.log({
		value: firstValue,
		type: typeof firstValue
	})

	return typeof firstValue === 'number' ? (
		<div className="flex space-x-2">
			<input
				type="number"
				value={columnFilterValue?.[0] ?? ''}
				onChange={(e) => column.setFilterValue((old) => [e.target.value, old?.[1]])}
				placeholder={`Min`}
				className="w-24 border shadow rounded"
			/>
			<input
				type="number"
				value={columnFilterValue?.[1] ?? ''}
				onChange={(e) => column.setFilterValue((old) => [old?.[0], e.target.value])}
				placeholder={`Max`}
				className="w-24 border shadow rounded"
			/>
		</div>
	) : (
		<input
			type="text"
			value={columnFilterValue ?? ''}
			onChange={(e) => column.setFilterValue(e.target.value)}
			placeholder={`Search...`}
			className="w-36 border shadow rounded"
		/>
	)
}

function IndeterminateCheckbox({ indeterminate, className = '', ...rest }) {
	const ref = React.useRef(null)

	React.useEffect(() => {
		if (typeof indeterminate === 'boolean') {
			ref.current.indeterminate = !rest.checked && indeterminate
		}
	}, [ref, indeterminate])

	return (
		<input
			type="checkbox"
			ref={ref}
			className={className + ' cursor-pointer'}
			{...rest}
		/>
	)
}

export default ReportingPage

export async function getServerSideProps(context) {
	const session = await getSession(context)
	if (!session) {
		return {
			redirect: {
				destination: '/auth/login',
				permanent: false
			}
		}
	} else {
		const user = await getUserFromSession(session.user.email)
		if (user.role === 'riskManager' || user.role === 'admin') {
			const query = `
        *[_type == "user" && role in ["riskManager", "admin"]]{
          _id,
          firstName,
          lastName,
          email,
          "avatar": avatar.asset->,
          role,
          "enrollments": *[_type == "enrollment" && references(^._id)]{
            course->,
            "progress": *[_type == "progress" && references(^._id)]{
              content->,
              status,
              _id,
              _createdAt,
            },
          },
          "parentCompany": *[_type == "company" && references(^._id)][0]{
            ...,
          },
          "riskManagerProfile": *[_type == "riskManagerProfile" && references(^._id)][0]{...},
        }
      `
			const data = await fetcher(query, true)

			const companyQuery = `
        *[_type == "company"]{...}
      `

			const companyData = await fetcher(companyQuery, true)
			return {
				props: {
					data,
					companyData
				}
			}
		} else {
			return {
				redirect: {
					destination: '/missions',
					permanent: false
				}
			}
		}
	}
}
