import { useEffect, useState } from "react";
import { useCampgroundStore } from "../../store/campgroundStore";
import { Link, useSearchParams } from "react-router-dom";
import { FaMapMarkerAlt, FaSearch, FaTree } from "react-icons/fa"; // Added FaTree
import ClusterMap from "../../components/campgrounds/ClusterMap";
import {
  Alert,
  Image,
  Pagination,
  Container,
  Row,
  Col,
  Card,
  Button,
  InputGroup,
  Form,
} from "react-bootstrap";
import Loader from "../../components/common/Loader";

export default function Campgrounds() {
  const {
    campgrounds,
    loading,
    error,
    getCampgrounds,
    currentPage,
    totalPages,
    searchQuery,
  } = useCampgroundStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [term, setTerm] = useState(initialSearch);

  const [scrollingNeeded, setScrollingNeeded] = useState(false);

  useEffect(() => {
    document.title = "Campgrounds";
    getCampgrounds(1, initialSearch); // Ensure we start on page 1
  }, [getCampgrounds, initialSearch]);

  useEffect(() => {
    // Only scroll if we are done loading AND a scroll was requested
    if (!loading && scrollingNeeded) {
      setTimeout(() => {
        const anchor = document.getElementById("campgrounds-list");
        if (anchor) {
          anchor.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      setScrollingNeeded(false);
    }
  }, [loading, scrollingNeeded]);

  const handlePageChange = (pageNumber: number) => {
    if (
      pageNumber !== currentPage &&
      pageNumber >= 1 &&
      pageNumber <= totalPages
    ) {
      setScrollingNeeded(true);
      getCampgrounds(pageNumber, searchQuery);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ search: term });
    const anchor = document.getElementById("campgrounds-list");
    anchor?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderPaginationItems = () => {
    const items = [];

    const renderPageButton = (number: number) => (
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => handlePageChange(number)}
        linkStyle={
          number === currentPage
            ? {
                backgroundColor: "var(--camp-primary)",
                borderColor: "var(--camp-primary)",
                color: "white",
              }
            : { color: "var(--camp-primary)", border: "none" }
        }
      >
        {number}
      </Pagination.Item>
    );

    // 1. ALWAYS SHOW FIRST PAGE
    items.push(renderPageButton(1));

    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(totalPages - 1, 5);
      startPage = 2;
    }

    // If current is 48, 49, 50, show from page 46
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 4);
      endPage = totalPages - 1;
    }

    // 3. ADD LEFT ELLIPSIS
    // Only if there is a gap between 1 and the start of our range
    if (startPage > 2) {
      items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
    }

    // 4. RENDER MIDDLE PAGES
    for (let number = startPage; number <= endPage; number++) {
      items.push(renderPageButton(number));
    }

    // 5. ADD RIGHT ELLIPSIS
    // Only if there is a gap between our range and the last page
    if (endPage < totalPages - 1) {
      items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
    }

    // 6. ALWAYS SHOW LAST PAGE
    if (totalPages > 1) {
      items.push(renderPageButton(totalPages));
    }

    return items;
  };

  if (loading)
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Loader />
        <p className="mt-3 text-muted fw-bold">Scouting for locations...</p>
      </div>
    );

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="shadow-sm border-0 rounded-3">
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>{error.message}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <>
        {/* HEADER & MAP SECTION */}
        <div className="mb-5">
          <h1
            className="display-5 fw-bold mb-3"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--camp-primary)",
            }}
          >
            <FaTree className="me-2 mb-1" />
            Explore Campgrounds
          </h1>
          <p className="text-muted lead mb-4">
            View our hand-picked camping spots on the map or browse the list
            below.
          </p>

          {/* Map Container with Shadow/Radius */}
          {campgrounds.length > 0 && (
            <div
              className="bg-white shadow-lg my-4 rounded-4 overflow-hidden border border-1"
              style={{ borderColor: "var(--camp-border)" }}
            >
              <ClusterMap campgrounds={campgrounds} />
            </div>
          )}

          {/* Sroll helper */}

          <div id="campgrounds-list" style={{ scrollMarginTop: "100px" }} />

          {/* Search Bar within the list page */}
          <div
            style={{
              maxWidth: "700px",
            }}
            className="border border-3 p-2 rounded-pill shadow-lg p-3 bg-body rounded"
          >
            <Form onSubmit={handleSearchSubmit} className="d-flex">
              <InputGroup>
                <Form.Control
                  className="border-0 shadow-none bg-transparent form-control-lg"
                  placeholder="Search our campgrounds..."
                  value={term}
                  onChange={(e: any) => setTerm(e.target.value)}
                  size="lg"
                />
              </InputGroup>
              <Button
                size="lg"
                className="rounded-pill px-5 fw-bold"
                style={{
                  backgroundColor: "var(--camp-primary)",
                  border: "none",
                }}
                type="submit"
              >
                <FaSearch />
              </Button>
            </Form>
          </div>
        </div>

        {!loading && campgrounds.length === 0 && (
          <div className="text-center py-5">
            <h3>No campgrounds found matching "{searchQuery}"</h3>
            <Button variant="link" onClick={() => setSearchParams({})}>
              Clear Search
            </Button>
          </div>
        )}

        {/* LIST SECTION */}
        <Row>
          {campgrounds.map((camp) => (
            <Col xs={12} key={camp._id} className="mb-4">
              <Card
                className="border-0 shadow-sm overflow-hidden h-100"
                style={{ transition: "transform 0.2s" }}
              >
                <Row className="g-0">
                  {/* Image Column */}
                  <Col md={4}>
                    <Image
                      alt={camp.title}
                      src={
                        camp.images && camp.images.length > 0
                          ? camp.images[0].url
                          : "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                      }
                      className="img-fluid w-100 h-100 object-fit-cover"
                      style={{
                        minHeight: "250px", // Ensures height on mobile
                        maxHeight: "300px", // Keeps it tidy on desktop
                      }}
                    />
                  </Col>

                  {/* Content Column */}
                  <Col md={8}>
                    <Card.Body className="d-flex flex-column h-100 p-4">
                      <Card.Title
                        as="h3"
                        className="fw-bold mb-3"
                        style={{
                          fontFamily: "var(--font-heading)",
                          color: "var(--camp-primary)",
                        }}
                      >
                        {camp.title}
                      </Card.Title>

                      <Card.Text className="text-muted flex-grow-1">
                        {camp.description.substring(0, 150)}...
                      </Card.Text>

                      <div className="mt-3">
                        <div className="d-flex align-items-center text-secondary mb-3">
                          <FaMapMarkerAlt className="me-2 text-danger" />
                          <small className="fw-bold">{camp.location}</small>
                        </div>

                        <Link to={`/campgrounds/${camp._id}`}>
                          <Button
                            variant="success"
                            className="px-4 py-2 rounded-pill fw-bold shadow-sm"
                            style={{
                              backgroundColor: "var(--camp-primary)",
                              border: "none",
                            }}
                          >
                            View Campground
                          </Button>
                        </Link>
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-5">
            <Pagination className="shadow-sm rounded-pill overflow-hidden border border-2">
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                linkClassName="text-success border-0"
              />

              {renderPaginationItems()}

              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                linkClassName="text-success border-0"
              />
            </Pagination>
          </div>
        )}
      </>
    </Container>
  );
}
