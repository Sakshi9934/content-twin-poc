import React, { JSX } from "react";
import {
  ComponentParams,
  ComponentRendering,
} from "@sitecore-content-sdk/nextjs";

import AgentDemoClient from "./AgentDemoClient";

interface AgentDemoProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  page:ComponentParams;
}

export const Default = (props: AgentDemoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;

  // however you obtain the current path
  console.log(props.page.layout.sitecore.route.name); // replace with actual page path if needed

  let currentPath=props.page.layout.sitecore.route.name;

  console.log("currentPath:",currentPath);

  const apiEndpoint = currentPath === "ask-agentic"? "/api/agent/ask-agentic": "/api/agent/ask";

  console.log("api Endpoint:",apiEndpoint);

  return (
    <div
      className={`component ${props.params.styles}`}
      id={id || undefined}
    >
      <AgentDemoClient apiEndpoint={apiEndpoint} />
    </div>
  );
};