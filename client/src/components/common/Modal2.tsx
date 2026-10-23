import React, { useRef, useEffect } from 'react';  

interface ModalProps {  
  isOpen: boolean;  
  onClose: () => void;
  children: React.ReactNode;  
}  

export const Modal2: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {  
  const modalRef = useRef<HTMLDialogElement | null>(null);  
  const overlayRef = useRef<HTMLDivElement | null>(null);  

  // Open and close modal methods  
  const openModal = () => {  
    modalRef.current?.showModal();  
  };  

  const closeModal = () => {  
    modalRef.current?.close();  
    onClose();  
  };  

  // Show modal when isOpen is true  
  useEffect(() => {  
    if (isOpen) {  
      openModal();  
    }  
  }, [isOpen]);  

  // Close modal on outside click  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {  
    if (overlayRef.current && overlayRef.current === e.target) {  
      closeModal();  
    }  
  };  

  return (  
    <>  
      <div  
        ref={overlayRef}  
        className={`fixed w-full inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`} // Overlay styling  
        onClick={handleOverlayClick}  
      >  
        <dialog ref={modalRef} className="modal">  
          <div className="w-full modal-bo h-full p-">  
            <form method="dialog" onSubmit={(e) => { e.preventDefault(); closeModal(); }}>  
              <button  
                type="button"  
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"  
                onClick={closeModal}  
              >  
                ✕  
              </button>  
            </form>  
            <h3 className="font-bold text-lg">{title}</h3>  
            <div className="py-4">{children}</div>  
          </div>  
        </dialog>  
      </div>  
    </>  
  );  
};  