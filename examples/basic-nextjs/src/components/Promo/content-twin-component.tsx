// import React, { JSX } from "react";
// import {
//   ComponentParams,
//   ComponentRendering,
// } from "@sitecore-content-sdk/nextjs";

// interface ContentTwinProps {
//   rendering: ComponentRendering & { params: ComponentParams };
//   params: ComponentParams;
// }

// export const Default = (props: ContentTwinProps): JSX.Element => {
//   const id = props.params.RenderingIdentifier;

//   return (
//     <div
//       className={`component ${props.params.styles}`}
//       id={id || undefined}
//     >
//       <div className="component-content">
//         <div
//           style={{
//             display: "flex",
//             gap: "24px",
//             border: "1px solid #d9d9d9",
//             borderRadius: "6px",
//             padding: "24px",
//             fontFamily: "Arial, sans-serif",
//             background: "#fff",
//           }}
//         >
//           {/* Left Panel */}
//           <div
//             style={{
//               flex: 1,
//               border: "1px solid #d9d9d9",
//               borderRadius: "12px",
//               padding: "22px",
//             }}
//           >
//             <h3
//               style={{
//                 margin: 0,
//                 marginBottom: "14px",
//                 color: "#8c8c8c",
//                 fontSize: "16px",
//                 fontWeight: 700,
//                 letterSpacing: "1px",
//               }}
//             >
//               PAGE
//             </h3>

//             <select
//               style={{
//                 width: "100%",
//                 padding: "16px",
//                 fontSize: "18px",
//                 borderRadius: "10px",
//                 border: "2px solid #d7dde5",
//                 marginBottom: "16px",
//                 background: "#fff",
//               }}
//             >
//               <option>Home Loan for First-Time Buyers</option>
//               <option>Mortgage Overview</option>
//               <option>Bank Accounts</option>
//             </select>

//             <button
//               style={{
//                 width: "100%",
//                 padding: "16px",
//                 borderRadius: "10px",
//                 border: "2px solid #d7dde5",
//                 background: "#fff",
//                 fontSize: "18px",
//                 fontWeight: 600,
//                 cursor: "pointer",
//                 marginBottom: "22px",
//               }}
//             >
//               Load Source
//             </button>

//             <button
//               style={{
//                 width: "100%",
//                 padding: "18px",
//                 border: "none",
//                 borderRadius: "10px",
//                 background: "#2ba394",
//                 color: "#fff",
//                 fontSize: "20px",
//                 fontWeight: 700,
//                 cursor: "pointer",
//               }}
//             >
//               Generate Content Twin
//             </button>
//           </div>

//           {/* Right Panel */}
//           <div
//             style={{
//               flex: 1,
//               border: "1px solid #d9d9d9",
//               borderRadius: "12px",
//               padding: "22px",
//             }}
//           >
//             <h3
//               style={{
//                 margin: 0,
//                 marginBottom: "16px",
//                 color: "#8c8c8c",
//                 fontSize: "16px",
//                 fontWeight: 700,
//                 letterSpacing: "1px",
//               }}
//             >
//               NORMALIZED SOURCE PREVIEW
//             </h3>

//             <div
//               style={{
//                 background: "#fafafa",
//                 border: "1px solid #e5e5e5",
//                 borderRadius: "10px",
//                 padding: "20px",
//                 fontFamily: "Consolas, monospace",
//                 fontSize: "16px",
//                 lineHeight: "1.9",
//               }}
//             >
//               <div>
//                 <span style={{ color: "#7c4dff" }}>"title"</span>:{" "}
//                 <span style={{ color: "#16a085" }}>
//                   "Home Loan..."
//                 </span>,
//               </div>

//               <div>
//                 <span style={{ color: "#7c4dff" }}>"industry"</span>:{" "}
//                 <span style={{ color: "#16a085" }}>
//                   "Banking"
//                 </span>,
//               </div>

//               <div>
//                 <span style={{ color: "#7c4dff" }}>"audience"</span>:{" "}
//                 <span style={{ color: "#16a085" }}>
//                   "First-Time Buyers"
//                 </span>,
//               </div>

//               <div>
//                 <span style={{ color: "#7c4dff" }}>
//                   "lastReviewed"
//                 </span>
//                 :{" "}
//                 <span style={{ color: "#16a085" }}>
//                   "2026-06-19"
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

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

  return (
    <div
      className={`component ${props.params.styles}`}
      id={id || undefined}
    >
      <ContentTwinClient />
    </div>
  );
};