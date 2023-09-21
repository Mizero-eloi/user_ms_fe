import React, { forwardRef, useImperativeHandle } from "react";

const Modal = forwardRef((props, ref) => {
  const [showModal, setShowModal] = React.useState(false);
  useImperativeHandle(ref, () => ({
    toggleModal() {
      setShowModal(!showModal);
    },
  }));
  return (
    <>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div
              className="relative w-auto mx-auto my-6 rounded bg-main"
              style={{ width: props.width, maxWidth: "100vw" }}
            >
              <div className="relative flex flex-col w-full px-3 bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                <div className="modal">{props.children}</div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}
    </>
  );
});

export default Modal;
