import React, { useState } from "react";
import styled from "styled-components";

const Wrap = styled.div`
  width: min(460px, 100%);
  margin: 0 auto;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  background: rgba(11, 14, 20, 0.82);
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(18px);
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 18px;
`;

const Tab = styled.button`
  padding: 10px 12px;
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(241, 201, 107, 0.9)" : "rgba(255, 255, 255, 0.1)"};
  border-radius: 12px;
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, rgba(241, 201, 107, 0.22), rgba(217, 141, 43, 0.16))"
      : "rgba(255, 255, 255, 0.04)"};
  color: ${({ $active }) => ($active ? "#fff7e2" : "#ebe4d6")};
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
`;

const Title = styled.h2`
  margin: 0 0 8px;
  font-size: 1.35rem;
  color: #fff8ea;
`;

const Subtitle = styled.p`
  margin: 0 0 18px;
  color: rgba(244, 239, 230, 0.7);
  font-size: 0.9rem;
  line-height: 1.5;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  font-size: 0.84rem;
  font-weight: 600;
  color: #f7f0e4;
`;

const Input = styled.input`
  width: 100%;
  padding: 11px 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  color: #fff9ef;

  &:focus {
    outline: none;
    border-color: rgba(241, 201, 107, 0.85);
    box-shadow: 0 0 0 4px rgba(241, 201, 107, 0.14);
  }
`;

const Button = styled.button`
  width: 100%;
  margin-top: 8px;
  padding: 12px 14px;
  border: none;
  border-radius: 13px;
  background: linear-gradient(135deg, #f1c96b 0%, #d98d2b 100%);
  color: #1c1407;
  font-size: 0.92rem;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Note = styled.p`
  margin: 12px 0 0;
  color: rgba(244, 239, 230, 0.62);
  font-size: 0.78rem;
  line-height: 1.45;
`;

function AuthPanel({ onRegister, onLogin, onRequestOtp, onResetPassword, busy }) {
  const [mode, setMode] = useState("login");
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [resetForm, setResetForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  return (
    <Wrap>
      <Tabs>
        <Tab type="button" $active={mode === "login"} onClick={() => setMode("login")}>
          Login
        </Tab>
        <Tab
          type="button"
          $active={mode === "register"}
          onClick={() => setMode("register")}
        >
          Register
        </Tab>
        <Tab type="button" $active={mode === "forgot"} onClick={() => setMode("forgot")}>
          Forgot
        </Tab>
      </Tabs>

      {mode === "login" ? (
        <>
          <Title>Login to print cheques</Title>
          <Subtitle>Your cheque history and printing access are available only after login.</Subtitle>
          <Field>
            <Label>Gmail</Label>
            <Input
              type="email"
              value={loginForm.email}
              onChange={(event) =>
                setLoginForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="name@gmail.com"
            />
          </Field>
          <Field>
            <Label>Password</Label>
            <Input
              type="password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm((current) => ({ ...current, password: event.target.value }))
              }
              placeholder="Password"
            />
          </Field>
          <Button
            type="button"
            disabled={busy}
            onClick={() => onLogin(loginForm)}
          >
            {busy ? "Please wait..." : "Login"}
          </Button>
        </>
      ) : null}

      {mode === "register" ? (
        <>
          <Title>Create your account</Title>
          <Subtitle>Use your Gmail, phone number, name, and password to secure cheque access.</Subtitle>
          <Grid>
            <Field>
              <Label>Name</Label>
              <Input
                type="text"
                value={registerForm.name}
                onChange={(event) =>
                  setRegisterForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Full name"
              />
            </Field>
            <Field>
              <Label>Phone</Label>
              <Input
                type="tel"
                value={registerForm.phone}
                onChange={(event) =>
                  setRegisterForm((current) => ({ ...current, phone: event.target.value }))
                }
                placeholder="Phone number"
              />
            </Field>
          </Grid>
          <Field>
            <Label>Gmail</Label>
            <Input
              type="email"
              value={registerForm.email}
              onChange={(event) =>
                setRegisterForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="name@gmail.com"
            />
          </Field>
          <Field>
            <Label>Password</Label>
            <Input
              type="password"
              value={registerForm.password}
              onChange={(event) =>
                setRegisterForm((current) => ({ ...current, password: event.target.value }))
              }
              placeholder="Minimum 6 characters"
            />
          </Field>
          <Button
            type="button"
            disabled={busy}
            onClick={() => onRegister(registerForm)}
          >
            {busy ? "Please wait..." : "Create Account"}
          </Button>
        </>
      ) : null}

      {mode === "forgot" ? (
        <>
          <Title>Reset password with OTP</Title>
          <Subtitle>Enter your Gmail to receive an OTP, then set a new password.</Subtitle>
          <Field>
            <Label>Gmail</Label>
            <Input
              type="email"
              value={resetForm.email}
              onChange={(event) =>
                setResetForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="name@gmail.com"
            />
          </Field>
          <Grid>
            <Field>
              <Label>OTP</Label>
              <Input
                type="text"
                value={resetForm.otp}
                onChange={(event) =>
                  setResetForm((current) => ({ ...current, otp: event.target.value }))
                }
                placeholder="6 digit OTP"
              />
            </Field>
            <Field>
              <Label>New Password</Label>
              <Input
                type="password"
                value={resetForm.newPassword}
                onChange={(event) =>
                  setResetForm((current) => ({
                    ...current,
                    newPassword: event.target.value,
                  }))
                }
                placeholder="New password"
              />
            </Field>
          </Grid>
          <Grid>
            <Button type="button" disabled={busy} onClick={() => onRequestOtp(resetForm.email)}>
              Send OTP
            </Button>
            <Button
              type="button"
              disabled={busy}
              onClick={() => onResetPassword(resetForm)}
            >
              Reset Password
            </Button>
          </Grid>
          <Note>
            If Gmail is not configured in the backend, the OTP will be logged in the backend console for development.
          </Note>
        </>
      ) : null}
    </Wrap>
  );
}

export default AuthPanel;
