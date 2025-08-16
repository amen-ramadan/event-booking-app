import { EVENTS } from "@/api/queries";
import type { event } from "@/types";
import { useQuery } from "@apollo/client";

export default function Event() {
  const EventList = () => {
    const { loading, error, data } = useQuery(EVENTS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
      <div>
        <ul>
          {data.events.map((event: event) => (
            <li key={event._id}>
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <p>{event.price}</p>
              <p>{event.date}</p>
              <p>{event.creator.username}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  return <EventList />;
}
