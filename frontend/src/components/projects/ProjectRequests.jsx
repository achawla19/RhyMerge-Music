import { useNavigate } from "react-router-dom";

import { acceptRequest, rejectRequest } from "../../api/projectRequests";

export default function ProjectRequests({ requests, refresh }) {
  const navigate = useNavigate();

  return (
    <div
      className="
        rounded-3xl

        bg-white/[0.04]

        border border-white/[0.08]

        p-6
      "
    >
      <h3
        className="
          text-white
          text-lg
          font-semibold

          mb-5
        "
      >
        Pending Requests
      </h3>

      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request._id}
            className="
              flex
              items-center
              justify-between

              bg-white/[0.03]

              rounded-2xl

              p-4
            "
          >
            <div
              onClick={() => navigate(`/profile/${request.sender.username}`)}
              className="
                flex
                items-center
                gap-3

                cursor-pointer
              "
            >
              <img
                src={
                  request.sender.avatar ||
                  `https://ui-avatars.com/api/?name=${request.sender.username}`
                }
                alt=""
                className="
                  w-12
                  h-12

                  rounded-full

                  hover:scale-105

                  transition-all
                "
              />

              <div>
                <p className="text-white">{request.sender.username}</p>

                <p className="text-xs text-slate-400">{request.sender.role}</p>

                <p className="text-xs text-purple-400">
                  Wants to join as {request.role}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await acceptRequest(request._id);

                  await refresh();
                  window.location.reload();
                }}
                className="
                  px-4 py-2

                  rounded-xl

                  bg-green-500/15

                  text-green-400
                "
              >
                Accept
              </button>

              <button
                onClick={async () => {
                  await rejectRequest(request._id);

                  refresh();
                }}
                className="
                  px-4 py-2

                  rounded-xl

                  bg-red-500/15

                  text-red-400
                "
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
