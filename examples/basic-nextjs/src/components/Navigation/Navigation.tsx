export const Default = () => {
  return (
    <div>
      <div className="component-content">
        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
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
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "20px",
              margin: 0,
              padding: 0,
              color: "#8a8a8a",
              fontSize: "15px",
            }}
          >
            {["Products", "Rates", "About", "Contact"].map((item) => (
              <li
                key={item}
                style={{
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};