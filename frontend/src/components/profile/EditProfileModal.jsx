import Modal from "../projects/Modal";
import ProfileEditForm from "./ProfileEditForm";

const EditProfileModal = ({ isOpen, onClose, onSaved }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" wide>
      <ProfileEditForm
        onCancel={onClose}
        onSaved={(updatedUser) => {
          onSaved?.(updatedUser);
          onClose();
        }}
      />
    </Modal>
  );
};

export default EditProfileModal;
