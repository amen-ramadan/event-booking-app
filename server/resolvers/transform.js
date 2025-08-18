const transformEvent = (event) => {
  return {
    ...event._doc,
    date: new Date(event._doc.date).toISOString().replace(/T/, " "),
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
