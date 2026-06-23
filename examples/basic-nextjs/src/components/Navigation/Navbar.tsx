import React, { JSX } from "react";
import {
  ComponentParams,
  ComponentRendering,
} from "@sitecore-content-sdk/nextjs";
import { RichText as ContentSdkRichText } from "@sitecore-content-sdk/nextjs";

interface RichTextBlockAProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: RichTextBlockAProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  // const text = props.rendering.fields?.text.value;

  console.log(props);

  return (
    <div
      className={`component ${props.params.styles}`}
      id={id ? id : undefined}
    >
      <div className="component-content">
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 24px",
            background: "linear-gradient(90deg, #0f9d58, #34a853, #66bb6a)",
            color: "white",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h2 style={{ margin: 0 }}>MyApp</h2>

          <ul
            style={{
              listStyle: "none",
              display: "flex",
              gap: "20px",
              margin: 0,
              padding: 0,
            }}
          >
            {["Home", "About", "Services", "Contact"].map((item) => (
              <li key={item} style={{ cursor: "pointer" }}>
                {item}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};
