import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

function TimeLeft(props) {
  const [destination, setDestination] = useState(
    props.destination ? props.destination : new Date().getTime()
  );
  const [remTime, setRemTime] = useState("00m 00s");
  // const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    var interval = setInterval(function () {
      var now = new Date().getTime();
      var distance = destination - now;
      if (distance < 0) {
        clearInterval(interval);
        setRemTime("00m 00s");
        props.setIsFinishedFunc(true);
        return;
      }
      setRemTime(getTime(distance));
    }, 1000);
    return () => {
      clearInterval(interval);
      setRemTime("00m 00s");
    };
  }, [destination]);

  var getTime = (time) => {
    var days = Math.floor(time / (1000 * 60 * 60 * 24));
    days = ("0" + days).slice(-2);
    var hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    hours = ("0" + hours).slice(-2);
    var minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    minutes = ("0" + minutes).slice(-2);
    var seconds = Math.floor((time % (1000 * 60)) / 1000);
    seconds = ("0" + seconds).slice(-2);

    if (props.show === "DHMS") {
      return days + "d " + hours + "h " + minutes + "m " + seconds + "s";
    } else if (props.show === "HMS") {
      return hours + "h " + minutes + "m " + seconds + "s";
    } else if (props.show === "MS") {
      return minutes + "m " + seconds + "s";
    }
    return hours + "h " + minutes + "m " + seconds + "s";
  };

  useEffect(() => {
    setDestination(
      props.destination ? props.destination : new Date().getTime()
    );
  }, [props]);

  if (props.isFinished && !props.is_ltr) {
    return <Redirect to="/" />;
  }
  return (
    <>
      {remTime !== "" ? (
        props.is_ltr ? <b>{remTime}</b> :
        <p
          className={(props.color ? props.color : "text-success ") + "fw-500"}
          id="time"
        >
          Time Left: <b>{remTime}</b>
          <span></span>
        </p>
      ) : (
        <p
          className={(props.color ? props.color : "text-success ") + "fw-500"}
          id="time"
        >
          Time Left: <span>Loading...</span>
        </p>
      )}
    </>
  );
}

export default TimeLeft;
