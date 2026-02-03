import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, 
        // FaGoogle 
       } from "react-icons/fa"; // Added icons

export default function Login() {
  const { login, error } = useUserStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [validated, setValidated] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const formElement = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    if (formElement.checkValidity() === false) {
      setValidated(true);
      return;
    }
    try {
      await toast.promise(
        login(form),
        {
          loading: "Logging in...",
          success: "Welcome back! ⛺",
          error: (err) => `Login failed: ${err.message}`,
        },
        { style: { minWidth: "250px" } }
      );
      navigate("/campgrounds");
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center py-5"
      style={{ minHeight: "80vh" }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} lg={6} md={8}>
          <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <span className="display-1">⛺</span>
                <h2
                  className="fw-bold mt-2"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--camp-primary)",
                  }}
                >
                  Welcome Back
                </h2>
                <p className="text-muted small">
                  Enter your details to access your account.
                </p>
              </div>

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                {/* Email */}
                <Form.Group className="mb-4" controlId="email">
                  <Form.Label className="fw-bold text-muted small text-uppercase">
                    Email
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="border-end-0 text-muted">
                      <FaEnvelope />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      name="email"
                      type="email"
                      size="lg"
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className="border-start-0 fs-6"
                    />
                    <Form.Control.Feedback type="invalid">
                      {error?.message || "Please check your email."}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-4" controlId="password">
                  <Form.Label className="fw-bold text-muted small text-uppercase">
                    Password
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="border-end-0 text-muted">
                      <FaLock />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      name="password"
                      type="password"
                      size="lg"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      className="border-start-0 fs-6"
                    />
                    <Form.Control.Feedback type="invalid">
                      Password is required.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    className="fw-bold py-2 rounded-pill shadow-sm"
                    variant="success"
                    style={{
                      backgroundColor: "var(--camp-primary)",
                      border: "none",
                    }}
                  >
                    Login
                  </Button>

                  {/* Divider */}
                  {/* <div className="d-flex align-items-center my-2">
                    <hr className="flex-grow-1" />
                    <span className="mx-3 text-muted small">OR</span>
                    <hr className="flex-grow-1" />
                  </div> */}

                  {/* <Button
                    className="fw-bold py-2 rounded-pill border-0 d-flex align-items-center justify-content-center gap-2"
                    variant="light"
                    style={{ backgroundColor: "#f1f1f1" }}
                  >
                    <FaGoogle className="text-danger" /> Login with Google
                  </Button> */}
                </div>

                <div className="text-center mt-4 pt-3 border-top">
                  <p className="text-muted small mb-0">
                    Don't have an account?{" "}
                    <Link
                      to={"/register"}
                      className="fw-bold text-success text-decoration-none"
                    >
                      Register here
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
