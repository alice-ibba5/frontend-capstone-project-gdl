import React, { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import Calendar from "react-calendar";
import "../../../node_modules/react-calendar/dist/Calendar.css";
import "./CalendarStyles.css";

const CalendarElement = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [events, setEvents] = useState([]);

  const Date_Click_Fun = (date) => {
    setSelectedDate(date);
  };

  const Event_Data_Update = (event) => {
    setEventName(event.target.value);
  };

  const Create_Event_Fun = () => {
    if (selectedDate && eventName) {
      const newEvent = {
        id: new Date().getTime(),
        date: selectedDate,
        title: eventName,
      };
      setEvents([...events, newEvent]);
      setSelectedDate(new Date());
      setEventName("");
      setSelectedDate(newEvent.date);
    }
  };

  const Update_Event_Fun = (eventId, newName) => {
    const updated_Events = events.map((event) => {
      if (event.id === eventId) {
        return {
          ...event,
          title: newName,
        };
      }
      return event;
    });
    setEvents(updated_Events);
  };

  const Delete_Event_Fun = (eventId) => {
    const updated_Events = events.filter((event) => event.id !== eventId);
    setEvents(updated_Events);
  };

  return (
    <>
      <h4 className="font-face-CinzelDecorative mt-5">
        {" "}
        Calendario degli eventi{" "}
      </h4>
      <Container className="app">
        <Row className="containerCalendar">
          <Col className="calendar-container p-0">
            <Calendar
              value={selectedDate}
              onClickDay={Date_Click_Fun}
              tileClassName={({ date }) =>
                selectedDate &&
                date.toDateString() === selectedDate.toDateString()
                  ? "selected"
                  : events.some(
                      (event) =>
                        event.date.toDateString() === date.toDateString()
                    )
                  ? "event-marked"
                  : ""
              }
            />{" "}
          </Col>
          <div className="event-container">
            {" "}
            {selectedDate && (
              <div className="event-form">
                <h4 className="font-face-CinzelDecorative mt-3">
                  {" "}
                  Crea un evento{" "}
                </h4>{" "}
                <p> Selected Date: {selectedDate.toDateString()} </p>{" "}
                <input
                  type="text"
                  placeholder="Event Name"
                  value={eventName}
                  onChange={Event_Data_Update}
                />{" "}
                <button className="create-btn" onClick={Create_Event_Fun}>
                  Add Event{" "}
                </button>{" "}
              </div>
            )}
            {events.length > 0 && selectedDate && (
              <div className="event-list">
                <h4 className="font-face-CinzelDecorative mt-3">
                  {" "}
                  Lista degli eventi creati{" "}
                </h4>{" "}
                <div className="event-cards">
                  {" "}
                  {events.map((event) =>
                    event.date.toDateString() ===
                    selectedDate.toDateString() ? (
                      <div key={event.id} className="event-card">
                        <div className="event-card-header">
                          <span className="event-date">
                            {" "}
                            {event.date.toDateString()}{" "}
                          </span>{" "}
                          <div className="event-actions">
                            <button
                              className="update-btn"
                              onClick={() =>
                                Update_Event_Fun(
                                  event.id,
                                  prompt("ENTER NEW TITLE")
                                )
                              }
                            >
                              Update Event{" "}
                            </button>{" "}
                            <button
                              className="delete-btn"
                              onClick={() => Delete_Event_Fun(event.id)}
                            >
                              Delete Event{" "}
                            </button>{" "}
                          </div>{" "}
                        </div>{" "}
                        <div className="event-card-body">
                          <p className="event-title"> {event.title} </p>{" "}
                        </div>{" "}
                      </div>
                    ) : null
                  )}{" "}
                </div>{" "}
              </div>
            )}{" "}
          </div>{" "}
        </Row>{" "}
      </Container>
    </>
  );
};

export default CalendarElement;
