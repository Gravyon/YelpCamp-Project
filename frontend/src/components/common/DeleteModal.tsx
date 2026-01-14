import { Button, Modal } from "react-bootstrap";

export default function DeleteModal({
  show,
  onHide,
  onConfirm,
  title,
  body,
}: any) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      contentClassName="border-0 rounded-4 shadow-lg overflow-hidden"
    >
      <div
        style={{
          backgroundColor: "var(--camp-card-bg)",
          color: "var(--bs-body-color)",
        }}
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title
            className="fw-bold"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--camp-accent)",
            }}
          >
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <p className="mb-0 fs-5">{body}</p>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="secondary"
            className="rounded-pill fw-bold px-4"
            onClick={onHide}
            style={{
              backgroundColor: "var(--camp-input-bg)",
              border: "none",
              color: "var(--bs-body-color)",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="rounded-pill fw-bold px-4 shadow-sm"
            style={{ backgroundColor: "var(--camp-accent)", border: "none" }}
            onClick={onConfirm}
          >
            Confirm Delete
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
}
