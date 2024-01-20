import React, { useEffect, useState } from "react";
import { Container, Col, Row, Image } from "react-bootstrap";
import Calendar from "react-calendar";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "../../../node_modules/react-calendar/dist/Calendar.css";
import "./CalendarStyles.css";

const CalendarElement = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState("");
  const [eventId, setEventId] = useState("");
  const [gdl, setGdl] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { id } = useParams();
  const storedUserId = localStorage.getItem("userId");
  const storedUserToken = localStorage.getItem("token");

  const getEvents = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdl/${id}/events`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  const Date_Click_Fun = (date) => {
    setSelectedDate(date);

    // Trova l'evento corrispondente alla data selezionata
    const selectedEventForDate = events.find(
      (event) => new Date(event.date).toDateString() === date.toDateString()
    );

    // Imposta l'evento selezionato
    setSelectedEvent(selectedEventForDate || null);
  };

  const Event_Data_Update = (event) => {
    event.preventDefault();
    setEventName(event.target.value);
  };

  const Create_Event_Fun = async () => {
    if (selectedDate && eventName) {
      const newEvent = {
        gdl: id,
        user: storedUserId,
        date: selectedDate,
        title: eventName,
      };
      try {
        let response = await fetch(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdl/${id}/events`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(newEvent),
          }
        );

        if (response.ok) {
          setEvents([...events, newEvent]);
          setSelectedDate(new Date());
          setEventName("");
          setSelectedDate(newEvent.date);
          setUser(storedUserId);
          setGdl(id);

          toast("Event added successfully!", {
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
            window.location.href = `/gdl/${id}`;
          }, 2000);
        } else {
          // Logga la risposta del backend in caso di errore
          console.error("Error creating event. Backend response:", response);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const changeEvent = async () => {
    const newTitle = prompt("Enter new title");
    if (newTitle) {
      const formData = {
        title: newTitle,
      };

      try {
        console.log("Trying to update event:", selectedEvent._id);
        let response = await fetch(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdl/${id}/events/${selectedEvent._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        if (response.ok) {
          setEventName(newTitle);
          toast("Event modified successfully!", {
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
            window.location.href = `/gdl/${id}`;
          }, 2000);
        } else {
          toast.error("Something went wrong!", {
            position: toast.POSITION.TOP_LEFT,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const Delete_Event_Fun = (eventId) => {
    const updated_Events = events.filter((event) => event.id !== eventId);
    setEvents(updated_Events);
  };

  const deleteEvent = async () => {
    try {
      let response = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdl/${id}/events/${selectedEvent._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast("Event deleted successfully!", {
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
          window.location.href = `/gdl/${id}`;
        }, 2000);
      } else {
        toast.error("Something went wrong!", {
          position: toast.POSITION.TOP_LEFT,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const ShowEventDetails = (event) => {
    setSelectedEvent(event);
    addEventToDashboard(); // Chiamare la funzione qui dopo aver impostato selectedEvent
  };

  const addEventToDashboard = async () => {
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

        // Verifica se l'evento è già presente nell'array degli eventi dell'utente
        const isEventAlreadyAdded = userEvents.some(
          (event) => event._id === selectedEvent._id
        );
        console.log(isEventAlreadyAdded);
        if (!isEventAlreadyAdded) {
          // Aggiungi l'evento all'array degli eventi dell'utente
          const newEvents = [...userEvents];
          newEvents.push(selectedEvent);

          // Invia la richiesta di aggiornamento degli eventi dell'utente al backend
          const updateResponse = await fetch(
            `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/${storedUserId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + storedUserToken,
              },
              method: "PUT",
              body: JSON.stringify({ eventId: newEvents }),
            }
          );

          if (updateResponse.ok) {
            // Aggiungi l'evento all'array events utilizzando push
            setEvents(newEvents);
          }

          setEventId(selectedEvent._id);

          toast("Event added to your dashboard successfully!", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast.error("Something went wrong while updating user events!", {
            position: toast.POSITION.TOP_LEFT,
          });
        }
      } else {
        // L'evento è già presente nell'array degli eventi dell'utente
        toast.warn("Event is already added to your dashboard!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h4 className="font-face-CinzelDecorative mt-5"> Events calendar </h4>
      <Container className="app">
        <Row className="containerCalendar">
          <Col className="calendar-container p-0">
            <Calendar
              value={selectedDate}
              onClickDay={Date_Click_Fun}
              tileClassName={({ date }) =>
                events.some((event) => {
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
                <h4 className="font-face-CinzelDecorative mt-3">
                  {" "}
                  Create an event{" "}
                </h4>{" "}
                <p>
                  {" "}
                  Selected Date:{" "}
                  {selectedDate instanceof Date &&
                    selectedDate.toDateString()}{" "}
                </p>{" "}
                <input
                  type="text"
                  placeholder="Event Name"
                  value={eventName}
                  onChange={Event_Data_Update}
                />{" "}
                <button className="create-btn" onClick={Create_Event_Fun}>
                  Add Event{" "}
                </button>{" "}
              </Col>
            )}
            {events.length > 0 && selectedDate && (
              <Col lg={4} className="event-list">
                {" "}
                {selectedEvent && (
                  <>
                    <h4 className="font-face-CinzelDecorative mt-3">
                      {" "}
                      Attended events:{" "}
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
                              className="update-btn"
                              onClick={() => changeEvent(eventName)}
                            >
                              Update Event{" "}
                            </button>{" "}
                            <button
                              className="delete-btn"
                              onClick={() => deleteEvent(id)}
                            >
                              Delete Event{" "}
                            </button>{" "}
                            <button
                              className="add-btn"
                              onClick={() => addEventToDashboard(id)}
                            >
                              Add Event to your dashboard{" "}
                            </button>{" "}
                          </div>{" "}
                        </div>{" "}
                        <div className="event-card-body">
                          <h5 className="font-face-CinzelDecorative">
                            Event title:{" "}
                          </h5>{" "}
                          <p>{selectedEvent.title}</p>
                        </div>{" "}
                        <div className="event-card-body">
                          <h6 className="font-face-CinzelDecorative">
                            Created by:{" "}
                          </h6>{" "}
                          <p>
                            <Image
                              src={selectedEvent.user.avatar}
                              style={{ width: "30px" }}
                              roundedCircle
                              className="me-2"
                            />
                            {selectedEvent.user.name}{" "}
                            {selectedEvent.user.surname}
                          </p>
                        </div>{" "}
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
