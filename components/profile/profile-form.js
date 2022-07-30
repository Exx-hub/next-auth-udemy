import styles from "../../styles/profile-form.module.css";
import { useRef } from "react";
import { useSession } from "next-auth/react";

function ProfileForm() {
  const oldPassRef = useRef();
  const newPassRef = useRef();

  // const { data: session, status } = useSession();
  // console.log(session);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/user/changepassword", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPass: oldPassRef.current.value,
        newPass: newPassRef.current.value,
        // email: session.user.email,
      }),
    });

    const data = await response.json();

    console.log(data);
  };

  return (
    <form className={styles.form} onSubmit={handleChangePassword}>
      <div className={styles.control}>
        <label htmlFor="old-password">Old Password</label>
        <input type="password" id="old-password" ref={oldPassRef} />
      </div>
      <div className={styles.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPassRef} />
      </div>
      <div className={styles.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
