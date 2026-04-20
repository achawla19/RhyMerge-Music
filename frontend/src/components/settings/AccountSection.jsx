const AccountSection = () => {
  return (
    <div>
      <h2 className="text-white font-semibold text-lg mb-1">Account</h2>
      <p className="text-gray-500 text-sm mb-5">
        Manage your account information
      </p>
      <div className="space-y-4">
        <div>
          <label className="text-gray-400 text-sm mb-1 block">
            Display Name
          </label>
          <input
            defaultValue="Akshit"
            className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition"
          />
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Username</label>
          <div className="flex items-center">
            <span className="rounded-l-xl border border-r-0 border-white/10 bg-white/5 px-3 py-2.5 text-sm text-gray-500">
              @
            </span>
            <input
              defaultValue="akshit_dev"
              className="flex-1 bg-white/5 border border-white/10 text-white rounded-r-xl px-4 py-2.5 outline-none focus:border-purple-500 transition"
            />
          </div>
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Email</label>
          <input
            type="email"
            defaultValue="akshit@example.com"
            className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition"
          />
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Role</label>
          <select className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition">
            <option value="producer">Producer</option>
            <option value="vocalist">Vocalist</option>
            <option value="guitarist">Guitarist</option>
            <option value="drummer">Drummer</option>
            <option value="dj">DJ</option>
            <option value="composer">Composer</option>
          </select>
        </div>
        <button
          className="bg-white/5 text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-400
hover:bg-clip-text hover:text-transparent hover:opacity-90  px-6 py-2.5 rounded-3xl font-medium hover:opacity-90 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
export default AccountSection;
