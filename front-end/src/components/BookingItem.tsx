import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, DollarSign, Clock, X, Loader2 } from "lucide-react";
import { useState } from "react";

interface BookingEvent {
  _id: string;
  title: string;
  description: string;
  price: number;
  date: string | number;
  creator?: {
    _id: string;
    email?: string;
    [key: string]: unknown;
  };
}

interface BookingItemProps {
  _id: string;
  event: BookingEvent;
  createdAt: string;
  onCancelBooking: (bookingId: string) => Promise<void>;
  isLoading?: boolean;
  cardLoading?: boolean;
}

export default function BookingItem({
  _id,
  event,
  createdAt,
  onCancelBooking,
  isLoading = false,
}: BookingItemProps) {
  const [isCanceling, setIsCanceling] = useState(false);

  // دالة محسّنة للتحقق من صحة التاريخ وتحويله
  function parseEventDate(dateInput: string | number): Date | null {
    try {
      let date: Date;

      if (typeof dateInput === "number") {
        date = new Date(dateInput);
      } else if (typeof dateInput === "string") {
        // التحقق إذا كان الـ string رقم
        const numericValue = Number(dateInput);
        if (!isNaN(numericValue) && numericValue > 0) {
          date = new Date(numericValue);
        } else {
          date = new Date(dateInput);
        }
      } else {
        return null;
      }

      // التحقق من صحة التاريخ
      if (isNaN(date.getTime())) {
        return null;
      }

      return date;
    } catch (error) {
      console.error("Error parsing date:", error);
      return null;
    }
  }

  function isEventPassed() {
    const eventDate = parseEventDate(event.date);
    if (!eventDate) {
      console.warn("Invalid event date:", event.date);
      return false; // إذا كان التاريخ غير صالح، اعتبر الحدث لم ينتهِ
    }

    const now = new Date();
    console.log("eventDate", eventDate, "now", now);
    return eventDate < now;
  }

  const eventPassed = isEventPassed();

  // تنسيق التاريخ مع معالجة الأخطاء
  const formatDate = (dateString: string | number) => {
    const parsedDate = parseEventDate(dateString);

    if (!parsedDate) {
      return "تاريخ غير صالح";
    }

    try {
      return parsedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      // fallback formatting
      return parsedDate.toDateString();
    }
  };

  // تنسيق تاريخ الحجز
  const formatBookingDate = (dateString: string) => {
    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "تاريخ غير صالح";
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "تاريخ غير صالح";
    }
  };

  // دالة إلغاء الحجز مع handling للحالة
  const handleCancel = async () => {
    if (isCanceling || isLoading) return;

    setIsCanceling(true);
    try {
      await onCancelBooking(_id);
    } catch (error) {
      console.error("Error canceling booking:", error);
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <>
      <Card
        className={`group hover:shadow-lg dark:hover:shadow-rose-500/25 transition-all duration-300 
                border-rose-200 hover:border-rose-300 
                dark:border-rose-800 dark:hover:border-rose-600 
                bg-gradient-to-br from-white to-rose-50/30 
                dark:from-gray-950 dark:to-rose-950/20 
                overflow-hidden
                ${eventPassed ? "opacity-75" : ""}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle
              className="text-xl font-bold 
                      text-rose-900 group-hover:text-rose-700 
                      dark:text-rose-100 dark:group-hover:text-rose-300 
                      transition-colors line-clamp-2"
            >
              {event.title}
            </CardTitle>
            {eventPassed && (
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 
                                        dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 
                                        shrink-0 ml-2"
              >
                انتهى
              </Badge>
            )}
          </div>

          {/* تاريخ الحجز */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-rose-600 dark:text-rose-400">
            <Clock className="w-4 h-4" />
            <span>تم الحجز في: {formatBookingDate(createdAt)}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* السعر وتاريخ الحدث */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <DollarSign className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span
                className="font-bold text-2xl 
                      text-rose-700 dark:text-rose-300"
              >
                {event.price}
              </span>
            </div>
            <div
              className="flex items-center space-x-2 rtl:space-x-reverse 
                      text-rose-600 dark:text-rose-400"
            >
              <CalendarDays className="w-4 h-4" />
              <span className="text-sm font-medium">
                {formatDate(event.date)}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          {eventPassed ? (
            <div className="flex flex-col gap-2 w-full">
              <Button
                disabled
                variant="outline"
                className="w-full 
            border-gray-300 text-gray-500
            dark:border-gray-600 dark:text-gray-400
            font-medium"
              >
                انتهى الحدث
              </Button>
              <Button
                onClick={handleCancel}
                disabled={isCanceling || isLoading}
                variant="outline"
                className="w-full 
            border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400
            dark:border-red-600 dark:text-red-300 dark:hover:bg-red-950 dark:hover:border-red-500
            font-medium transition-all duration-200 
            shadow-md hover:shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCanceling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    جاري الإلغاء...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    حذف المناسبة
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleCancel}
              disabled={isCanceling || isLoading}
              variant="outline"
              className="w-full 
            border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400
            dark:border-red-600 dark:text-red-300 dark:hover:bg-red-950 dark:hover:border-red-500
            font-medium transition-all duration-200 
            shadow-md hover:shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCanceling || isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  جاري الإلغاء...
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  إلغاء الحجز
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
