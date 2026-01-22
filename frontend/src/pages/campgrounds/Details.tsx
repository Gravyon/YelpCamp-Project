import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCampgroundStore } from "../../store/campgroundStore";
import { useUserStore } from "../../store/userStore";
import toast from "react-hot-toast";

// Components
import {
  Button,
  Card,
  Carousel,
  Col,
  ListGroup,
  Row,
  Container,
} from "react-bootstrap";
import ReviewForm from "../../components/campgrounds/ReviewForm";
import ClusterMap from "../../components/campgrounds/ClusterMap";
import { FaMapMarkerAlt, FaUser, FaTree, FaArrowLeft } from "react-icons/fa";
import DeleteModal from "../../components/common/DeleteModal";
import Loader from "../../components/common/Loader";

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

  // --- STATE MANAGEMENT ---
  // For Campground Deletion
  const [showCampDelete, setShowCampDelete] = useState(false);

  // For Review Deletion (Stores the ID of the review to be deleted, or null if closed)
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  // --- EFFECTS ---
  useEffect(() => {
    if (id) getCampgroundById(id);
  }, [id, getCampgroundById]);

  useEffect(() => {
    document.title = campground ? `${campground.title} | YelpCamp` : "YelpCamp";
    return () => {
      document.title = "YelpCamp";
    };
  }, [campground]);

  // --- HANDLERS ---
  const handleConfirmDeleteCampground = async () => {
    if (!id) return;
    try {
      await deleteCampground(id);
      toast.success("Campground deleted!", { icon: "🗑️" });
      setShowCampDelete(false);
      navigate("/campgrounds");
    } catch (error: any) {
      toast.error(error.message || "Could not delete.");
    }
  };

  const handleConfirmDeleteReview = async () => {
    if (!id || !reviewToDelete) return;
    try {
      await deleteReview(id, reviewToDelete);
      toast.success("Review deleted!", { icon: "🗑️" });
      setReviewToDelete(null); // Close modal and clear ID
    } catch (error: any) {
      toast.error(error.message || "Could not delete.");
    }
  };

  // --- LOADING / ERROR STATES ---
  if (error) {
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
  }

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Loader />
      </div>
    );
  }

  if (!campground) return null;

  const isAuthor = user && campground.author._id === user._id;

  return (
    <Container className="py-5">
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
            <Carousel data-bs-theme="light">
              {campground.images.map((img, i) => (
                <Carousel.Item key={i}>
                  <img
                    className="d-block w-100"
                    src={img.url}
                    alt={`Slide ${i}`}
                    style={{
                      height: "400px",
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
              {isAuthor && (
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
                    variant="outline-danger"
                    className="rounded-pill fw-bold px-4 border-2"
                    onClick={() => setShowCampDelete(true)}
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
          {campground.geometry && (
            <div
              className="shadow-lg rounded-4 overflow-hidden mb-4 border border-1"
              style={{ borderColor: "var(--camp-border)" }}
            >
              <ClusterMap campgrounds={[campground]} />
            </div>
          )}

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
                          <span className="fw-bold">
                            {review.author?.username}
                          </span>
                        </div>
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
                            variant="outline-danger"
                            size="sm"
                            className="rounded-pill fw-bold px-3 border-2"
                            // FIX: Just set the ID here, don't render a modal
                            onClick={() => setReviewToDelete(review._id)}
                          >
                            Delete
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

      {/* --- SHARED MODALS (Rendered outside loops) --- */}

      {/* 1. Delete Campground Modal */}
      <DeleteModal
        show={showCampDelete}
        onHide={() => setShowCampDelete(false)}
        onConfirm={handleConfirmDeleteCampground}
        title="Delete Campground?"
        body="Are you sure? This action cannot be undone."
      />

      {/* 2. Delete Review Modal */}
      <DeleteModal
        show={!!reviewToDelete} // Show if an ID is selected
        onHide={() => setReviewToDelete(null)}
        onConfirm={handleConfirmDeleteReview}
        title="Delete Review?"
        body="This will permanently remove your review."
      />
    </Container>
  );
}
