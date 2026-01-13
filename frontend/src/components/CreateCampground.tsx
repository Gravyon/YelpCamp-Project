import { useState } from "react";
import { useCampgroundStore } from "../store/campgroundStore";
import { useNavigate, Link } from "react-router-dom";
import {
  Alert,
  Button,
  Col,
  Form,
  InputGroup,
  Container,
  Card,
  Row,
  Image,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { UploadDropzone } from "../utils/uploadthing";
import { FaCloudUploadAlt, FaArrowLeft, FaDollarSign } from "react-icons/fa";
import Loader from "./Loader";

export default function CreateCampground() {
  const navigate = useNavigate();
  const { addCampground, loading } = useCampgroundStore();

  const [validated, setValidated] = useState(false);
  const [globalError, setGlobalError] = useState<any>(null);
  const [fieldErrors, setFieldErrors] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    price: "",
  });
  const [images, setImages] = useState<{ url: string; key: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (fieldErrors.length) {
      setFieldErrors((prev) =>
        prev.filter((err) => !err.path.includes(e.target.name))
      );
    }
  };

  // Helper to remove an image before submitting
  const removeNewImage = (keyToRemove: string) => {
    setImages((prev) => prev.filter((img) => img.key !== keyToRemove));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement | HTMLInputElement>
  ) => {
    const formElement = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    setGlobalError(null);
    if (formElement.checkValidity() === false) {
      setValidated(true);
      return;
    }
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        images: images.map((img) => ({ url: img.url, filename: img.key })),
      };
      const newCampground = await toast.promise(
        addCampground(payload),
        {
          loading: "Pitching the tent...",
          success: "Campground setup complete! ⛺",
          error: (err) => `Could not set up camp 🐻. ${err.message}`,
        },
        { style: { minWidth: "250px" } }
      );
      const { _id } = newCampground;
      navigate(`/campgrounds/${_id}`);
    } catch (error: any) {
      console.error("Submission Error: ", error);
      if (error.details && Array.isArray(error.details)) {
        setFieldErrors(error.details);
      } else {
        setGlobalError(error.message || "Something went wrong");
      }
    }
  };

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Loader />
      </div>
    );

  const getFieldError = (fieldName: string) => {
    return fieldErrors.find((err) => err.path.includes(fieldName))?.message;
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
            <Card.Body className="p-5">
              <h2
                className="text-center mb-4 fw-bold"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--camp-primary)",
                }}
              >
                New Campground
              </h2>

              <p className="text-center text-muted mb-4">
                Share a new hidden gem with the community.
              </p>

              {globalError && <Alert variant="danger">{globalError}</Alert>}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                {/* Title */}
                <Form.Group className="mb-4" controlId="title">
                  <Form.Label className="fw-bold text-muted">
                    Campground Title
                  </Form.Label>
                  <Form.Control
                    required
                    name="title"
                    type="text"
                    placeholder="e.g. Misty Mountain Retreat"
                    value={form.title}
                    onChange={handleChange}
                    isInvalid={!!getFieldError("title")}
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {getFieldError("title") || "Title is required."}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Location */}
                <Form.Group className="mb-4" controlId="location">
                  <Form.Label className="fw-bold text-muted">
                    Location
                  </Form.Label>
                  <Form.Control
                    required
                    name="location"
                    type="text"
                    placeholder="e.g. Yellowstone National Park, WY"
                    value={form.location}
                    onChange={handleChange}
                    isInvalid={!!getFieldError("location")}
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {getFieldError("location") || "Please enter a location."}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Price */}
                <Form.Group as={Col} className="mb-4" controlId="price">
                  <Form.Label className="fw-bold text-muted">
                    Price per Night
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="border-end-0">
                      <FaDollarSign className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      name="price"
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      isInvalid={!!getFieldError("price")}
                      className="border-start-0 py-2"
                    />
                    <Form.Control.Feedback type="invalid">
                      {getFieldError("price") ||
                        "Price must be a valid number."}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Image Upload Section */}
                <div
                  className="p-3 mb-4 rounded border"
                  style={{ backgroundColor: "var(--camp-input-bg)" }}
                >
                  <h5
                    className="fw-bold mb-3 text-secondary"
                    style={{ fontSize: "1rem" }}
                  >
                    <FaCloudUploadAlt className="me-2" /> Add Photos
                  </h5>

                  <Form.Group className="mb-3">
                    <UploadDropzone
                      endpoint="imageUploader"
                      className="w-100"
                      appearance={{
                        container: {
                          border: "2px dashed var(--camp-border)",
                          borderRadius: "var(--camp-radius)",
                          background: "var(--camp-card-bg)", // Slightly lighter than input-bg
                          color: "var(--bs-body-color)",
                          minHeight: "150px",
                          height: "auto",
                          padding: "1rem",
                        },
                        button: {
                          background: "var(--camp-primary)",
                          color: "white",
                          padding: "0.5rem 1rem",
                          borderRadius: "20px",
                          maxWidth: "100%",
                          wordWrap: "break-word",
                        },
                        uploadIcon: {
                          width: "40px",
                          height: "40px",
                          color: "var(--camp-primary)",
                        },
                        label: {
                          fontSize: "1rem",
                          color: "var(--camp-primary)",
                        },
                      }}
                      content={{
                        label: "Drag photos here",
                        button({ ready, isUploading }) {
                          if (isUploading) return "Uploading...";
                          if (!ready) return "Loading...";
                          return "Upload Images";
                        },
                      }}
                      onUploadBegin={() => setIsUploading(true)}
                      onClientUploadComplete={(res) => {
                        setIsUploading(false);
                        if (res) {
                          setImages(res);
                          toast.success("Upload Completed!");
                        }
                      }}
                      onUploadError={(error: Error) => {
                        setIsUploading(false);
                        toast.error(`ERROR! ${error.message}`);
                      }}
                    />

                    {/* Previews */}
                    {images.length > 0 && (
                      <div className="d-flex gap-2 mt-3 flex-wrap">
                        {images.map((img) => (
                          <div key={img.key} className="position-relative">
                            <Image
                              src={img.url}
                              className="rounded border border-success border-2 object-fit-cover"
                              style={{ width: "80px", height: "80px" }}
                            />
                            <button
                              type="button"
                              className="btn btn-danger btn-sm position-absolute top-0 end-0 translate-middle p-0 rounded-circle d-flex align-items-center justify-content-center"
                              style={{
                                width: "20px",
                                height: "20px",
                                fontSize: "10px",
                              }}
                              onClick={() => removeNewImage(img.key)}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </Form.Group>
                </div>

                {/* Description */}
                <Form.Group className="mb-4" controlId="description">
                  <Form.Label className="fw-bold text-muted">
                    Description
                  </Form.Label>
                  <Form.Control
                    required
                    name="description"
                    type="text"
                    placeholder="Tell the world what makes this spot special..."
                    value={form.description}
                    onChange={handleChange}
                    as="textarea"
                    rows={4}
                    isInvalid={!!getFieldError("description")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {getFieldError("description") || "Description is required."}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Buttons */}
                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    disabled={loading || isUploading}
                    variant="success"
                    className="rounded-pill fw-bold py-2 shadow-sm"
                    style={{
                      backgroundColor: "var(--camp-primary)",
                      border: "none",
                    }}
                  >
                    {loading ? "Saving..." : "Create Campground"}
                  </Button>

                  <Link to="/campgrounds" className="text-decoration-none">
                    <Button variant="link" className="w-100 text-muted fw-bold">
                      <FaArrowLeft className="me-2" /> Cancel
                    </Button>
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
