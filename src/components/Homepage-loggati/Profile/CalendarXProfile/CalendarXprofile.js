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
