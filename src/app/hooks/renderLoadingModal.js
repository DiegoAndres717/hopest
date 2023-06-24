import LoadingModal from "../components/modals/LoadingModal";
export const renderLoadingModal = (status) => {
  if (status === "loading") {
    return <LoadingModal />;
  }
  return null;
};
