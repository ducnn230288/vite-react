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
      }),
    ),
  confirm: ({
    text = '',
    title = '',
    input,
    cancelButtonText = t('components.message.Close'),
    confirmButtonText = t('components.message.Ok'),
    onConfirm = () => null,
    onDenied = () => null,
    preConfirm = () => null,
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
        input,
        inputAttributes: {
          autocapitalize: 'off',
        },
        preConfirm: async (value) => {
          try {
            await preConfirm(value);
          } catch (error) {
            Swal.showValidationMessage(error!.toString());
          }
        },
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
  input?: 'text' | 'number';
  cancelButtonText?: any;
  confirmButtonText?: any;
  preConfirm?: (value: string) => void;
  onConfirm?: () => void;
  onDenied?: () => void;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  showCloseButton?: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  padding?: number;
};
