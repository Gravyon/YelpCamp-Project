import { useEffect, useState } from "react";
import { useCampgroundStore } from "../../store/campgroundStore";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Alert,
  Button,
  Col,
  Form,
  Image,
  InputGroup,
  Container,
  Card,
  Row,
} from "react-bootstrap";
import { useUserStore } from "../../store/userStore";
import toast from "react-hot-toast";
import { UploadDropzone } from "../../utils/uploadthing";
import { FaTrash, FaArrowLeft, FaCloudUploadAlt } from "react-icons/fa"; // Added icons
import Loader from "../../components/common/Loader";

export default function UpdateCampground() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCampgroundById, updateCampground, campground, loading } =
    useCampgroundStore();

  // ... (Your state and logic hooks remain exactly the same)
  const [validated, setValidated] = useState(false);
  const [globalError, setGlobalError] = useState<any>(null);
  const [fieldErrors, setFieldErrors] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    price: "",
  });
  const { user, isCheckingAuth } = useUserStore();
  const [images, setImages] = useState<{ url: string; key: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const toggleSelectImage = (filename: string) => {
    setImagesToDelete((prev) => {
      if (prev.includes(filename)) {
        return prev.filter((f) => f !== filename);
      } else {
        return [...prev, filename];
      }
    });
  };

  const removeNewImage = (keyToRemove: string) => {
    setImages((prev) => prev.filter((img) => img.key !== keyToRemove));
  };

  useEffect(() => {
    getCampgroundById(id!);
  }, [id, getCampgroundById]);

  useEffect(() => {
    if (campground) {
      document.title = `Updating ${campground?.title} | YelpCamp`;
    } else {
      document.title = "Loading... | YelpCamp";
    }

    if (campground) {
      setForm({
        title: campground.title || "",
        location: campground.location || "",
        description: campground.description || "",
        price: campground.price !== undefined ? String(campground.price) : "",
      });
    }
  }, [campground]);

  useEffect(() => {
    if (loading || isCheckingAuth) return;
    if (!user) {
      navigate("/login");
      return;
    }
    const authorId = campground?.author._id || campground?.author;
    if (campground && String(authorId) !== String(user._id)) {
      navigate(`/campgrounds/${id}`);
    }
  }, [campground, user, isCheckingAuth, loading, navigate, id]);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const formElement = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setGlobalError(null);
    if (formElement.checkValidity() === false) {
      setValidated(true);
      return;
    }
    const payload = {
      ...form,
      price: Number(form.price),
      images: images.map((img) => ({ url: img.url, filename: img.key })),
      imagesToDelete: imagesToDelete,
    };

    if (images.length > 15) {
      toast("Image limit reached");
      return;
    }

    await toast.promise(
      updateCampground(id!, payload),
      {
        loading: "Updating campground...",
        success: "Update complete! ⛺",
        error: (err) => `Update failed: ${err.message}`,
      },
      { style: { minWidth: "250px" } }
    );
    navigate(`/campgrounds/${id}`);
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
  if (!campground)
    return <h2 className="text-center mt-5">Campground not found</h2>;

  const getFieldError = (fieldName: string) => {
    return fieldErrors.find((err) => err.path.includes(fieldName))?.message;
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {/* Card Container for cleaner look */}
          <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
            <Card.Body className="p-5">
              <h2
                className="text-center mb-4 fw-bold"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--camp-primary)",
                }}
              >
                Edit Campground
              </h2>

              {globalError && <Alert variant="danger">{globalError}</Alert>}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                {/* Title */}
                <Form.Group className="mb-4" controlId="title">
                  <Form.Label className="fw-bold text-muted">Title</Form.Label>
                  <Form.Control
                    required
                    name="title"
                    type="text"
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
                <Form.Group className="mb-4" controlId="price">
                  <Form.Label className="fw-bold text-muted">
                    Price per Night
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="border-end-0">
                      $
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

                {/* Description */}
                <Form.Group className="mb-4" controlId="description">
                  <Form.Label className="fw-bold text-muted">
                    Description
                  </Form.Label>
                  <Form.Control
                    required
                    name="description"
                    as="textarea"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    isInvalid={!!getFieldError("description")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {getFieldError("description") || "Description is required."}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* --- IMAGE SECTION START --- */}
                <div className="p-3 mb-4 rounded border">
                  <h5
                    className="fw-bold mb-3 text-secondary"
                    style={{ fontSize: "1rem" }}
                  >
                    <FaCloudUploadAlt className="me-2" /> Manage Images
                  </h5>

                  {/* 1. Upload Zone */}
                  <Form.Group className="mb-3">
                    <UploadDropzone
                      endpoint="imageUploader"
                      className="w-100"
                      appearance={{
                        container: {
                          border: "2px dashed var(--camp-border)",
                          borderRadius: "var(--camp-radius)",
                          background: "var(--camp-input-bg)",
                          color: "var(--bs-body-color)",
                          minHeight: "150px",
                          padding: "1rem",
                        },
                        button: {
                          background: "var(--camp-primary)",
                          color: "white",
                          padding: "0.5rem 1rem",
                          borderRadius: "20px",
                        },
                        label: { color: "var(--camp-primary)" },
                      }}
                      // ... content prop same as before ...
                      content={{
                        label: "Add new photos",
                        button({ ready, isUploading }) {
                          if (isUploading) return "Uploading...";
                          if (!ready) return "Loading...";
                          return "Upload Selected";
                        },
                      }}
                      onUploadBegin={() => setIsUploading(true)}
                      onClientUploadComplete={(res) => {
                        setIsUploading(false);
                        if (res) {
                          setImages(res);
                          toast.success("Photos ready to save!");
                        }
                      }}
                      onUploadError={(error: Error) => {
                        setIsUploading(false);
                        toast.error(`Upload error: ${error.message}`);
                      }}
                    />

                    {/* New Images Preview */}
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

                  <hr />

                  {/* 2. Existing Images (Delete Logic) */}
                  <Form.Group>
                    <Form.Label className="fw-bold text-muted small mb-2">
                      Tap images to remove them
                    </Form.Label>
                    <div className="d-flex gap-2 flex-wrap">
                      {campground?.images.map((img) => {
                        const isSelected = imagesToDelete.includes(
                          img.filename
                        );
                        return (
                          <div
                            key={img._id}
                            onClick={() => toggleSelectImage(img.filename)}
                            className="position-relative rounded overflow-hidden shadow-sm"
                            style={{
                              cursor: "pointer",
                              width: "100px",
                              height: "100px",
                              transition: "all 0.2s ease",
                              border: isSelected
                                ? "3px solid #dc3545"
                                : "1px solid transparent",
                              opacity: isSelected ? 0.5 : 1,
                              transform: isSelected ? "scale(0.9)" : "scale(1)",
                            }}
                          >
                            <Image
                              src={img.url}
                              className="w-100 h-100 object-fit-cover"
                            />
                            {isSelected && (
                              <div className="position-absolute top-50 start-50 translate-middle text-danger">
                                <FaTrash size={20} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {imagesToDelete.length > 0 && (
                      <div className="mt-2 text-danger small fw-bold">
                        <FaTrash className="me-1" />
                        {imagesToDelete.length} image(s) will be deleted on
                        save.
                      </div>
                    )}
                  </Form.Group>
                </div>
                {/* --- IMAGE SECTION END --- */}

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
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>

                  <Link
                    to={`/campgrounds/${id}`}
                    className="text-decoration-none"
                  >
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
