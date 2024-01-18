import React, { useEffect, useState } from "react";
import { Container, Col, Row, Image } from "react-bootstrap";
import Calendar from "react-calendar";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "../../../../../node_modules/react-calendar/dist/Calendar.css";
import "./styles.css";

const CalendarElement = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState("");
  const [eventId, setEventId] = useState("");
  const [gdl, setGdl] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isMounted, setIsMounted] = useState(true);
  const { id } = useParams();
  const storedUserId = localStorage.getItem("userId");
  const storedUserToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/${storedUserId}`,
          {
            headers: {
              Authorization: "Bearer " + storedUserToken,
            },
          }
        );

        if (isMounted && userResponse.ok) {
          const data = await userResponse.json();
          setUser(data);
          console.log(data);
        } else {
          console.log("Error fetching user data:", userResponse.statusText);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function to set isMounted to false when the component is unmounted
    return () => {
      setIsMounted(false);
    };
  }, [storedUserId, storedUserToken, isMounted]);

  const Date_Click_Fun = (date) => {
    setSelectedDate(date);

    // Trova l'evento corrispondente alla data selezionata
    const selectedEventForDate = user.eventId.find(
      (event) => new Date(event.date).toDateString() === date.toDateString()
    );

    // Imposta l'evento selezionato
    setSelectedEvent(selectedEventForDate || null);
  };

  const Event_Data_Update = (event) => {
    event.preventDefault();
    setEventName(event.target.value);
  };

  const Delete_Event_Fun = (eventId) => {
    const updated_Events = events.filter((event) => event.id !== eventId);
    setEvents(updated_Events);
  };

  const deleteEvent = async () => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserToken = localStorage.getItem("token");
    setLoading(true);

    try {
      // Ottieni gli eventi dell'utente dal backend
      const userResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/${storedUserId}`,
        {
          headers: {
            Authorization: "Bearer " + storedUserToken,
          },
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        const userEvents = userData.eventId || []; // Array degli eventi dell'utente
        console.log(userEvents);

        // Elimina l'evento dall'array degli eventi dell'utente
        const deletedEvent = [...userEvents];
        deletedEvent.splice(eventId);

        // Invia la richiesta di aggiornamento degli eventi dell'utente al backend
        const updateResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/${storedUserId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + storedUserToken,
            },
            method: "PUT",
            body: JSON.stringify({ eventId: deletedEvent }),
          }
        );

        if (updateResponse.ok) {
          // Elimina l'evento dall'array degli eventi utilizzando splice
          setEvents(deletedEvent);
        }

        setEventId(eventId);

        toast("Event deleted from your dashboard successfully!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
          window.location.href = `/users/${storedUserId}`;
        }, 2000);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const ShowEventDetails = (event) => {
    setSelectedEvent(event);
  };

  console.log("selectedEvent:", selectedEvent);

  const getEvent = async () => {
    try {
      if (
        !selectedEvent ||
        !selectedEvent.gdl ||
        !selectedEvent.gdl ||
        !selectedEvent._id
      ) {
        // Gestione caso in cui l'evento o l'ID sia mancante
        console.error("Event or ID is missing.");
        return;
      }
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdl/${selectedEvent?.gdl}/events/${selectedEvent?._id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setEvents(data);
      console.log("Data:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (selectedEvent) {
      getEvent();
    }
  }, [selectedEvent]);

  return (
    <>
      <h4 className="font-face-CinzelDecorative mt-5">
        {" "}
        Calendario degli eventi a cui partecipi:{" "}
      </h4>
      <Container className="app">
        <Row className="containerCalendar">
          <Col className="calendar-container p-0">
            <Calendar
              value={selectedDate}
              onClickDay={Date_Click_Fun}
              tileClassName={({ date }) =>
                user.eventId?.some((event) => {
                  const eventDate = new Date(event.date);
                  return (
                    eventDate instanceof Date &&
                    eventDate.toDateString() === date.toDateString()
                  );
                })
                  ? "event-marked"
                  : ""
              }
            />{" "}
          </Col>
          <Row className="event-container d-flex justify-content-between">
            {" "}
            {selectedDate && (
              <Col lg={4} className="event-form">
                <p>
                  {" "}
                  Selected Date:{" "}
                  {selectedDate instanceof Date &&
                    selectedDate.toDateString()}{" "}
                </p>{" "}
              </Col>
            )}
            {user.eventId?.length > 0 && selectedDate && (
              <Col lg={4} className="event-list">
                {" "}
                {selectedEvent && (
                  <>
                    <h4 className="font-face-CinzelDecorative mt-3">
                      {" "}
                      Eventi in programma:{" "}
                    </h4>{" "}
                    <div className="event-cards">
                      <div key={id} className="event-card">
                        <div className="event-card-header">
                          <span className="event-date">
                            {" "}
                            {/* {new Date(selectedEvent.date).toDateString()}{" "} */}
                          </span>{" "}
                          <div className="event-actions">
                            <button
                              className="delete-btn"
                              onClick={() => deleteEvent(id)}
                            >
                              Delete Event{" "}
                            </button>{" "}
                          </div>{" "}
                        </div>{" "}
                        <div className="event-card-body d-flex flex-column">
                          <div className="d-flex">
                            <h5 className="font-face-CinzelDecorative me-5">
                              Event title:{" "}
                            </h5>{" "}
                            <p>{selectedEvent.title}</p>
                          </div>
                          <div className="d-flex justify-content-between">
                            <h5 className="font-face-CinzelDecorative">
                              Gdl:{" "}
                            </h5>{" "}
                            <Image
                              className="avatar align-item-center"
                              src={events?.gdl?.cover}
                              fluid
                              style={{ width: "100px" }}
                            />
                          </div>
                        </div>{" "}
                        <div className="event-card-body"></div>{" "}
                      </div>
                    </div>
                  </>
                )}{" "}
              </Col>
            )}{" "}
          </Row>{" "}
        </Row>{" "}
      </Container>
    </>
  );
};

export default CalendarElement;
