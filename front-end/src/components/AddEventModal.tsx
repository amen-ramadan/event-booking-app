import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { X, Calendar, Clock } from "lucide-react";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CREATE_EVENT } from "@/api/queries";
import { useApolloClient, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { useState } from "react";

type EventModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// دالة مساعدة للحصول على أقل تاريخ مسموح (ساعة من الآن)
const getMinDateTime = () => {
  const now = new Date();
  // إضافة ساعة واحدة للوقت الحالي
  now.setHours(now.getHours() + 1);
  return now;
};

// دالة مساعدة لتنسيق التاريخ والوقت لـ datetime-local input
const formatDateTimeLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const FormSchema = z.object({
  title: z.string().min(4, {
    message: "يجب ان يكون العنوان مكون من 4 حروف على الاقل.",
  }),
  price: z.number().min(1, {
    message: "يجب ان يكون السعر مكون من رقم واحد على الاقل.",
  }),
  date: z.date().refine(
    (date) => {
      const minDate = getMinDateTime();
      return date >= minDate;
    },
    {
      message: "يجب أن يكون موعد المناسبة بعد ساعة على الأقل من الوقت الحالي.",
    }
  ),
  description: z.string().min(10, {
    message: "يجب ان يكون الوصف مكون من 10 حروف على الاقل.",
  }),
});

const AddEventModal = ({ isOpen, onClose }: EventModalProps) => {
  const client = useApolloClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [CreateEvent] = useMutation(CREATE_EVENT, {
    onError: (error) => {
      setIsSubmitting(false);
      toast.error(error.message, {
        duration: 5000,
        position: "top-center",
      });
    },
    onCompleted: () => {
      setIsSubmitting(false);
      toast.success("تمت إضافة المناسبة بنجاح", {
        duration: 5000,
        position: "top-center",
      });
      client.refetchQueries({ include: ["Events"] });
      form.reset();
      onClose();
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      price: undefined,
      date: getMinDateTime(), // القيمة الافتراضية: ساعة من الآن
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);

    CreateEvent({
      variables: {
        title: values.title,
        description: values.description,
        price: values.price,
        date: values.date.toISOString(),
      },
    });
  }

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      onClose();
    }
  };

  // الحصول على أقل تاريخ ووقت مسموح للإدخال
  const minDateTime = formatDateTimeLocal(getMinDateTime());

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto
                  bg-gradient-to-br from-white to-rose-50 
                  dark:from-gray-950 dark:to-rose-950
                  border-rose-200 dark:border-rose-800"
      >
        {/* Header */}
        <DialogHeader className="space-y-4 pb-6">
          <DialogTitle className="text-2xl font-semibold text-rose-900 dark:text-rose-100 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            إضافة مناسبة جديدة
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* العنوان */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-rose-800 dark:text-rose-200 font-medium">
                      عنوان المناسبة
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="أدخل اسم المناسبة..."
                        className="border-rose-200 dark:border-rose-700 focus:border-rose-400 dark:focus:border-rose-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* السعر */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-rose-800 dark:text-rose-200 font-medium">
                      سعر التذكرة
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="0.00"
                        className="border-rose-200 dark:border-rose-700 focus:border-rose-400 dark:focus:border-rose-500"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : Number(value)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* التاريخ والوقت */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-rose-800 dark:text-rose-200 font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    تاريخ ووقت المناسبة
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      min={minDateTime}
                      className="border-rose-200 dark:border-rose-700 focus:border-rose-400 dark:focus:border-rose-500"
                      value={
                        field.value ? formatDateTimeLocal(field.value) : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value) {
                          field.onChange(new Date(value));
                        }
                      }}
                    />
                  </FormControl>
                  <div className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                    * يجب أن يكون موعد المناسبة بعد ساعة على الأقل من الوقت
                    الحالي
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* الوصف */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-rose-800 dark:text-rose-200 font-medium">
                    وصف المناسبة
                  </FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="أدخل وصف مفصل عن المناسبة..."
                      className="flex min-h-[100px] w-full rounded-md border border-rose-200 dark:border-rose-700 
                                bg-background px-3 py-2 text-sm ring-offset-background 
                                placeholder:text-muted-foreground 
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
                                focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
                                focus:border-rose-400 dark:focus:border-rose-500 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* أزرار الإجراءات */}
            <div className="flex items-center justify-between pt-6 border-t border-rose-200 dark:border-rose-800">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="border-gray-300 text-gray-700 hover:bg-gray-100
                          dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <X className="w-4 h-4 mr-2" />
                إلغاء
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-rose-600 hover:bg-rose-700 text-white
                          dark:bg-rose-700 dark:hover:bg-rose-800
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-transparent border-t-white" />
                    جاري الإضافة...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    إضافة المناسبة
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;
