const StoreTable = ({ owners }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4">Owners & Their Stores</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Owner</th>
            <th className="p-3">Email</th>
            <th className="p-3">Stores</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((o, i) => (
            <tr key={i} className="border-t">
              <td className="p-3">{o.name}</td>
              <td className="p-3">{o.email}</td>
              <td className="p-3">{o.stores.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoreTable;
