import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { X } from "lucide-react";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  // FormDescription,
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

type EventModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FormSchema = z.object({
  title: z.string().min(4, {
    message: "يجب ان يكون العنوان مكون من 4 حروف على الاقل.",
  }),
  price: z.number().min(1, {
    message: "يجب ان يكون السعر مكون من رقم واحد على الاقل.",
  }),
  date: z.date(),
  description: z.string().min(10, {
    message: "يجب ان يكون الوصف مكون من 10 حروف على الاقل.",
  }),
});

const AddEventModal = ({ isOpen, onClose }: EventModalProps) => {
  const client = useApolloClient();
  const [CreateEvent] = useMutation(CREATE_EVENT, {
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
      client.refetchQueries({ include: ["Events"] });
    },
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      price: undefined,
      date: new Date(),
      description: "",
    },
  });

  if (!event) return null;

  function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log("القيم المدخلة:", values);
    CreateEvent({
      variables: {
        title: values.title,
        description: values.description,
        price: values.price,
        date: values.date.toISOString(),
      },
    });
  }

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
          <DialogTitle className="text-2xl font-semibold text-rose-900 dark:text-rose-100">
            إضافة مناسبة
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            {/* العنوان */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان</FormLabel>
                  <FormControl>
                    <Input placeholder="إسم المناسبة" {...field} />
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
                  <FormLabel>السعر</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="السعر"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* التاريخ */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>التاريخ</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value.toISOString().split("T")[0]}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
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
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Input placeholder="وصف المناسبة" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">إضافة</Button>
          </form>
        </Form>

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

          <div className="flex items-center gap-3"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;
