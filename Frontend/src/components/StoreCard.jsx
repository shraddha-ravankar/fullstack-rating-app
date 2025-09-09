const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-xl p-6 text-center"
        >
          <h3 className="text-lg font-medium text-gray-600">{item.label}</h3>
          <p className="text-3xl font-bold text-blue-700 mt-2">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
