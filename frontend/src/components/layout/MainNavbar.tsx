import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";
import { useUserStore } from "../../store/userStore";
import toast from "react-hot-toast";

export default function MainNavbar() {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Goodbye");
    navigate("/");
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className="shadow-sm py-3"
      style={{
        // Glassmorphism Effect
        backgroundColor: "rgba(var(--bs-body-bg-rgb), 0.85)", // Uses Bootstrap's RGB var for opacity
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--camp-border)",
        transition: "all 0.3s ease",
      }}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fs-3 fw-bold d-flex align-items-center gap-2"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--camp-primary)",
          }}
        >
          <span>⛺</span> YelpCamp
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="navbarScroll"
          className="border-0 shadow-none"
        />

        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0 ms-lg-4 fw-bold">
            <Nav.Link as={Link} to="/" className="mx-2">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/campgrounds" className="mx-2">
              Campgrounds
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/campgrounds/create"
              className="mx-2 text-success"
            >
              + New Campground
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto align-items-center gap-3">
            {!user ? (
              // LOGGED OUT STATE
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="fw-bold px-3 text-secondary"
                >
                  Login
                </Nav.Link>
                <Link to="/register">
                  <Button
                    variant="success"
                    className="rounded-pill px-4 fw-bold shadow-sm"
                    style={{
                      backgroundColor: "var(--camp-primary)",
                      border: "none",
                    }}
                  >
                    Create Account
                  </Button>
                </Link>
              </>
            ) : (
              // LOGGED IN STATE
              <>
                <div className="d-flex align-items-center gap-2 text-muted fw-bold">
                  <span>{user.username}</span>
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-pill px-3 fw-bold border-2"
                >
                  Logout
                </Button>
              </>
            )}

            {/* Mobile Theme Toggle */}
            <div className="d-lg-none mt-3 text-center border-top pt-3 w-100">
              <ThemeToggle />
            </div>
          </Nav>
        </Navbar.Collapse>

        {/* Desktop Theme Toggle */}
        <div className="d-none d-lg-block ms-3 border-start ps-3">
          <ThemeToggle />
        </div>
      </Container>
    </Navbar>
  );
}
