import { useContext } from "react";
import AuthContext from "../context/auth-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  DollarSign,
  User,
  MapPin,
  Clock,
  Users,
  Star,
  Share2,
  X,
} from "lucide-react";
import { Link } from "react-router";
import { useMutation } from "@apollo/client";
import { BOOK_EVENT } from "@/api/queries";

type EventModalProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any;
  isOpen: boolean;
  onClose: () => void;
};

const EventModal = ({ event, isOpen, onClose }: EventModalProps) => {
  const value = useContext(AuthContext);
  // mutation for create event
  const [bookEventHandler] = useMutation(BOOK_EVENT, {
    onError: (error) => {
      toast.error(error.message, {
        duration: 5000,
        position: "top-center",
      });
    },
    onCompleted: () => {
      toast.success("تم الحجز بنجاح", {
        duration: 5000,
        position: "top-center",
      });
    },
  });

  if (!event) return null;

  // تنسيق التاريخ والوقت
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("ar-EG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const { date: formattedDate, time: formattedTime } = formatDate(event.date);
  const isOwner = value.token && value.userId === event.creator._id;

  // دوال التفاعل
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      // fallback للنسخ إلى الحافظة
      navigator.clipboard.writeText(`${event.title} - ${window.location.href}`);
    }
  };

  const handleBooking = () => {
    bookEventHandler({
      variables: {
        eventId: event._id,
      },
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto
                  bg-gradient-to-br from-white to-rose-50 
                  dark:from-gray-950 dark:to-rose-950
                  border-rose-200 dark:border-rose-800"
      >
        {/* Header */}
        <DialogHeader className="space-y-4 pb-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <DialogTitle
                className="text-3xl font-bold 
                                    text-rose-900 dark:text-rose-100 
                                    leading-tight"
              >
                {event.title}
              </DialogTitle>

              {/* Creator Info */}
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span className="text-sm font-medium text-rose-700 dark:text-rose-300">
                  منظم بواسطة: {event.creator.username}
                </span>
                {isOwner && (
                  <Badge
                    variant="secondary"
                    className="bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300"
                  >
                    مناسبتك
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* التاريخ والوقت */}
            <div
              className="space-y-4 p-6 rounded-lg 
                          bg-rose-50 dark:bg-rose-950/30 
                          border border-rose-200 dark:border-rose-800"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100">
                  التاريخ والوقت
                </h3>
              </div>
              <div className="space-y-2">
                <p className="text-rose-800 dark:text-rose-200 font-medium">
                  {formattedDate}
                </p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span className="text-rose-700 dark:text-rose-300">
                    {formattedTime}
                  </span>
                </div>
              </div>
            </div>

            {/* السعر */}
            <div
              className="space-y-4 p-6 rounded-lg 
                          bg-emerald-50 dark:bg-emerald-950/30 
                          border border-emerald-200 dark:border-emerald-800"
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                  رسوم المشاركة
                </h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-emerald-700 dark:text-emerald-300">
                  ${event.price}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 text-sm">
                  للشخص الواحد
                </span>
              </div>
              {event.price === 0 && (
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  مجاني
                </Badge>
              )}
            </div>
          </div>

          <Separator className="bg-rose-200 dark:bg-rose-800" />

          {/* الوصف */}
          {event.description && (
            <div className="space-y-4">
              <h3
                className="text-xl font-semibold text-rose-900 dark:text-rose-100 
                            flex items-center gap-2"
              >
                <Star className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                تفاصيل المناسبة
              </h3>
              <div
                className="prose prose-rose dark:prose-invert max-w-none
                            p-6 rounded-lg bg-gray-50 dark:bg-gray-900/50
                            border border-gray-200 dark:border-gray-700"
              >
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                  {event.description}
                </p>
              </div>
            </div>
          )}

          {/* معلومات إضافية */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="text-center p-4 rounded-lg 
                          bg-blue-50 dark:bg-blue-950/30 
                          border border-blue-200 dark:border-blue-800"
            >
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <div className="text-sm text-blue-600 dark:text-blue-400">
                المشاركين
              </div>
              <div className="font-bold text-blue-800 dark:text-blue-200">
                قريباً
              </div>
            </div>

            <div
              className="text-center p-4 rounded-lg 
                          bg-purple-50 dark:bg-purple-950/30 
                          border border-purple-200 dark:border-purple-800"
            >
              <MapPin className="w-8 h-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
              <div className="text-sm text-purple-600 dark:text-purple-400">
                الموقع
              </div>
              <div className="font-bold text-purple-800 dark:text-purple-200">
                قريباً
              </div>
            </div>

            <div
              className="text-center p-4 rounded-lg 
                          bg-orange-50 dark:bg-orange-950/30 
                          border border-orange-200 dark:border-orange-800"
            >
              <Star className="w-8 h-8 mx-auto mb-2 text-orange-600 dark:text-orange-400" />
              <div className="text-sm text-orange-600 dark:text-orange-400">
                التقييم
              </div>
              <div className="font-bold text-orange-800 dark:text-orange-200">
                قريباً
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-rose-200 dark:border-rose-800">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-100
                      dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <X className="w-4 h-4 mr-2" />
            إغلاق
          </Button>

          <div className="flex items-center gap-3">
            {!isOwner && value.token && (
              <>
                <Button
                  onClick={handleBooking}
                  className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700
                            dark:from-rose-600 dark:to-rose-700 dark:hover:from-rose-700 dark:hover:to-rose-800
                            text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Users className="w-4 h-4 mr-2" />
                  احجز مكانك
                </Button>
              </>
            )}
            {!value.token && !isOwner && (
              <>
                <Button
                  className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700
                            dark:from-rose-600 dark:to-rose-700 dark:hover:from-rose-700 dark:hover:to-rose-800
                            text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Users className="w-4 h-4 mr-2" />
                  <Link to="/login">سجل دخول لتحجز</Link>
                </Button>
              </>
            )}

            {isOwner && (
              <Badge
                variant="secondary"
                className="bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300 px-4 py-2"
              >
                <User className="w-4 h-4 mr-2" />
                أنت منظم هذه المناسبة
              </Badge>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
