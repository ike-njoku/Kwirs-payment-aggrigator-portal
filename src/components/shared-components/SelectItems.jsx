import { useEffect, useState } from "react";

const SelectItems = ({ selectedItem, setSelectedItem }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/SelectItems/GetAll`
        );
        if (!response.ok) throw new Error("Failed to fetch items");

        const data = await response.json();

        if (data?.Data && Array.isArray(data.Data) && data.Data.length > 0) {
          setItems(data.Data);
        } else {
          console.warn("No items found, using demo data.");
          setItems([
            { itemName: "Item 1", value: 1000 },
            { itemName: "Item 1", value: 1000 },
            { itemName: "Item 1", value: 1000 },
          ]);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        setItems([
          { itemName: "Item 1", value: 1000 },
          { itemName: "Item 1", value: 1000 },
          { itemName: "Item 1", value: 1000 },
        ]);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="w-full">
      <label
        className="text-base font-medium text-gray-700"
        htmlFor="itemSelect"
      >
        Item
      </label>

      <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
        <select
          id="itemSelect"
          className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
          required
        >
          <option value="">Select an Item</option>
          {items.map((item, index) => (
            <option key={index} value={item.value}>
              {item.itemName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectItems;
