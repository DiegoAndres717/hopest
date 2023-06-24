export const redirectIfUnauthenticated = (status, router) => {
  if (status === "unauthenticated") {
    router.push("/");
    return true;
  }
  return false;
};
export default redirectIfUnauthenticated;
