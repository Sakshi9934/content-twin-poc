import React, { JSX } from "react";
import {
  ComponentParams,
  ComponentRendering,
} from "@sitecore-content-sdk/nextjs";

import AgentDemoClient from "./AgentDemoClient";

interface AgentDemoProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: AgentDemoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;

  return (
    <div
      className={`component ${props.params.styles}`}
      id={id || undefined}
    >
      <AgentDemoClient />
    </div>
  );
};