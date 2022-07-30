import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AuthForm from "../components/auth/auth-form";

function AuthPage() {
  // const router = useRouter();

  // useEffect(() => {
  //   getSession().then((session) => {
  //     if (session) {
  //       router.replace("/");
  //     }
  //   });
  // }, []);

  return <AuthForm />;
}

export default AuthPage;

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
