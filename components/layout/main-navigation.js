import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import styles from "../../styles/main-navigation.module.css";

function MainNavigation() {
  const { data: session, status } = useSession();

  const handleLogout = () => signOut();
  return (
    <header className={styles.header}>
      <Link href="/">
        <a>
          <div className={styles.logo}>Next Auth</div>
        </a>
      </Link>
      <nav>
        <ul>
          {!session && status === "unauthenticated" && (
            <li>
              <Link href="/auth">Login</Link>
            </li>
          )}
          {session && status === "authenticated" && (
            <li>
              <Link href="/profile">Profile</Link>
            </li>
          )}
          {session && status === "authenticated" && (
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
