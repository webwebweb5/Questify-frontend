'use client';

import PropTypes from 'prop-types';
import { ChevronsLeftRight } from 'lucide-react';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as ResizablePrimitive from 'react-resizable-panels';

import { cn } from 'src/lib/utils';

const ResizablePanelGroup = ({ className, ...props }) => (
  <ResizablePrimitive.PanelGroup
    className={cn('flex h-full w-full data-[panel-group-direction=vertical]:flex-col', className)}
    {...props}
  />
);

ResizablePanelGroup.propTypes = {
  className: PropTypes.string,
  props: PropTypes.object,
};

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({ withHandle, className, ...props }) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      'relative flex w-2 items-center justify-center bg-border/20 rounded-sm after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-2 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90',
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-6 w-4 items-center justify-center rounded-sm bg-border">
        <ChevronsLeftRight className="h-5 w-5 text-black" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
);

ResizableHandle.propTypes = {
  withHandle: PropTypes.bool,
  className: PropTypes.string,
  props: PropTypes.object,
};

export { ResizablePanel, ResizableHandle, ResizablePanelGroup };
