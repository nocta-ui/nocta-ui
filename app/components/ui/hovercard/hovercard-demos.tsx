'use client';

import type React from 'react';
import {
	Hovercard,
	HovercardContent,
	HovercardDescription,
	HovercardHeading,
	HovercardTrigger,
} from './hovercard';
import { Avatar } from '../avatar';
import { Button } from '../button';

export const BasicHovercardDemo: React.FC = () => {
	return (
		<div className="my-6 flex justify-center">
			<Hovercard>
				<HovercardTrigger>Hover for details</HovercardTrigger>
				<HovercardContent className="max-w-xs relative">
					<div className="flex-row space-y-2">
  					<div className="flex-col space-y-1">
       			  <Avatar
          		  src="https://avatars.githubusercontent.com/u/168720167?v=4"
          		  alt="66HEX"
                className='mb-2'
         			/>
              <HovercardHeading>@66HEX</HovercardHeading>
              <HovercardDescription>
             			Frontend developer specializing in building modern websites that perfectly balance technical excellence and creative insight.
              </HovercardDescription>
  					</div>
					</div>
					<Button asChild size="sm" className='absolute top-3 right-4 border border-border rounded-full'>
					  <a target="_blank" rel="noopener noreferrer" href='https://github.com/66HEX'>Follow</a>
					</Button>
				</HovercardContent>
			</Hovercard>
		</div>
	);
};
