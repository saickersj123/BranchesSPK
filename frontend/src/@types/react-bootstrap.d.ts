// frontend/src/@types/react-bootstrap.d.ts
declare module 'react-bootstrap' {
    import { ButtonProps, FormProps, AlertProps, ModalProps, DropdownProps } from 'react-bootstrap';
    import { ReactNode } from 'react';
  
    export const Button: React.FC<ButtonProps>;
    export const Form: React.FC<FormProps> & {
        Group: React.FC<FormGroupProps>;
        Label: React.FC<FormLabelProps>;
        Control: React.FC<FormControlProps>;
    };
    export const Alert: React.FC<AlertProps>;
    export const Modal: React.FC<ModalProps> & {
        Header: React.FC<{ children: ReactNode; closeButton?: boolean; className?: string }>; // Added className
        Body: React.FC<{ children: ReactNode; className?: string }>;   // Added className
        Footer: React.FC<{ children: ReactNode; className?: string }>; // Added className
        Title: React.FC<{ children: ReactNode }>;  // Modal.Title에 children 추가
    };
    export const Dropdown: React.FC<DropdownProps> & {
        Toggle: React.FC<{ children: ReactNode; variant?: string; id?: string; className?: string }>; // className 추가
        Menu: React.FC<{ children: ReactNode; className?: string }>;   // Dropdown.Menu에 className 추가
        Item: React.FC<{ children: ReactNode; onClick?: () => void; className?: string }>;   // Dropdown.Item에 className 추가
    };
    export const Container: React.FC<ContainerProps>; // Add Container export
}