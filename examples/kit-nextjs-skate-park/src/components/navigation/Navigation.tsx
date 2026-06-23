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

// export const Default = (props: RichTextBlockAProps): JSX.Element => {
//   const id = props.params.RenderingIdentifier;
//   // const text = props.rendering.fields?.text.value;

//   console.log(props);

//   return (
//     <div
//       className={`component ${props.params.styles}`}
//       id={id ? id : undefined}
//     >
//       <div className="component-content">
//         <nav
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             padding: "12px 24px",
//             background: "linear-gradient(90deg, #0f9d58, #34a853, #66bb6a)",
//             color: "white",
//             fontFamily: "Arial, sans-serif",
//           }}
//         >
//           <h2 style={{ margin: 0 }}>MyApp</h2>

//           <ul
//             style={{
//               listStyle: "none",
//               display: "flex",
//               gap: "20px",
//               margin: 0,
//               padding: 0,
//             }}
//           >
//             {["Home", "About", "Services", "Contact"].map((item) => (
//               <li key={item} style={{ cursor: "pointer" }}>
//                 {item}
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </div>
//     </div>
//   );
// };

export const Default = (props: RichTextBlockAProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;

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
            padding: "18px 28px",
            backgroundColor: "#f8f8f8",
            border: "1px solid #dcdcdc",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: 700,
              fontSize: "18px",
              color: "#1f9d94",
            }}
          >
            <span
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: "#1f9d94",
                transform: "rotate(45deg)",
                display: "inline-block",
              }}
            />
            NorthBank
          </div>

          <ul
            style={{
              listStyle: "none",
              display: "flex",
              gap: "24px",
              margin: 0,
              padding: 0,
              color: "#8a8a8a",
              fontSize: "15px",
            }}
          >
            {["Products", "Rates", "About", "Contact"].map((item) => (
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