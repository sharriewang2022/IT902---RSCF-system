import { toast } from "react-toastify";

export const toastSuccess = (message: string) => {
  return toast.success(message, {
    position: "top-right",
    autoClose: 500,
    draggablePercent: 60,
  });
};

export const toastError = (message: string) => {
  return toast.error(message, {
    position: "top-right",
    autoClose: 500,
    draggablePercent: 60,
  });
};
