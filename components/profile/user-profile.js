import ProfileForm from "./profile-form";
import styles from "../../styles/user-profile.module.css";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function UserProfile() {
  // handled server side --- page protection
  // const { data: session, status } = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     window.location.href = "auth";
  //   },
  // });

  // if (status === "loading") {
  //   return <h2>Loading...</h2>;
  // }

  return (
    <section className={styles.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  );
}

export default UserProfile;
