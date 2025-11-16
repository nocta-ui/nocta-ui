'use client';

import { Button } from '@/app/components/ui/button';
import type React from 'react';
import {
	PieChart,
	PieChartActions,
	PieChartGraph,
	PieChartDataTable,
	PieChartDataTableContent,
	PieChartDescription,
	PieChartHeader,
	PieChartLegend,
	PieChartTitle,
} from './pie-chart';

const channelData = [
	{ channel: 'Direct', visitors: 3200 },
	{ channel: 'Organic', visitors: 5400 },
	{ channel: 'Paid', visitors: 2300 },
	{ channel: 'Referral', visitors: 1800 },
	{ channel: 'Social', visitors: 1500 },
];

const planData = [
	{ plan: 'Starter', users: 1280 },
	{ plan: 'Growth', users: 2870 },
	{ plan: 'Scale', users: 1960 },
	{ plan: 'Enterprise', users: 620 },
];

const campaignData = [
	{ campaign: 'Email', conversions: 420 },
	{ campaign: 'Paid Ads', conversions: 310 },
	{ campaign: 'Webinar', conversions: 180 },
	{ campaign: 'Social', conversions: 260 },
];

const revenueData = [
	{ region: 'North America', revenue: 48800 },
	{ region: 'Europe', revenue: 31200 },
	{ region: 'Asia Pacific', revenue: 27600 },
	{ region: 'Latin America', revenue: 16450 },
];

export const PieChartBasicDemo: React.FC = () => (
	<div className="my-6">
		<PieChart data={channelData} valueKey="visitors" nameKey="channel" sortSlices>
			<PieChartHeader>
				<PieChartTitle>Traffic by Channel</PieChartTitle>
				<PieChartDescription>
					Quickly compare inbound traffic sources for the current quarter.
				</PieChartDescription>
			</PieChartHeader>
			<PieChartGraph height={320} ariaLabel="Traffic share by channel" />
			<PieChartLegend />
		</PieChart>
	</div>
);

export const PieChartDonutDemo: React.FC = () => (
	<div className="my-6">
		<PieChart data={planData} valueKey="users" nameKey="plan">
			<PieChartHeader>
				<PieChartTitle>Active Accounts by Plan</PieChartTitle>
				<PieChartDescription>
					Donut layout highlights relative share of subscriptions.
				</PieChartDescription>
			</PieChartHeader>
			<PieChartGraph
				height={320}
				innerRadius="55%"
				padAngle={2}
				cornerRadius={4}
				ariaLabel="Active accounts by plan"
			>
				<div className="text-center">
					<p className="text-xs uppercase tracking-wide text-foreground/45">
						Total users
					</p>
					<p className="text-2xl font-medium text-foreground">
						{planData.reduce((sum, item) => sum + item.users, 0).toLocaleString()}
					</p>
				</div>
			</PieChartGraph>
			<PieChartLegend />
		</PieChart>
	</div>
);

export const PieChartWithActionsDemo: React.FC = () => (
	<div className="my-6">
		<PieChart data={campaignData} valueKey="conversions" nameKey="campaign">
			<PieChartHeader
				contentClassName="sm:max-w-xs"
				titleClassName="text-lg font-medium"
				actionsClassName="flex-wrap gap-2"
			>
				<PieChartTitle>Campaign Conversions</PieChartTitle>
				<PieChartDescription>
					Compare how each acquisition channel performed this quarter.
				</PieChartDescription>
				<PieChartActions>
					<Button size="sm" variant="ghost">
						Download CSV
					</Button>
					<Button size="sm">View Report</Button>
				</PieChartActions>
			</PieChartHeader>
			<PieChartGraph
				height={300}
				innerRadius="45%"
				padAngle={1}
				ariaLabel="Campaign conversion share"
			/>
			<PieChartLegend />
		</PieChart>
	</div>
);

export const PieChartWithDataTableDemo: React.FC = () => (
	<div className="my-6">
		<PieChart data={revenueData} valueKey="revenue" nameKey="region" sortSlices>
			<PieChartHeader descriptionClassName="text-foreground/60">
				<PieChartTitle>Quarterly Revenue by Region</PieChartTitle>
				<PieChartDescription>
					Break down revenue contribution and drill into each market below.
				</PieChartDescription>
			</PieChartHeader>
			<PieChartGraph height={300} ariaLabel="Revenue share by region" />
			<PieChartDataTable>
				<PieChartDataTableContent
					totalLabel="Total revenue"
					totalFormatter={(total) =>
						total.toLocaleString(undefined, {
							style: 'currency',
							currency: 'USD',
							maximumFractionDigits: 0,
						})
					}
				/>
			</PieChartDataTable>
		</PieChart>
	</div>
);
