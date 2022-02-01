import React, { useState } from "react";
import { Modal, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init({
  duration: 1000,
});

function Venue({ venue, date }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className="row bs" data-aos="fade-up">
      <div className="col-md-4">
        <img src={venue.imageurls[0]} className="smallimg"></img>
      </div>
      <div className="col-md-7 ">
        <h1>{venue.name}</h1>
        <b>
          <p> Max Count : {venue.maxcount}</p>
          <p>Phone Number : {venue.phonenumber}</p>
          <p> Type : {venue.type} </p>
        </b>
        <div style={{ float: "right" }}>
          {date && (
            <Link to={`/book/${venue._id}/${date}`}>
              <button className="btn btn-primary m-2">Book Now</button>
            </Link>
          )}

          <button className="btn btn-primary" onClick={handleShow}>
            View Details
          </button>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header>
          <Modal.Title>{venue.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel prevLabel="" nextLabel="">
            {venue.imageurls.map((url) => {
              return (
                <Carousel.Item>
                  <img className="d-block w-100 bigimg" src={url} />
                </Carousel.Item>
              );
            })}
          </Carousel>
          <p>{venue.description}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Venue;
