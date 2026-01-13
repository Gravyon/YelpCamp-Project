import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { FaMapSigns, FaCompass, FaTree } from "react-icons/fa";

export default function NotFound() {
  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="mb-4 position-relative">
        {/* Layered Icons for a 'Lost' scene */}
        <FaTree
          className="text-success opacity-50"
          size={120}
          style={{ transform: "translate(-40px, 10px)" }}
        />
        <FaMapSigns
          className="text-secondary position-relative z-1"
          size={150}
        />
        <FaTree
          className="text-success opacity-50"
          size={100}
          style={{ transform: "translate(40px, 20px)" }}
        />
      </div>

      <h1
        className="display-1 fw-bold mb-0"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--camp-primary)",
        }}
      >
        404
      </h1>

      <h2 className="h1 mb-3 fw-bold text-muted">You seem a bit lost...</h2>

      <p className="lead text-secondary mb-5" style={{ maxWidth: "500px" }}>
        The campground you are looking for has been moved, removed, or never
        existed. It looks like you ventured a bit too far off the trail, my
        friend.
      </p>

      <div className="d-flex gap-3">
        <Link to="/">
          <Button
            variant="success"
            size="lg"
            className="rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
            style={{ backgroundColor: "var(--camp-primary)", border: "none" }}
          >
            <FaCompass /> Return Home
          </Button>
        </Link>

        <Link to="/campgrounds">
          <Button
            variant="outline-secondary"
            size="lg"
            className="rounded-pill px-4 fw-bold"
          >
            View Map
          </Button>
        </Link>
      </div>
    </Container>
  );
}
