import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";

// مكون Error
interface ErrorMessageProps {
  error: { message?: string };
  refetch: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, refetch }) => (
  <Alert className="border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/50">
    <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
    <AlertDescription className="text-rose-800 dark:text-rose-200">
      حدث خطأ أثناء تحميل الأحداث: {error?.message}
      <Button
        variant="outline"
        size="sm"
        onClick={() => refetch()}
        className="ml-4 border-rose-300 text-rose-700 hover:bg-rose-100
                    dark:border-rose-600 dark:text-rose-300 dark:hover:bg-rose-950"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        إعادة المحاولة
      </Button>
    </AlertDescription>
  </Alert>
);

export default ErrorMessage;
