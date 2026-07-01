import React, { JSX } from "react";
import {
  ComponentParams,
  ComponentRendering,
} from "@sitecore-content-sdk/nextjs";

import ContentTwinClient from "./ContentTwinClient";

interface ContentTwinProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: ContentTwinProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;

  const fields = props.rendering.fields as any;

  const pages =
    fields?.data?.datasource?.children?.results?.map((item: any) => ({
      name: item.name,
      href: item.field?.jsonValue?.value?.href,
    })) ?? [];

  return (
    <div
      className={`component ${props.params.styles}`}
      id={id || undefined}
    >
      <ContentTwinClient pages={pages} />
    </div>
  );
};