import { ReactElement, Dispatch as SetState, SetStateAction } from "react";

interface CustomModalProps {
  isOpen?: boolean;
  children: ReactElement;
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default CustomModal;
