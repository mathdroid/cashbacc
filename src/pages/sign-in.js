import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button, Input } from "@chakra-ui/core";

import firebase from "firebase/app";
import "firebase/auth";

const CurrentUser = () => {
  const [user, initialising, error] = useAuthState(firebase.auth());
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shouldShowOtpInput, setShouldShowOtpInput] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [confirmationResult, setConfirmationResult] = useState({});

  const toggleOtpInput = () => setShouldShowOtpInput(!shouldShowOtpInput);

  const handlePhoneNumberChange = e => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpValueChange = e => {
    setOtpValue(e.target.value);
  };

  const login = () => {
    if (typeof document !== "undefined") {
      const applicationVerifier = new firebase.auth.RecaptchaVerifier(
        "login-button",
        {
          size: "invisible"
        }
      );
      firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, applicationVerifier)
        .then(async confirmationResult => {
          toggleOtpInput();
          setConfirmationResult(confirmationResult);
        })
        .catch(error => {
          console.error({ error });
        });
    }
  };

  const logout = () => {
    firebase.auth().signOut();
    setShouldShowOtpInput(false);
    setConfirmationResult({});
    setOtpValue("");
    setPhoneNumber("");
  };

  const confirmOtp = () => {
    if (confirmationResult.confirm) {
      confirmationResult.confirm(otpValue);
    }
  };

  if (initialising) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }
  if (user) {
    return (
      <div>
        <p>Current User: {user.uid}</p>
        <button onClick={logout}>Log out</button>
      </div>
    );
  }
  return (
    <>
      <Input
        placeholder="phone number"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
      />
      {shouldShowOtpInput && (
        <Input
          placeholder="OTP"
          value={otpValue}
          onChange={handleOtpValueChange}
        />
      )}
      <Button
        onClick={shouldShowOtpInput ? confirmOtp : login}
        id="login-button"
      >
        {shouldShowOtpInput ? "confirm OTP" : "log in"}
      </Button>
    </>
  );
};

export default () => <CurrentUser />;
