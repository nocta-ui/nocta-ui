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
  { month: 'Jan', revenue: 25000 },
  { month: 'Feb', revenue: 29325 },
  { month: 'Mar', revenue: 32277 },
  { month: 'Apr', revenue: 32918 },
  { month: 'May', revenue: 31045 },
  { month: 'Jun', revenue: 27253 },
  { month: 'Jul', revenue: 22746 },
  { month: 'Aug', revenue: 18954 },
  { month: 'Sep', revenue: 17081 },
  { month: 'Oct', revenue: 17722 },
  { month: 'Nov', revenue: 20674 },
  { month: 'Dec', revenue: 24999 },
];

const sessionDuration = [
  { day: 'Mon', minutes: 9.8 },
  { day: 'Tue', minutes: 10.2 },
  { day: 'Wed', minutes: 9.3 },
  { day: 'Thu', minutes: 8.2 },
  { day: 'Fri', minutes: 7.8 },
  { day: 'Sat', minutes: 8.7 },
  { day: 'Sun', minutes: 9.8 },
];

const supportTickets = [
  { week: 'Week 1', tickets: 75 },
  { week: 'Week 2', tickets: 84 },
  { week: 'Week 3', tickets: 106 },
  { week: 'Week 4', tickets: 123 },
  { week: 'Week 5', tickets: 123 },
  { week: 'Week 6', tickets: 106 },
  { week: 'Week 7', tickets: 84 },
  { week: 'Week 8', tickets: 75 },
];

const acquisitionChannels = [
  { month: 'Jan', organic: 600, paid: 300 },
  { month: 'Feb', organic: 708, paid: 354 },
  { month: 'Mar', organic: 781, paid: 390 },
  { month: 'Apr', organic: 797, paid: 398 },
  { month: 'May', organic: 751, paid: 375 },
  { month: 'Jun', organic: 656, paid: 328 },
  { month: 'Jul', organic: 543, paid: 271 },
  { month: 'Aug', organic: 448, paid: 224 },
  { month: 'Sep', organic: 402, paid: 201 },
  { month: 'Oct', organic: 418, paid: 209 },
  { month: 'Nov', organic: 491, paid: 245 },
  { month: 'Dec', organic: 600, paid: 300 },
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
