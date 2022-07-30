import { useState, useRef } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/auth-form.module.css";

import { signIn } from "next-auth/react";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const emailRef = useRef();
  const passwordRef = useRef();
  const router = useRouter();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  const handleSignUp = (email, password) => {
    fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Sign up failed!");
        }

        return res.json();
      })
      .then((data) => {
        console.log(data);
        emailRef.current.value = "";
        passwordRef.current.value = "";
        setIsLogin(true);
      })
      .catch((err) => console.error(err));
  };

  const handleGithubLogin = (e) => {
    e.preventDefault();
    signIn("github");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (isLogin) {
      // sign the user in using next auth
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log(result);

      if (!result.error) {
        // auth success and do something
        router.replace("/profile");
      }
    } else {
      //sign up
      handleSignUp(email, password);
    }
  };

  return (
    <section className={styles.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailRef} />
        </div>
        <div className={styles.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" required ref={passwordRef} />
        </div>
        <div className={styles.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={styles.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>

          {/* {isLogin && (
            <button
              onClick={handleGithubLogin}
              className={styles.githubBtn}
              type="button"
            >
              Sign in with GitHub
            </button>
          )} */}
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
