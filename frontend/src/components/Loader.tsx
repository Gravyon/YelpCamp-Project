import { Spinner } from "react-bootstrap";

export default function Loader() {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center w-100"
      style={{ minHeight: "60vh" }}
    >
      <div className="position-relative">
        {/* The Spinner acts as a ring */}
        <Spinner
          animation="border"
          role="status"
          style={{
            width: "4rem",
            height: "4rem",
            color: "var(--camp-primary)",
            borderWidth: "0.3em",
          }}
        />
        {/* A tiny tent emoji centered inside */}
        <div
          className="position-absolute top-50 start-50 translate-middle fs-4"
          style={{ animation: "pulse 1.5s infinite" }}
        >
          ⛺
        </div>
      </div>

      <p
        className="mt-3 fw-bold text-muted text-uppercase small"
        style={{ letterSpacing: "2px" }}
      >
        Loading Adventure...
      </p>
    </div>
  );
}
