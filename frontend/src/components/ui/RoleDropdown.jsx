import { Listbox } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const roles = ["Producer", "Singer", "DJ", "Songwriter"];

export default function RoleDropdown({ value, onChange }) {
  return (
    <div className="relative w-full z-50">
      <Listbox value={value} onChange={onChange}>
        {/* BUTTON */}
        <Listbox.Button
          as={motion.button}
          whileTap={{ scale: 0.98 }}
          className="w-full flex justify-between items-center px-4 py-3 rounded-xl
          bg-white/5 backdrop-blur-xl border border-white/10 text-white
          hover:border-purple-400/40 transition"
        >
          <span>{value || "Select Role"}</span>
          <ChevronDown className="w-4 h-4 opacity-70" />
        </Listbox.Button>

        {/* OPTIONS */}
        <AnimatePresence>
          <Listbox.Options
            as={motion.ul}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute mt-2 w-full rounded-xl overflow-y-auto max-h-60
            bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 z-50 shadow-2xl"
          >
            {roles.map((role) => (
              <Listbox.Option key={role} value={role}>
                {({ active, selected }) => (
                  <li
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer transition
                      ${
                        active
                          ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white"
                          : "text-gray-300 hover:bg-white/5"
                      }`}
                  >
                    <span>{role}</span>
                    {selected && <Check className="w-4 h-4" />}
                  </li>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </AnimatePresence>
      </Listbox>
    </div>
  );
}
