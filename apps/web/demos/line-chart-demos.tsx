'use client';

import { Button } from '@nocta/registry/ui/button';
import React from 'react';
import {
	LineChart,
	LineChartActions,
	LineChartDataTable,
	LineChartDataTableContent,
	LineChartDescription,
	LineChartGraph,
	LineChartHeader,
	LineChartLegend,
	LineChartTitle,
} from '@nocta/registry/ui/line-chart';

const revenueTrend = [
  { month: 'Jan', revenue: 18500 },
  { month: 'Feb', revenue: 32400 },
  { month: 'Mar', revenue: 27950 },
  { month: 'Apr', revenue: 46820 },
  { month: 'May', revenue: 39210 },
  { month: 'Jun', revenue: 58740 },
  { month: 'Jul', revenue: 31180 },
  { month: 'Aug', revenue: 74220 },
  { month: 'Sep', revenue: 42110 },
  { month: 'Oct', revenue: 91280 },
  { month: 'Nov', revenue: 50640 },
  { month: 'Dec', revenue: 84310 },
];

const sessionDuration = [
  { day: 'Mon', minutes: 6.3 },
  { day: 'Tue', minutes: 12.8 },
  { day: 'Wed', minutes: 9.1 },
  { day: 'Thu', minutes: 15.7 },
  { day: 'Fri', minutes: 5.4 },
  { day: 'Sat', minutes: 17.2 },
  { day: 'Sun', minutes: 10.6 },
];

const supportTickets = [
  { week: 'Week 1', tickets: 48 },
  { week: 'Week 2', tickets: 132 },
  { week: 'Week 3', tickets: 76 },
  { week: 'Week 4', tickets: 204 },
  { week: 'Week 5', tickets: 97 },
  { week: 'Week 6', tickets: 261 },
  { week: 'Week 7', tickets: 63 },
  { week: 'Week 8', tickets: 189 },
];

const acquisitionChannels = [
  { month: 'Jan', organic: 320, paid: 540 },
  { month: 'Feb', organic: 710, paid: 210 },
  { month: 'Mar', organic: 460, paid: 780 },
  { month: 'Apr', organic: 915, paid: 355 },
  { month: 'May', organic: 388, paid: 602 },
  { month: 'Jun', organic: 1040, paid: 274 },
  { month: 'Jul', organic: 575, paid: 910 },
  { month: 'Aug', organic: 301, paid: 438 },
  { month: 'Sep', organic: 812, paid: 193 },
  { month: 'Oct', organic: 427, paid: 689 },
  { month: 'Nov', organic: 1190, paid: 322 },
  { month: 'Dec', organic: 533, paid: 887 },
];

export const LineChartBasicDemo: React.FC = () => (
	<div className="my-6">
		<LineChart className="md:w-lg" data={revenueTrend} xKey="month" yKey="revenue" sortPoints={false}>
			<LineChartHeader>
				<LineChartTitle>Streaming Revenue by Month</LineChartTitle>
				<LineChartDescription>
					See how launches, campaigns, and seasonality impact your monthly earnings.
				</LineChartDescription>
			</LineChartHeader>
			<LineChartGraph showYAxisValues={false} ariaLabel="Monthly streaming revenue pattern" />
			<LineChartLegend />
		</LineChart>
	</div>
);

export const LineChartComparisonDemo: React.FC = () => (
	<div className="my-6">
		<LineChart
			className="md:w-lg"
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
			<LineChartHeader>
				<LineChartTitle>Signup Mix by Channel</LineChartTitle>
				<LineChartDescription>
					Compare volatile shifts between organic growth and paid acquisition over the year.
				</LineChartDescription>
			</LineChartHeader>
			<LineChartGraph ariaLabel="Organic and paid signups over time" />
			<LineChartLegend />
		</LineChart>
	</div>
);

export const LineChartWithActionsDemo: React.FC = () => (
	<div className="my-6">
		<LineChart
			className="md:w-lg"
			data={sessionDuration}
			xKey="day"
			yKey="minutes"
			seriesLabel="Median session duration"
		>
			<LineChartHeader
				contentClassName="sm:max-w-xs"
				actionsClassName="flex-wrap gap-2"
			>
				<LineChartTitle>Session Depth by Day</LineChartTitle>
				<LineChartDescription>
				  Hover to compare daily engagement.
				</LineChartDescription>
				<LineChartActions>
					<Button size="sm" variant="ghost">
						Download CSV
					</Button>
					<Button size="sm">Open cohort view</Button>
				</LineChartActions>
			</LineChartHeader>
			<LineChartGraph
				curve="monotone"
				ariaLabel="Median session duration in minutes by weekday"
			/>
			<LineChartLegend />
		</LineChart>
	</div>
);

export const LineChartWithDataTableDemo: React.FC = () => (
	<div className="my-6">
		<LineChart className="md:w-lg" data={supportTickets} xKey="week" yKey="tickets" sortPoints={false}>
			<LineChartHeader>
				<LineChartTitle>Weekly Support Queue</LineChartTitle>
				<LineChartDescription>
					Track incoming ticket spikes so you can rebalance agents before queues explode.
				</LineChartDescription>
			</LineChartHeader>
			<LineChartGraph showGrid ariaLabel="Support tickets created per week" />
			<LineChartDataTable>
				<LineChartDataTableContent
					averageLabel="Average weekly tickets"
					averageFormatter={(average) =>
						Math.round(average).toLocaleString(undefined, {
							maximumFractionDigits: 0,
						})
					}
				/>
			</LineChartDataTable>
		</LineChart>
	</div>
);
