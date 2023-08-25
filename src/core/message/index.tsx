import { t } from 'i18next';

export const Message = {
  success: ({
    text = '',
    title = t('components.message.Success'),
    cancelButtonText = t('components.message.Close'),
    showCloseButton = true,
    showCancelButton = false,
    showConfirmButton = false,
    confirmButtonColor = '#3b82f6',
    cancelButtonColor = '#ef4444',
    padding = 0,
  }: Type) =>
    import('sweetalert2').then(({ default: Swal }) =>
      Swal.fire({
        icon: 'success',
        timer: 3000,
        title,
        text,
        cancelButtonText,
        showCloseButton,
        showCancelButton,
        showConfirmButton,
        confirmButtonColor,
        cancelButtonColor,
        padding,
        customClass: {
          cancelButton: '!border !border-solid !border-teal-900 !bg-white !text-teal-900 hover:!bg-none',
        },
      }),
    ),
  warning: ({
    text = '',
    title = t('components.message.Warning'),
    cancelButtonText = t('components.message.Close'),
    confirmButtonText = t('components.message.Ok'),
    showCloseButton = true,
    showCancelButton = true,
    showConfirmButton = true,
    padding = 0,
  }: Type) =>
    import('sweetalert2').then(({ default: Swal }) =>
      Swal.fire({
        icon: 'warning',
        title,
        text,
        cancelButtonText,
        confirmButtonText,
        showCloseButton,
        showCancelButton,
        showConfirmButton,
        padding,
        customClass: {
          cancelButton: '!border !border-solid !border-black-900 !rounded-lg !text-teal-900 !bg-white',
        },
      }),
    ),
  error: ({
    text = '',
    title = t('components.message.Fail'),
    cancelButtonText = t('components.message.Close'),
    showCloseButton = true,
    showCancelButton = true,
    showConfirmButton = false,
    padding = 0,
  }: Type) =>
    import('sweetalert2').then(({ default: Swal }) =>
      Swal.fire({
        icon: 'error',
        title,
        text,
        cancelButtonText,
        showCloseButton,
        showCancelButton,
        showConfirmButton,
        padding,
        focusCancel: showCancelButton,
        timer: 6000,
        customClass: {
          cancelButton: '!border !border-solid !border-black-900 !rounded-lg !text-teal-900 !bg-white',
        },
      }),
    ),
  confirm: ({
    text = '',
    title = '',
    cancelButtonText = t('components.message.Close'),
    confirmButtonText = t('components.message.Ok'),
    onConfirm = () => null,
    onDenied = () => null,
    confirmButtonColor = '#3b82f6',
    cancelButtonColor = '#ef4444',
    showCloseButton = true,
    showCancelButton = true,
    showConfirmButton = true,
    padding = 0,
  }: Type) =>
    import('sweetalert2').then(({ default: Swal }) =>
      Swal.fire({
        icon: 'warning',
        text,
        title,
        cancelButtonText,
        confirmButtonText,
        confirmButtonColor,
        cancelButtonColor,
        showCancelButton,
        showConfirmButton,
        showCloseButton,
        padding,
      }).then((result) => {
        if (result.isConfirmed) {
          onConfirm();
        } else if (result.isDismissed) {
          onDenied();
        }
      }),
    ),
};
type Type = {
  text: string;
  title?: any;
  cancelButtonText?: any;
  confirmButtonText?: any;
  onConfirm?: () => void;
  onDenied?: () => void;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  showCloseButton?: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  padding?: number;
};
