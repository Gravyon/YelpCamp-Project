import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import {
  FaSearch,
  FaTree,
  FaFire,
  FaMapMarkedAlt,
  FaStar,
} from "react-icons/fa";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd pass this as a query param
    navigate(`/campgrounds?search=${search}`);
  };

  return (
    <>
      {/* SECTION 1: HERO WITH SEARCH */}
      <div
        className="d-flex flex-column justify-content-center align-items-center text-white text-center position-relative"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          height: "75vh", // Taller hero looks more premium
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "0 0 50px 50px", // More dramatic curve
          marginBottom: "4rem",
        }}
      >
        <Container>
          <h1
            className="display-1 fw-bold mb-3"
            style={{ textShadow: "2px 2px 10px rgba(0,0,0,0.5)" }}
          >
            Find Your Outside
          </h1>
          <p
            className="lead mb-5 fs-4"
            style={{ textShadow: "1px 1px 5px rgba(0,0,0,0.5)" }}
          >
            Discover and book the best camping grounds from around the world.
          </p>

          {/* Search Bar Component */}
          <div
            className="bg-white p-2 rounded-pill shadow-lg mx-auto"
            style={{ maxWidth: "700px" }}
          >
            <Form onSubmit={handleSearch} className="d-flex">
              <InputGroup>
                <Form.Control
                  className="border-0 shadow-none bg-transparent form-control-lg"
                  placeholder="Where do you want to go?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
              <Button
                variant="success"
                size="lg"
                type="submit"
                className="rounded-pill px-5 fw-bold"
                style={{
                  backgroundColor: "var(--camp-primary)",
                  border: "none",
                }}
              >
                <FaSearch />
              </Button>
            </Form>
          </div>
        </Container>
      </div>

      {/* SECTION 2: VALUE PROPOSITION (Why us?) */}
      <Container className="mb-5">
        <Row className="text-center g-4">
          <Col md={4}>
            <div className="p-4 h-100">
              <div className="display-5 text-success mb-3">
                <FaTree />
              </div>
              <h3 className="fw-bold">Verified Spots</h3>
              <p className="text-muted">
                Every campground is visited and verified by our community of
                nature lovers. No surprises.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="p-4 h-100">
              <div className="display-5 text-warning mb-3">
                <FaFire />
              </div>
              <h3 className="fw-bold">Curated Experiences</h3>
              <p className="text-muted">
                From glamping to backcountry survival, find the exact experience
                you are looking for.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="p-4 h-100">
              <div className="display-5 text-info mb-3">
                <FaMapMarkedAlt />
              </div>
              <h3 className="fw-bold">Interactive Maps</h3>
              <p className="text-muted">
                Use our advanced clustering maps to find hidden gems near you or
                across the ocean.
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* SECTION 3: FEATURED / TRENDING (Mocked Data) */}
      <div className="py-5" style={{ backgroundColor: "var(--camp-input-bg)" }}>
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-4">
            <h2 className="fw-bold m-0">Trending this week</h2>
            <Link
              to="/campgrounds"
              className="text-decoration-none fw-bold text-success"
            >
              View all &rarr;
            </Link>
          </div>

          <Row>
            {/* Mock Card 1 */}
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Img
                  variant="top"
                  src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=60"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="fw-bold">Mount Ulap</Card.Title>
                  <Card.Text className="text-muted small">
                    One of the most famous hikes in Benguet...
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">
                      $25<small className="text-muted">/night</small>
                    </span>
                    <span className="text-warning">
                      <FaStar /> 4.9
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Mock Card 2 */}
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Img
                  variant="top"
                  src="https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?auto=format&fit=crop&w=800&q=60"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="fw-bold">Calaguas Island</Card.Title>
                  <Card.Text className="text-muted small">
                    A paradise with white sand beaches...
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">
                      $40<small className="text-muted">/night</small>
                    </span>
                    <span className="text-warning">
                      <FaStar /> 4.8
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Mock Card 3 */}
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Img
                  variant="top"
                  src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=60"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="fw-bold">Onay Beach</Card.Title>
                  <Card.Text className="text-muted small">
                    This is one of the best camping sites...
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">
                      $15<small className="text-muted">/night</small>
                    </span>
                    <span className="text-warning">
                      <FaStar /> 4.5
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* SECTION 4: CALL TO ACTION */}
      <Container className="my-5 py-5 text-center">
        <div
          className="p-5 rounded-4 text-white"
          style={{
            background: "linear-gradient(135deg, var(--camp-primary), #14424a)",
            boxShadow: "0 10px 30px rgba(46, 139, 87, 0.3)",
          }}
        >
          <h2 className="display-5 fw-bold mb-3">
            Ready for your next adventure?
          </h2>
          <p className="fs-5 mb-4 opacity-75">
            Join thousands of campers sharing their favorite spots.
          </p>
          <Link to="/register">
            <Button
              variant="light"
              size="lg"
              className="rounded-pill px-5 fw-bold text-success"
            >
              Create an Account
            </Button>
          </Link>
        </div>
      </Container>
    </>
  );
}
