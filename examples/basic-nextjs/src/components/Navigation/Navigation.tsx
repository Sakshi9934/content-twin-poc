import Link from "next/link";

export const Default = () => {
  const productLinks = [
    { title: "Home Loan", href: "/products/home-loan" },
    { title: "Life Insurance", href: "/products/life-insurance" },
    { title: "EV Service Plan", href: "/products/ev-service-plan" },
    { title: "Health Insurance", href: "/products/health-insurance" },
    { title: "Pet Insurance", href: "/products/pet-insurance" },
    { title: "Travel Insurance", href: "/products/travel-insurance" },
  ];

  return (
    <div>
      <style>{`
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 18px;
          color: #1f9d94;
          text-decoration: none;
          transition: transform .25s ease;
        }

        .logo:hover {
          transform: scale(1.03);
        }

        .logo-diamond {
          width: 12px;
          height: 12px;
          background: #1f9d94;
          transform: rotate(45deg);
          transition: transform .35s ease;
        }

        .logo:hover .logo-diamond {
          transform: rotate(225deg);
        }

        .navbar-link {
          position: relative;
          text-decoration: none;
          color: #8a8a8a;
          transition: color .25s ease, transform .25s ease;
        }

        .navbar-link:hover {
          color: #1f9d94;
          transform: translateY(-2px);
        }

        .navbar-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 0;
          height: 2px;
          background: #1f9d94;
          transition: width .25s ease;
        }

        .navbar-link:hover::after {
          width: 100%;
        }

        .products-menu {
          position: relative;
        }

        .products-label {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .products-arrow {
          color: #1f9d94;
          transition: transform .25s ease;
        }

        .products-menu:hover .products-arrow {
          transform: rotate(180deg);
        }

        .products-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          left: 0;
          min-width: 240px;
          background: white;
          border: 1px solid #dcdcdc;
          border-radius: 8px;
          box-shadow: 0 12px 30px rgba(0,0,0,.08);
          padding: 8px 0;
          margin: 0;
          list-style: none;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition:
            opacity .25s ease,
            transform .25s ease,
            visibility .25s;
          z-index: 1000;
        }

        .products-menu:hover .products-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .products-dropdown li {
          margin: 0;
          padding: 0;
        }

        .products-dropdown a {
          display: block;
          padding: 12px 18px;
          color: #666;
          text-decoration: none;
          transition:
            background .2s ease,
            color .2s ease,
            padding-left .2s ease;
        }

        .products-dropdown a:hover {
          background: rgba(31,157,148,.08);
          color: #1f9d94;
          padding-left: 24px;
        }
      `}</style>

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
          <Link href="/" className="logo">
            <span className="logo-diamond" />
            NorthBank
          </Link>

          <ul
            style={{
              listStyle: "none",
              display: "flex",
              alignItems: "center",
              gap: "24px",
              margin: 0,
              padding: 0,
              fontSize: "15px",
            }}
          >
            <li className="products-menu">
              <span className="navbar-link products-label">
                Products
                <span className="products-arrow">▼</span>
              </span>

              <ul className="products-dropdown">
                {productLinks.map((product) => (
                  <li key={product.href}>
                    <Link href={product.href}>{product.title}</Link>
                  </li>
                ))}
              </ul>
            </li>

            <li>
              <Link href="/about" className="navbar-link">
                About
              </Link>
            </li>

            <li>
              <Link href="/rates" className="navbar-link">
                Rates
              </Link>
            </li>

            <li>
              <Link href="/contact" className="navbar-link">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};