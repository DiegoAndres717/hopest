export const slideHandlers = (images, setCurrentSlide) => {
    const handleNext = () => {
      if (!images) return;
      setCurrentSlide((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    };
    
    const handlePrev = () => {
      if (!images) return;
      setCurrentSlide((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    };
  
    return { handleNext, handlePrev };
  }