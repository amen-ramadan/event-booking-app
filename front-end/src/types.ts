type event = {
  _id: string;
  title: string;
  description: string;
  price: number;
  date: string;
  creator: {
    id: string;
    username: string;
  };
};

export type {event};