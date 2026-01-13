import { useEffect } from "react";
import { useCampgroundStore } from "../store/campgroundStore";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import {
  Button,
  Card,
  Carousel,
  Col,
  ListGroup,
  Row,
  Spinner,
  Container,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { useUserStore } from "../store/userStore";
import { FaMapMarkerAlt, FaUser, FaTree, FaArrowLeft } from "react-icons/fa";
import "../stars.css";
import ClusterMap from "./Map";
import Loader from "./Loader";

export default function Campground() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    campground,
    getCampgroundById,
    deleteCampground,
    loading,
    error,
    deleteReview,
  } = useCampgroundStore();
  const { user, isAuthenticated } = useUserStore();

  useEffect(() => {
    if (id) getCampgroundById(id);
  }, [id, getCampgroundById]);

  const handleDeleteReview = async (reviewId: string) => {
    if (id && window.confirm("Delete this review?")) {
      try {
        await deleteReview(id, reviewId);
        toast.success("Review deleted!", { icon: "🗑️" });
      } catch (error: any) {
        toast.error(error.message || "Could not delete.");
      }
    }
  };

  const handleDeleteCampground = async () => {
    if (
      id &&
      window.confirm("Are you sure you want to delete this campground?")
    ) {
      try {
        await deleteCampground(id);
        toast.success("Campground deleted!", { icon: "🗑️" });
        navigate("/campgrounds");
      } catch (error: any) {
        toast.error(error.message || "Could not delete.");
      }
    }
  };

  if (error)
    return (
      <Container className="mt-5">
        <div className="alert alert-danger shadow-sm border-0" role="alert">
          <h4 className="alert-heading">Not Found</h4>
          <p>{error.message || "Campground not found"}</p>
          <hr />
          <Link to="/campgrounds" className="btn btn-outline-danger">
            Return to Campgrounds
          </Link>
        </div>
      </Container>
    );

  if (loading)
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Loader />
      </div>
    );

  if (!campground) return null;

  return (
    <Container className="py-5">
      {/* Back Button */}
      <Link
        to="/campgrounds"
        className="text-decoration-none text-muted mb-4 d-inline-block fw-bold"
      >
        <FaArrowLeft className="me-2" /> Back to Map
      </Link>

      <Row>
        {/* --- LEFT COLUMN: DETAILS --- */}
        <Col md={6}>
          <Card className="border-0 shadow-lg rounded-4 overflow-hidden mb-4">
            {/* Carousel */}
            <Carousel data-bs-theme="light">
              {campground.images.map((img, i) => (
                <Carousel.Item key={i}>
                  <img
                    className="d-block w-100"
                    src={img.url}
                    alt={`Slide ${i}`}
                    style={{
                      height: "400px", // Taller for better visual impact
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>

            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <Card.Title
                  as="h1"
                  className="display-6 fw-bold"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--camp-primary)",
                  }}
                >
                  {campground.title}
                </Card.Title>
                <h3 className="text-success fw-bold">
                  ${campground.price}
                  <small className="fs-6 text-muted">/night</small>
                </h3>
              </div>

              <Card.Text className="lead fs-6 text-secondary mb-4">
                {campground.description}
              </Card.Text>

              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item className="d-flex align-items-center px-0 text-muted border-bottom">
                  <FaMapMarkerAlt className="me-3 text-danger fs-5" />
                  {campground.location}
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-center px-0 text-muted">
                  <FaUser className="me-3 text-primary fs-5" />
                  Submitted by{" "}
                  <span className="fw-bold ms-1">
                    {campground.author.username}
                  </span>
                </ListGroup.Item>
              </ListGroup>

              {/* Owner Actions */}
              {user && campground.author._id === user._id && (
                <div className="d-flex gap-2 border-top pt-3">
                  <Link to={`/campgrounds/${id}/edit`} className="flex-grow-1">
                    <Button
                      variant="success"
                      className="w-100 rounded-pill fw-bold"
                      style={{
                        backgroundColor: "var(--camp-primary)",
                        border: "none",
                      }}
                    >
                      Edit Campground
                    </Button>
                  </Link>
                  <Button
                    onClick={handleDeleteCampground}
                    variant="outline-danger"
                    className="rounded-pill fw-bold px-4"
                  >
                    Delete
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* --- RIGHT COLUMN: MAP & REVIEWS --- */}
        <Col md={6}>
          {/* MAP WIDGET */}
          {campground.geometry && (
            <div
              className="shadow-lg rounded-4 overflow-hidden mb-4 border border-1"
              style={{ borderColor: "var(--camp-border)" }}
            >
              <ClusterMap campgrounds={[campground]} />
            </div>
          )}

          {/* REVIEWS SECTION */}
          <div
            className="p-4 rounded-4 shadow-sm"
            style={{
              backgroundColor: "var(--camp-card-bg)",
              border: "1px solid var(--camp-border)",
            }}
          >
            <h3
              className="fw-bold mb-4"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--camp-primary)",
              }}
            >
              <FaTree className="me-2" /> Reviews
            </h3>

            {user && isAuthenticated && (
              <div className="mb-4">
                <ReviewForm campgroundId={campground._id} />
                <hr
                  className="my-4"
                  style={{ borderColor: "var(--camp-border)" }}
                />
              </div>
            )}

            {!campground.reviews || campground.reviews.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <p className="mb-0">
                  No reviews yet. Be the first to share your experience!
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {campground.reviews.map((review) => (
                  <Card
                    key={review._id}
                    className="border-0 shadow-sm rounded-3"
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "30px", height: "30px" }}
                          >
                            <FaUser className="text-secondary" size={14} />
                          </div>
                          <span className="fw-bold ">
                            {review.author?.username}
                          </span>
                        </div>
                        {/* Star Rating Display */}
                        <div
                          className="starability-result"
                          data-rating={review.rating}
                          style={{
                            transform: "scale(0.7)",
                            transformOrigin: "right center",
                          }}
                        >
                          Rated: {review.rating} stars
                        </div>
                      </div>

                      <Card.Text className="text-secondary mt-2">
                        {review.body}
                      </Card.Text>

                      {user && review.author?._id === user._id && (
                        <div className="d-flex justify-content-end">
                          <Button
                            size="sm"
                            variant="link"
                            className="text-danger text-decoration-none p-0"
                            onClick={() => handleDeleteReview(review._id)}
                          >
                            Delete Review
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
