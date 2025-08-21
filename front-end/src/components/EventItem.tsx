import { useContext, useState } from "react";
import AuthContext from "../context/auth-context";
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
import { CalendarDays, DollarSign, User, X, Loader2 } from "lucide-react";
import { useMutation } from "@apollo/client";
import { DELETE_EVENT } from "@/api/queries";
import { toast } from "sonner";

type EventItemProps = {
  _id: string;
  title: string;
  price: number;
  date: string;
  description?: string;
  creator: { _id: string; [key: string]: unknown };
  onDetail: (_id: string) => void;
  isLoading?: boolean;
  onRefetch?: () => void; // تغيير الاسم من refetch إلى onRefetch
};

export default function EventItem({
  _id,
  title,
  price,
  date,
  description,
  creator,
  onDetail,
  isLoading = false,
  onRefetch,
}: EventItemProps) {
  const value = useContext(AuthContext);
  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteEventHandler] = useMutation(DELETE_EVENT, {
    onError: (error) => {
      setIsDeleting(false);
      toast.error(error.message, {
        duration: 5000,
        position: "top-center",
      });
    },
    onCompleted: () => {
      setIsDeleting(false);
      toast.success("تم حذف المناسبة بنجاح", {
        duration: 5000,
        position: "top-center",
      });
      if (onRefetch) {
        onRefetch();
      }
    },
  });

  // دالة محسّنة لتحليل التاريخ
  const parseEventDate = (dateString: string): Date | null => {
    try {
      // محاولة تحليل التاريخ بعدة طرق
      let date: Date;

      // إذا كان التاريخ يحتوي على نقطة (timestamp format)
      if (dateString.includes(".")) {
        const cleanDate = dateString.split(".")[0];
        date = new Date(cleanDate);
      } else {
        date = new Date(dateString);
      }

      // التحقق من صحة التاريخ
      if (isNaN(date.getTime())) {
        return null;
      }

      return date;
    } catch (error) {
      console.error("Error parsing event date:", error);
      return null;
    }
  };

  // فحص ما إذا كان الحدث قد انتهى
  const isEventPassed = (): boolean => {
    const eventDate = parseEventDate(date);
    if (!eventDate) {
      console.warn("Invalid event date:", date);
      return false; // إذا كان التاريخ غير صالح، اعتبر الحدث لم ينته
    }

    const now = new Date();
    return eventDate < now;
  };

  // تنسيق التاريخ مع معالجة الأخطاء
  const formatDate = (dateString: string) => {
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

  // تحديد ما إذا كان المستخدم هو صاحب الحدث
  const isOwner = value.userId === creator._id;

  // تحديد ما إذا كان الحدث قد انتهى
  const eventPassed = isEventPassed();

  // دالة حذف المناسبة
  const handleDeleteEvent = async () => {
    if (isDeleting || isLoading) return;

    setIsDeleting(true);
    try {
      await deleteEventHandler({
        variables: {
          eventId: _id,
        },
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      setIsDeleting(false);
    }
  };

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
            {title}
          </CardTitle>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {eventPassed && (
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 
                                        dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                انتهى
              </Badge>
            )}
            {isOwner && (
              <Badge
                variant="secondary"
                className="bg-rose-100 text-rose-700 hover:bg-rose-200 
                                        dark:bg-rose-900 dark:text-rose-300 dark:hover:bg-rose-800"
              >
                <User className="w-3 h-3 mr-1" />
                مالك
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* السعر والتاريخ */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <DollarSign className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span
              className="font-bold text-2xl 
                    text-rose-700 dark:text-rose-300"
            >
              ${price}
            </span>
          </div>
          <div
            className="flex items-center space-x-2 rtl:space-x-reverse 
                      text-rose-600 dark:text-rose-400"
          >
            <CalendarDays className="w-4 h-4" />
            <span className="text-sm font-medium">{formatDate(date)}</span>
          </div>
        </div>

        {/* الوصف إذا كان موجوداً */}
        {description && (
          <CardDescription className="text-gray-600 dark:text-gray-300 line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        {isOwner && eventPassed ? (
          // إذا كان المستخدم مالك الحدث والحدث انتهى
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
              onClick={handleDeleteEvent}
              disabled={isDeleting || isLoading}
              variant="outline"
              className="w-full 
            border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400
            dark:border-red-600 dark:text-red-300 dark:hover:bg-red-950 dark:hover:border-red-500
            font-medium transition-all duration-200 
            shadow-md hover:shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  حذف المناسبة
                </>
              )}
            </Button>
          </div>
        ) : eventPassed ? (
          // إذا كان الحدث انتهى وليس المستخدم مالكه
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
        ) : isOwner ? (
          // إذا كان المستخدم مالك الحدث والحدث لم ينته
          <Button
            onClick={() => onDetail(_id)}
            variant="outline"
            className="w-full 
            border-rose-300 text-rose-700 hover:bg-rose-50 hover:border-rose-400
            dark:border-rose-600 dark:text-rose-300 dark:hover:bg-rose-950 dark:hover:border-rose-500
            font-medium transition-all duration-200 
            shadow-md hover:shadow-lg"
          >
            أنت صاحب هذه المناسبة
          </Button>
        ) : (
          // إذا لم يكن المستخدم مالك الحدث والحدث لم ينته
          <Button
            onClick={() => onDetail(_id)}
            className="w-full 
            bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 
            dark:from-rose-600 dark:to-rose-700 dark:hover:from-rose-700 dark:hover:to-rose-800
            text-white font-medium transition-all duration-200 
            shadow-md hover:shadow-lg dark:shadow-rose-900/50"
          >
            عرض التفاصيل
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
