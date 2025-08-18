import { useContext } from "react";
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
import { CalendarDays, DollarSign, User } from "lucide-react";

type EventItemProps = {
  _id: string;
  title: string;
  price: number;
  date: string;
  description?: string;
  creator: { _id: string; [key: string]: unknown };
  onDetail: (_id: string) => void;
};

export default function EventItem({
  _id,
  title,
  price,
  date,
  description,
  creator,
  onDetail,
}: EventItemProps) {
  const value = useContext(AuthContext);

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    return dateString.split(".")[0].split(" ")[0].replace(/-/g, "/");
  };

  // تحديد ما إذا كان المستخدم هو صاحب الحدث
  const isOwner = value.userId === creator._id;

  return (
    <Card
      className="group hover:shadow-lg dark:hover:shadow-rose-500/25 transition-all duration-300 
                        border-rose-200 hover:border-rose-300 
                        dark:border-rose-800 dark:hover:border-rose-600 
                        bg-gradient-to-br from-white to-rose-50/30 
                        dark:from-gray-950 dark:to-rose-950/20 
                        overflow-hidden"
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
          {isOwner && (
            <Badge
              variant="secondary"
              className="bg-rose-100 text-rose-700 hover:bg-rose-200 
                                        dark:bg-rose-900 dark:text-rose-300 dark:hover:bg-rose-800 
                                        shrink-0 ml-2"
            >
              <User className="w-3 h-3 mr-1" />
              مالك
            </Badge>
          )}
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
        {isOwner ? (
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
