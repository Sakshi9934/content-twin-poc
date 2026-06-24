export const Default = () => {
  return (
    <div>
      <div className="component-content">
        <div
          style={{
            padding: "48px",
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, #1f9d94 0%, #12756f 100%)",
            color: "#ffffff",
            fontFamily: "Arial, sans-serif",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "1px",
              textTransform: "uppercase",
              opacity: 0.85,
            }}
          >
            Limited Time Offer
          </p>

          <h2
            style={{
              margin: "12px 0",
              fontSize: "36px",
              fontWeight: 700,
            }}
          >
            Earn More With NorthBank
          </h2>

          <p
            style={{
              maxWidth: "600px",
              margin: "0 auto 24px",
              fontSize: "16px",
              lineHeight: 1.6,
              opacity: 0.9,
            }}
          >
            Open a new savings account today and enjoy competitive interest
            rates, zero monthly fees, and exclusive member benefits.
          </p>

          <button
            style={{
              backgroundColor: "#ffffff",
              color: "#12756f",
              border: "none",
              padding: "14px 28px",
              borderRadius: "999px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};