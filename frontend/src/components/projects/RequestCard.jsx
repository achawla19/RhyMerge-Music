import { acceptRequest, rejectRequest } from "../../api/projectRequests";

import { useNavigate } from "react-router-dom";

export default function RequestCard({ request }) {
  const navigate = useNavigate();

  const user = request.sender;

  return (
    <div
      className="
        flex
        items-center
        justify-between

        py-4

        border-b
        border-white/[0.05]
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <img
          src={
            user.avatar || `https://ui-avatars.com/api/?name=${user.username}`
          }
          alt=""
          onClick={() => navigate(`/profile/${user.username}`)}
          className="
            w-12 h-12

            rounded-full

            cursor-pointer
          "
        />

        <div>
          <p className="text-white">{user.username}</p>

          <p
            className="
              text-xs
              text-slate-400
            "
          >
            {user.role}
          </p>

          <p
            className="
              text-xs
              text-purple-400
            "
          >
            Wants to join as: {request.role}
          </p>
        </div>
      </div>

      <div
        className="
          flex gap-2
        "
      >
        <button
          onClick={() => acceptRequest(request._id)}
          className="
            px-4 py-2

            rounded-xl

            bg-green-500/20

            text-green-400
          "
        >
          Accept
        </button>

        <button
          onClick={() => rejectRequest(request._id)}
          className="
            px-4 py-2

            rounded-xl

            bg-red-500/20

            text-red-400
          "
        >
          Reject
        </button>
      </div>
    </div>
  );
}
