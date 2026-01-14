import React, { useState } from "react";
import { useCampgroundStore } from "../store/campgroundStore";
import { Button, Form, Alert, Card } from "react-bootstrap";
import toast from "react-hot-toast";
import { FaPaperPlane, FaStar } from "react-icons/fa";
import "../stars.css";

export default function ReviewForm({ campgroundId }: { campgroundId: string }) {
  const { addReview } = useCampgroundStore();
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);

  const stars = [
    { value: 1, title: "Terrible" },
    { value: 2, title: "Not good" },
    { value: 3, title: "Average" },
    { value: 4, title: "Very good" },
    { value: 5, title: "Amazing" },
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const formElement = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (formElement.checkValidity() === false) {
      setValidated(true);
      return;
    }
    try {
      await toast.promise(addReview(campgroundId, { rating, body }), {
        loading: "Posting review...",
        success: "Review posted successfully!",
        error: (err) => "Could not post review.",
      });
      setBody("");
      setRating(5);
      setError("");
      setValidated(false);
    } catch (error: any) {
      setError(error.message || "Could not post review");
    }
  };

  return (
    <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
      <Card.Body className="p-4">
        <h4
          className="fw-bold mb-3 d-flex align-items-center gap-2"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--camp-primary)",
          }}
        >
          <FaStar className="text-warning" /> Leave a Review
        </h4>

        {error && (
          <Alert variant="danger" className="border-0 shadow-sm">
            {error}
          </Alert>
        )}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          {/* RATING SECTION */}
          <div className="mb-3">
            <Form.Label className="fw-bold text-muted small text-uppercase mb-1">
              Rating
            </Form.Label>

            {/* Wrapper to align stars correctly */}
            <div className="d-flex align-items-center">
              <fieldset className="starability-basic">
                {/* 
                   Hidden "No Rate" input is technically required for the 
                   CSS library to handle the "unchecked" state logic correctly 
                */}
                <input
                  type="radio"
                  id="no-rate"
                  className="input-no-rate"
                  name="rating"
                  value="0"
                  checked={rating === 0}
                  onChange={() => setRating(0)}
                  aria-label="No rating."
                />

                {stars.map((star) => (
                  <React.Fragment key={star.value}>
                    <input
                      type="radio"
                      id={`first-rate${star.value}`}
                      name="rating"
                      value={star.value}
                      checked={rating === star.value}
                      onChange={() => setRating(star.value)}
                    />
                    <label
                      htmlFor={`first-rate${star.value}`}
                      title={star.title}
                    >
                      {star.value} stars
                    </label>
                  </React.Fragment>
                ))}
              </fieldset>
            </div>
          </div>

          {/* TEXTAREA SECTION */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold text-muted small text-uppercase">
              Your Experience
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              placeholder="What did you like? How was the location?"
              className="border-0"
              style={{
                backgroundColor: "var(--camp-input-bg)", // Adapts to theme
                border: "1px solid var(--camp-border)", // Subtle border
              }}
            />
            <Form.Control.Feedback type="invalid">
              Please write a few words about your stay.
            </Form.Control.Feedback>
          </Form.Group>

          {/* SUBMIT BUTTON */}
          <div className="d-grid">
            <Button
              type="submit"
              variant="success"
              className="rounded-pill fw-bold py-2 shadow-sm d-flex align-items-center justify-content-center gap-2"
              style={{ backgroundColor: "var(--camp-primary)", border: "none" }}
            >
              Submit Review <FaPaperPlane />
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
