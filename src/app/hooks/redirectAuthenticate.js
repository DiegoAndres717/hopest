const redirectAuthenticate = (status, router) => {
  if (status === "authenticated") {
    router.push("/");
    return true;
  }
  return false;
};
export default redirectAuthenticate;
