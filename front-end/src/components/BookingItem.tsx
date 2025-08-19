import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, DollarSign, Clock, X, Loader2 } from "lucide-react";
import { useState } from "react";

// تعريف أنواع البيانات
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
}

export default function BookingItem({
  _id,
  event,
  createdAt,
  onCancelBooking,
  isLoading = false,
}: BookingItemProps) {
  const [isCanceling, setIsCanceling] = useState(false);

  // تنسيق التاريخ
  const formatDate = (dateString: string | number) => {
    try {
      let date: Date;

      if (typeof dateString === "number") {
        date = new Date(dateString);
      } else {
        // إذا كان string، تحقق إذا كان timestamp رقمي
        const numericValue = Number(dateString);
        if (!isNaN(numericValue) && numericValue > 0) {
          date = new Date(numericValue);
        } else {
          date = new Date(dateString);
        }
      }

      // استخدام en-US للحصول على التاريخ الميلادي
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      // في حالة فشل التنسيق، استخدم طريقة بديلة
      const str = dateString.toString();
      return str.split(".")[0].split(" ")[0].replace(/-/g, "/");
    }
  };

  // تنسيق تاريخ الحجز
  const formatBookingDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // استخدام en-US للحصول على التاريخ الميلادي
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return new Date(dateString).toDateString();
    }
  };

  // التحقق من انتهاء صلاحية الحدث
  const isEventPassed = () => {
    try {
      const eventDate = new Date(event.date);
      const now = new Date();
      return eventDate < now;
    } catch {
      return false;
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

  const eventPassed = isEventPassed();

  return (
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
  );
}
