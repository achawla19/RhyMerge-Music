const Avatar = ({ src, alt, size = "md", online }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <div className={`relative ${sizes[size]}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full rounded-full object-cover border border-gray-700"
      />

      {online && (
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#0a0a12]" />
      )}
    </div>
  );
};

export default Avatar;
