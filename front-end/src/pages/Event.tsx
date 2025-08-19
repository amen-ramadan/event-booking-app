import { EVENTS } from "@/api/queries";
import type { event } from "@/types";
import { useQuery } from "@apollo/client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Plus } from "lucide-react";
import EventItem from "@/components/EventItem";
import EventModal from "@/components/EventDetailsModal";
import AddEventModal from "@/components/AddEventModal";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorMessage from "@/components/ErrorMessage";

export default function Event() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { loading, error, data, refetch } = useQuery(EVENTS);

  // دالة للبحث في الأحداث
  const filteredEvents =
    data?.events?.filter(
      (event: event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleEventDetail = (eventId: string) => {
    const event = data?.events?.find((e) => e._id === eventId);
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // مكون عدم وجود أحداث
  const EmptyState = () => (
    <Card
      className="text-center py-12 border-2 border-dashed border-rose-200 dark:border-rose-800
                bg-rose-50/50 dark:bg-rose-950/20"
    >
      <CardContent className="space-y-4">
        <Calendar className="w-16 h-16 mx-auto text-rose-400 dark:text-rose-500" />
        <h3 className="text-xl font-semibold text-rose-900 dark:text-rose-100">
          {searchTerm ? "لم يتم العثور على أحداث" : "لا توجد أحداث حالياً"}
        </h3>
        <p className="text-rose-600 dark:text-rose-300">
          {searchTerm
            ? "جرب البحث بكلمات مختلفة أو امسح البحث لعرض جميع الأحداث"
            : "ابدأ بإنشاء حدثك الأول!"}
        </p>
        {searchTerm && (
          <Button
            variant="outline"
            onClick={() => setSearchTerm("")}
            className="border-rose-300 text-rose-700 hover:bg-rose-100
                      dark:border-rose-600 dark:text-rose-300 dark:hover:bg-rose-950"
          >
            مسح البحث
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        {/* اضافة مناسبة */}
        <div>
          <Button
            variant="outline"
            onClick={() => setIsAddModalOpen(true)}
            className="border-rose-300 text-rose-700 hover:bg-rose-100
                      dark:border-rose-600 dark:text-rose-300 dark:hover:bg-rose-950"
          >
            <Plus className="w-4 h-4 mr-2" />
            اضافة مناسبة
          </Button>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <Calendar className="w-8 h-8 text-rose-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-rose-800 bg-clip-text text-transparent">
            الأحداث المتاحة
          </h1>
        </div>

        {/* إحصائيات سريعة */}
        {data?.events && (
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge
              variant="secondary"
              className="bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300 px-3 py-1"
            >
              إجمالي الأحداث: {data.events.length}
            </Badge>
            {searchTerm && (
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-3 py-1"
              >
                نتائج البحث: {filteredEvents.length}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 
                      text-rose-400 dark:text-rose-500 w-4 h-4"
          />
          <Input
            type="text"
            placeholder="ابحث في الأحداث..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-rose-200 focus:border-rose-400 focus:ring-rose-400
                      dark:border-rose-800 dark:focus:border-rose-600 dark:focus:ring-rose-600
                      bg-white dark:bg-gray-950"
          />
        </div>
      </div>

      {/* محتوى الأحداث */}
      <div className="space-y-6">
        {loading && <LoadingSkeleton />}

        {error && <ErrorMessage error={error} refetch={refetch} />}

        {data && filteredEvents.length === 0 && <EmptyState />}

        {data && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event: event) => (
              <div
                key={event._id}
                className="transform transition-all duration-200 hover:scale-[1.02]"
              >
                <EventItem
                  _id={event._id}
                  title={event.title}
                  price={event.price}
                  date={event.date}
                  description={event.description}
                  creator={event.creator}
                  onDetail={handleEventDetail}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer info */}
      {data?.events && filteredEvents.length > 0 && (
        <div
          className="text-center text-sm text-rose-600 dark:text-rose-400 
                      border-t border-rose-100 dark:border-rose-900 pt-6"
        >
          <p>
            يتم عرض {filteredEvents.length} من أصل {data.events.length} حدث
          </p>
        </div>
      )}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
      <AddEventModal isOpen={isAddModalOpen} onClose={closeAddModal} />
    </div>
  );
}
