'use client';

import { Button } from '@/app/components/ui/button';
import React from 'react';
import {
	AreaChart,
	AreaChartActions,
	AreaChartDataTable,
	AreaChartDataTableContent,
	AreaChartDescription,
	AreaChartGraph,
	AreaChartHeader,
	AreaChartLegend,
	AreaChartTitle,
} from './area-chart';

const revenueTrend = [
	{ month: 'Jan', revenue: 18600 },
	{ month: 'Feb', revenue: 21450 },
	{ month: 'Mar', revenue: 23200 },
	{ month: 'Apr', revenue: 24890 },
	{ month: 'May', revenue: 26650 },
	{ month: 'Jun', revenue: 27980 },
	{ month: 'Jul', revenue: 29540 },
	{ month: 'Aug', revenue: 31010 },
	{ month: 'Sep', revenue: 32900 },
	{ month: 'Oct', revenue: 34280 },
	{ month: 'Nov', revenue: 36150 },
	{ month: 'Dec', revenue: 38240 },
];

const activeUsers = [
	{ label: 'Week 1', users: 1280 },
	{ label: 'Week 2', users: 1540 },
	{ label: 'Week 3', users: 1685 },
	{ label: 'Week 4', users: 2104 },
	{ label: 'Week 5', users: 1970 },
	{ label: 'Week 6', users: 2214 },
	{ label: 'Week 7', users: 2360 },
	{ label: 'Week 8', users: 2555 },
];

const sessionDuration = [
	{ day: 'Mon', minutes: 8.2 },
	{ day: 'Tue', minutes: 8.6 },
	{ day: 'Wed', minutes: 9.1 },
	{ day: 'Thu', minutes: 9.4 },
	{ day: 'Fri', minutes: 9.8 },
	{ day: 'Sat', minutes: 10.3 },
	{ day: 'Sun', minutes: 10.9 },
];

const supportTickets = [
	{ week: 'Week 1', tickets: 84 },
	{ week: 'Week 2', tickets: 73 },
	{ week: 'Week 3', tickets: 92 },
	{ week: 'Week 4', tickets: 110 },
	{ week: 'Week 5', tickets: 128 },
	{ week: 'Week 6', tickets: 101 },
	{ week: 'Week 7', tickets: 96 },
	{ week: 'Week 8', tickets: 88 },
];

const acquisitionChannels = [
	{ month: 'Jan', organic: 480, paid: 260 },
	{ month: 'Feb', organic: 540, paid: 310 },
	{ month: 'Mar', organic: 610, paid: 350 },
	{ month: 'Apr', organic: 670, paid: 400 },
	{ month: 'May', organic: 730, paid: 460 },
	{ month: 'Jun', organic: 690, paid: 500 },
	{ month: 'Jul', organic: 640, paid: 470 },
	{ month: 'Aug', organic: 700, paid: 520 },
	{ month: 'Sep', organic: 770, paid: 560 },
	{ month: 'Oct', organic: 830, paid: 610 },
	{ month: 'Nov', organic: 790, paid: 580 },
	{ month: 'Dec', organic: 850, paid: 630 },
];



export const AreaChartBasicDemo: React.FC = () => (
	<div className="my-6">
		<AreaChart className='md:w-lg' data={revenueTrend} xKey="month" yKey="revenue" sortPoints={false}>
			<AreaChartHeader>
				<AreaChartTitle>Monthly Recurring Revenue</AreaChartTitle>
				<AreaChartDescription>
					Track consistent growth across the current fiscal year.
				</AreaChartDescription>
			</AreaChartHeader>
			<AreaChartGraph showYAxisValues={false} ariaLabel="Monthly recurring revenue trend" />
			<AreaChartLegend />
		</AreaChart>
	</div>
);

export const AreaChartComparisonDemo: React.FC = () => (
	<div className="my-6">
		<AreaChart
			className='md:w-lg'
			data={acquisitionChannels}
			xKey="month"
			yKey="organic"
			seriesLabel="Organic signups"
			additionalSeries={[
				{
					id: 'paid-signups',
					yKey: 'paid',
					seriesLabel: 'Paid signups',
				},
			]}
		>
			<AreaChartHeader>
				<AreaChartTitle>Signup Channels</AreaChartTitle>
				<AreaChartDescription>
					Track organic and paid conversions side by side.
				</AreaChartDescription>
			</AreaChartHeader>
			<AreaChartGraph ariaLabel="Organic and paid signups over time" />
			<AreaChartLegend />
		</AreaChart>
	</div>
);

export const AreaChartMetricDemo: React.FC = () => (
	<div className="my-6">
		<AreaChart className='md:w-lg' data={activeUsers} xKey="label" yKey="users">
			<AreaChartHeader>
				<AreaChartTitle>Active Accounts</AreaChartTitle>
				<AreaChartDescription>
					Compare account engagement week over week.
				</AreaChartDescription>
			</AreaChartHeader>
			<AreaChartGraph curve="natural" ariaLabel="Active accounts per week">
				<div className="text-center">
					<p className="text-xs uppercase tracking-wide text-foreground/45">
						Last 8 weeks
					</p>
					<p className="text-2xl font-semibold text-foreground">
						{activeUsers.reduce((sum, item) => sum + item.users, 0).toLocaleString()}
					</p>
				</div>
			</AreaChartGraph>
			<AreaChartLegend />
		</AreaChart>
	</div>
);

export const AreaChartWithActionsDemo: React.FC = () => (
	<div className="my-6">
		<AreaChart className='md:w-lg' data={sessionDuration} xKey="day" yKey="minutes" seriesLabel="Session duration">
			<AreaChartHeader
				contentClassName="sm:max-w-xs"
				actionsClassName="flex-wrap gap-2"
			>
				<AreaChartTitle>Average Session Length</AreaChartTitle>
				<AreaChartDescription>
					Hover to compare behavior across the week.
				</AreaChartDescription>
				<AreaChartActions>
					<Button size="sm" variant="ghost">
						Export CSV
					</Button>
					<Button size="sm">View Cohort</Button>
				</AreaChartActions>
			</AreaChartHeader>
			<AreaChartGraph
				curve="monotone"
				ariaLabel="Average session duration"
			/>
			<AreaChartLegend />
		</AreaChart>
	</div>
);

export const AreaChartWithDataTableDemo: React.FC = () => (
	<div className="my-6">
		<AreaChart className='md:w-lg' data={supportTickets} xKey="week" yKey="tickets" sortPoints={false}>
			<AreaChartHeader>
				<AreaChartTitle>Support Volume</AreaChartTitle>
				<AreaChartDescription>
					Monitor ticket inflow and spot surges that may require staffing changes.
				</AreaChartDescription>
			</AreaChartHeader>
			<AreaChartGraph showGrid ariaLabel="Support tickets created per week" />
			<AreaChartDataTable>
				<AreaChartDataTableContent
					averageLabel="Average tickets"
					averageFormatter={(average) =>
						Math.round(average).toLocaleString(undefined, {
							maximumFractionDigits: 0,
						})
					}
				/>
			</AreaChartDataTable>
		</AreaChart>
	</div>
);
