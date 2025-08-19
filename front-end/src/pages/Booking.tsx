import { BOOKINGS, CANCEL_BOOKING } from "@/api/queries";
import BookingItem from "@/components/BookingItem";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { useState } from "react";
import { Search, Ticket } from "lucide-react";

// تعريف أنواع البيانات
interface BookingEvent {
  _id: string;
  title: string;
  description: string;
  price: number;
  date: string;
  creator?: {
    _id: string;
    email?: string;
    [key: string]: unknown;
  };
}

interface Booking {
  _id: string;
  event: BookingEvent;
  createdAt: string;
  updatedAt?: string;
  user?: {
    _id: string;
    email?: string;
    [key: string]: unknown;
  };
}

interface BookingsData {
  bookings: Booking[];
}

export default function Booking() {
  const [searchTerm, setSearchTerm] = useState("");
  const { loading, error, data, refetch } = useQuery<BookingsData>(BOOKINGS);
  const [cancelBooking, { loading: cancelLoading }] =
    useMutation(CANCEL_BOOKING);

  // دالة للبحث في الحجوزات
  const filteredBookings =
    data?.bookings?.filter(
      (booking: Booking) =>
        booking.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.event.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    ) || [];

  // دالة إلغاء الحجز
  const handleCancelBooking = async (bookingId: string) => {
    try {
      const result = await cancelBooking({
        variables: { bookingId },
        update: (cache) => {
          // تحديث الكاش بعد الإلغاء
          const existingBookings = cache.readQuery<BookingsData>({
            query: BOOKINGS,
          });
          if (existingBookings) {
            cache.writeQuery({
              query: BOOKINGS,
              data: {
                bookings: existingBookings.bookings.filter(
                  (booking) => booking._id !== bookingId
                ),
              },
            });
          }
        },
      });

      if (result.data) {
        toast.success("تم إلغاء الحجز بنجاح", {
          duration: 3000,
          position: "top-center",
        });
        // إعادة جلب البيانات للتأكد من التحديث
        await refetch();
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إلغاء الحجز", {
        duration: 5000,
        position: "top-center",
      });
      console.error("Cancel booking error:", error);
    }
  };

  // مكون عدم وجود حجوزات
  const EmptyState = () => (
    <Card
      className="text-center py-12 border-2 border-dashed border-rose-200 dark:border-rose-800
                bg-rose-50/50 dark:bg-rose-950/20"
    >
      <CardContent className="space-y-4">
        <Ticket className="w-16 h-16 mx-auto text-rose-400 dark:text-rose-500" />
        <h3 className="text-xl font-semibold text-rose-900 dark:text-rose-100">
          {searchTerm ? "لم يتم العثور على حجوزات" : "لا توجد حجوزات حالياً"}
        </h3>
        <p className="text-rose-600 dark:text-rose-300">
          {searchTerm
            ? "جرب البحث بكلمات مختلفة أو امسح البحث لعرض جميع الحجوزات"
            : "ابدأ بحجز حدثك الأول من صفحة الأحداث!"}
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
        <div className="flex items-center justify-center gap-3 mb-4">
          <Ticket className="w-8 h-8 text-rose-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-rose-800 bg-clip-text text-transparent p-4">
            حجوزاتي
          </h1>
        </div>

        {/* إحصائيات سريعة */}
        {data?.bookings && (
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge
              variant="secondary"
              className="bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300 px-3 py-1"
            >
              إجمالي الحجوزات: {data.bookings.length}
            </Badge>
            {searchTerm && (
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-3 py-1"
              >
                نتائج البحث: {filteredBookings.length}
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
            placeholder="ابحث في حجوزاتك..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-rose-200 focus:border-rose-400 focus:ring-rose-400
                      dark:border-rose-800 dark:focus:border-rose-600 dark:focus:ring-rose-600
                      bg-white dark:bg-gray-950"
          />
        </div>
      </div>

      {/* محتوى الحجوزات */}
      <div className="space-y-6">
        {loading && <LoadingSkeleton />}

        {error && <ErrorMessage error={error} refetch={refetch} />}

        {data && filteredBookings.length === 0 && <EmptyState />}

        {data && filteredBookings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBookings.map((booking: Booking) => (
              <div
                key={booking._id}
                className="transform transition-all duration-200 hover:scale-[1.02]"
              >
                <BookingItem
                  _id={booking._id}
                  event={booking.event}
                  createdAt={booking.createdAt}
                  onCancelBooking={handleCancelBooking}
                  isLoading={cancelLoading}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer info */}
      {data?.bookings && filteredBookings.length > 0 && (
        <div
          className="text-center text-sm text-rose-600 dark:text-rose-400 
                      border-t border-rose-100 dark:border-rose-900 pt-6"
        >
          <p>
            يتم عرض {filteredBookings.length} من أصل {data.bookings.length} حجز
          </p>
        </div>
      )}
    </div>
  );
}
