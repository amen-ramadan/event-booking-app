const transformEvent = (event) => {
  return {
    ...event._doc,
    date: event._doc.date.toDateString(),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    createdAt: booking._doc.createdAt.toDateString(),
    updatedAt: booking._doc.updatedAt.toDateString(),
  };
};

export { transformEvent, transformBooking };
